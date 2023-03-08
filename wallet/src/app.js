const express = require("express");
const jwt = require("jsonwebtoken");
const { Database } = require("./database/client");
const { Migrator } = require("./database/migrator");
const { WalletController } = require("./controller/wallet_controller");

Database.init();
Migrator.migrateAll();

const app = express();
app.use(express.json());

app.get("/wallet/:wallet_id", (req, res) => {
  WalletController.show(req, res);
});

app.post("wallet", (req, res) => {
  WalletController.create(req, res);
});

app.get("/transactions", (req, res) => {
  WalletController.check_transaction(req, res);
});

app.post("/transactions", (req, res) => {
  WalletController.do_transaction(req, res);
});

app.post("/redeem", (req, res) => {
  WalletController.redeem_tokens(req, res);
});

app.use("*", (req, res) => {
  res.status(404).end();
});

app.listen("8082", () => {
  console.log("listening on port 8082");
});
