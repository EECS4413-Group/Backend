const express = require("express");
const { Database } = require("./database/client");
const { Migrator } = require("./database/migrator");
const { WalletController } = require("./controller/wallet_controller");

Database.init();
Migrator.migrateAll();

const app = express();
app.use(express.json());

app.get("/account/:account_id", (req, res) => {
  WalletController.show(req, res);
});

app.post("/account", (req, res) => {
  WalletController.create(req, res);
});

app.get("/transaction", (req, res) => {
  WalletController.check_transaction(req, res);
});

app.post("/transaction", (req, res) => {
  WalletController.do_transaction(req, res);
});

app.get("/redeem/:account_id", (req, res) => {
  WalletController.redeem_tokens(req, res);
});

app.use("*", (req, res) => {
  res.status(404).end();
});

app.listen("8082", () => {
  console.log("listening on port 8082");
});
