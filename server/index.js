const express = require("express");
const dotenv = require("dotenv");

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

app.listen(8000, () => console.log("🚀 listening on :8000"));
