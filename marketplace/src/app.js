const express = require("express");
const { Database } = require("./database/client");
const { Migrator } = require("./database/migrator");
const { BidController } = require("./controller/bid_controller");

Database.init();
Migrator.migrateAll();

const app = express();
app.use(express.json());

app.get("/bid/:listing_id", (req, res) => {
  BidController.show(req, res);
});

app.post("/bid", (req, res) => {
  BidController.create(req, res);
});

app.use("*", (req, res) => {
  res.status(404).end();
});

app.listen("8081", () => {
  console.log("listening on port 8081");
});
