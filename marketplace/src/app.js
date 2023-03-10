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

app.listen("8083", () => {
  console.log("listening on port 8083");
});
