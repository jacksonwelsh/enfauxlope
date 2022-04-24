const express = require("express");
const dotenv = require("dotenv");
const db = require("./db");
var cors = require("cors");
const {
  getUser,
  pool,
  getAggregatedTransactionsForMonth,
  getLimitForCategory,
  getCategories,
  getTransactionsInCategory,
  getCardIdForUser,
  createLimit,
} = db;

dotenv.config();

const app = express();
app.use(cors());

const setupForStripeWebhooks = {
  // Because Stripe needs the raw body, we compute it but only when hitting the Stripe callback URL.
  verify: function (req, res, buf) {
    var url = req.originalUrl;
    if (url.startsWith("/webhook")) {
      req.rawBody = buf.toString();
    }
  },
};

app.use(express.json(setupForStripeWebhooks));

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_TOKEN);

const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_CLIENT_SECRET,
    },
  },
});
const client = new PlaidApi(configuration);

const users = [
  {
    id: "4adabd1f-e2e3-4187-ad98-d438805d8a82",
    name: "Johnny Sims",
    mode: "plaid",
  },
];

app.get("/", (_, res) => {
  res.send({
    status: "it works!",
  });
});

app.post("/link", async (req, res) => {
  // Get the client_user_id by searching for the current user
  const clientUserId = users[req.body?.userId ?? 0].id;
  const request = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: clientUserId,
    },
    client_name: "Enfauxlope",
    products: ["transactions"],
    language: "en",
    // webhook: "https://api.enfauxlope.tech/webhook",
    // redirect_uri: "https://enfauxlope.tech/oauth",
    country_codes: ["US"],
  };
  try {
    const createTokenResponse = await client.linkTokenCreate(request);
    console.log({ resp: createTokenResponse.data });
    res.send(createTokenResponse.data);
  } catch (error) {
    res.send({ error: error, message: error.message });
    // handle error
  }
});

app.post("/link/exchange", async (req, res) => {
  const user = users[req.body?.userId ?? 0];
  try {
    const exchangeResponse = await client.itemPublicTokenExchange({
      public_token: req.body?.public_token,
    });
    // commit response to db
    const dbUser = await getUser(user.id);
    console.log({ dbUser });

    if (!dbUser)
      pool.query(
        "INSERT INTO users (id, name, token, item_id) VALUES ($1, $2, $3, $4)",
        [
          user.id,
          user.name,
          exchangeResponse.data.access_token,
          exchangeResponse.data.item_id,
        ],
      );
    else
      pool.query("UPDATE users SET token = $1, item_id = $2 WHERE id = $3", [
        exchangeResponse.data.access_token,
        exchangeResponse.data.item_id,
        dbUser.id,
      ]);
    res.send({ success: true, itemId: exchangeResponse.data.item_id });
  } catch (error) {
    res.send({ error: error, message: error.message });
  }
});

app.post("/cards/create", async (req, res) => {
  const user = users[req.body?.userId ?? 0];
  const dbUser = await getUser(user.id);

  const card = await stripe.issuing.cards.create({
    cardholder: dbUser.cardholder_id,
    currency: "usd",
    type: "virtual",
  });

  await pool.query("INSERT INTO cards (cardholder, card) VALUES ($1, $2)", [
    dbUser.id,
    card.id,
  ]);

  res.send({ success: true });
});

app.post("/cards/override/:id", async (req, res) => {
  const { id } = req.params;
  console.log({ id });
  if (!id) return res.status(400).send();

  const transaction = await pool
    .query("select * from transactions where id = $1", [id])
    .then((res) => res.rows[0]);

  if (!transaction) return res.status(400).send();
  if (transaction.approved)
    return res.status(400).send({
      success: false,
      message: `Transaction ${id} was already approved.`,
    });

  const until = new Date(new Date().getTime() + 1000 * 60 * 60 * 6);
  await pool.query(
    "update transactions set override_until = $1 where id = $2",
    [until, id],
  );

  res.send({
    success: true,
    until: until.toISOString(),
  });
});

app.get("/cards/categories", async (_, res) => {
  const categories = await getCategories();
  return res.send(categories);
});

// app.get("/cards/categories/:category", async (_, res) => {
//   const {  } = req.params;
//   const categories = await getCategories();
//   return res.send(categories);
// });

app.get("/cards/transactions/aggregated", async (req, res) => {
  const user = users[req.body?.userId ?? 0];
  const cardId = await getCardIdForUser(user.id);

  const categories = await getAggregatedTransactionsForMonth(cardId);
  return res.send(categories);
});

app.get("/cards/transactions/category/:cat", async (req, res) => {
  const { cat } = req.params;
  const user = users[req.body?.userId ?? 0];
  const cardId = await getCardIdForUser(user.id);
  const names = await pool
    .query("select internal, external from categories where internal = $1", [
      cat,
    ])
    .then((res) => res.rows[0]);

  const transactions = await getTransactionsInCategory(cardId, cat).then((r) =>
    r.map((t) => ({ ...t, created: Date.parse(t.created) })),
  );
  res.send({ transactions, intname: names.internal, extname: names.external });
});

app.get("/cards/transactions", async (req, res) => {
  const user = users[req.body?.userId ?? 0];
  const dbUser = await getUser(user.id);

  const transactions = await stripe.issuing.transactions.list({
    cardholder: dbUser.cardholder_id,
  });

  const reduceArr = [];

  for (let item in transactions) {
    if (item === "data") {
      for (let transaction in transactions[item]) {
        const id = transactions[item][transaction].id;
        const category = transactions[item][transaction].merchant_data.category;
        const name = transactions[item][transaction].merchant_data.name;
        const amount = (transactions[item][transaction].amount * -1) / 100;
        const date = transactions[item][transaction].created;
        const city = transactions[item][transaction].merchant_data.city;
        const state = transactions[item][transaction].merchant_data.state;

        reduceArr.push({
          id,
          category,
          name,
          amount,
          date,
          city,
          state,
        });
      }
    }
  }

  res.send({ success: true, data: reduceArr });
});

app.put("/cards/limits", async (req, res) => {
  // create a new limit
  const { category, limit } = req.body;
  const user = users[req.body?.userId ?? 0];
  const cardId = await getCardIdForUser(user.id);

  if (limit < 0) {
    await pool.query("delete from limits where card = $1 and category = $2", [
      cardId,
      category,
    ]);
    return res.send({ success: true, message: "deleted the limit" });
  }

  const result = await createLimit(cardId, category, limit);
  res.send(result);
});

app.get("/cards/transactions/:id", async (req, res) => {
  const transaction_id = req.params.id;

  const reduceArr = [];

  const transaction = await stripe.issuing.transactions.retrieve(
    transaction_id,
  );
  const id = transaction.id;
  const category = transaction.merchant_data.category;
  const name = transaction.merchant_data.name;
  const amount = (transaction.amount * -1) / 100;
  const date = transaction.created;
  const city = transaction.merchant_data.city;
  const state = transaction.merchant_data.state;

  reduceArr.push({
    id,
    category,
    name,
    amount,
    date,
    city,
    state,
  });

  res.send({ success: true, data: reduceArr });
});

app.get("/cards/details", async (req, res) => {
  const user = users[req.body?.userId ?? 0];
  const cardId = await getCardIdForUser(user.id);
  const card = await stripe.issuing.cards.retrieve(cardId, {
    expand: ["number", "cvc"],
  });
  res.send({
    number: card.number,
    cvc: card.cvc,
    billingAddress: card.cardholder.billing.address,
    cardholder: card.cardholder.name,
    expMonth: card.exp_month,
    expYear: card.exp_year,
    active: card.active,
  });
});

app.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  console.log({ body: req.body, sig, sec: process.env.WEBHOOK_SECRET });
  let event;

  // Verify webhook signature and extract the event.
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log({ err, message: err.message });
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "issuing_authorization.request") {
    const auth = event.data.object;
    await handleAuthorizationRequest(auth);
  }

  res.json({ received: true });
});

const handleAuthorizationRequest = async (auth) => {
  // Authorize the transaction.
  try {
    const { card } = auth;
    const { amount } = auth.pending_request;
    const { category, name, city, state } = auth.merchant_data;

    const trx = await getAggregatedTransactionsForMonth(card.id);

    console.log({ auth });

    const catAmount = parseInt(
      trx.find((r) => r.internal === category)?.amount ?? "0",
    );

    const limit = await getLimitForCategory(card.id, category);

    console.log({ limit, catAmount, trx });

    // over limit!
    if (limit < catAmount + amount) {
      // check if we have already tried this transaction and have overrridden it
      const previousTx = await pool
        .query(
          "select * from transactions where merchant_name = $1 and category = $2 and amount = $3 and override_until >= now()",
        )
        .then((r) => r.rowCount);
      if (previousTx > 0)
        return await stripe.issuing.authorizations.approve(auth["id"]);
      await pool.query(
        "insert into transactions (card, category, amount, approved, merchant_name, city, state) values ($1, $2, $3, false, $4, $5, $6)",
        [card.id, category, amount, name, city, state],
      );
      return await stripe.issuing.authorizations.decline(auth["id"]);
    }

    await pool.query(
      "insert into transactions (card, category, amount, merchant_name, city, state) values ($1, $2, $3, $4, $5, $6)",
      [card.id, category, amount, name, city, state],
    );
  } catch (error) {
    console.error(error);
  }
  await stripe.issuing.authorizations.approve(auth["id"]);
};

app.listen(8000, () => console.log("🚀 listening on :8000"));
