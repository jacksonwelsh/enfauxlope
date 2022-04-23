const express = require("express");
const dotenv = require("dotenv");
const db = require("./db");
const { getUser, pool } = db;

dotenv.config();

const app = express();

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
    const dbUser = getUser(user.id);
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

app.listen(8000, () => console.log("🚀 listening on :8000"));
