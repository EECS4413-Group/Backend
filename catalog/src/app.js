const express = require("express");
const jwt = require("jsonwebtoken");
const { Database } = require("./database/client");
const { Migrator } = require("./database/migrator");
const { ListingController } = require("./controller/listing_controller");

Database.init();
Migrator.migrateAll();

const app = express();
app.use(express.json());

app.get("/listing", (req, res) => {
  ListingController.index(req, res);
});

app.get("/listing/:listing_id", (req, res) => {
  ListingController.show(req, res);
});

app.post("/listing", (req, res) => {
  ListingController.create(req, res);
});

app.post("/listing/:listing_id", (req, res) => {
  ListingController.update(req, res);
});

app.use("*", (req, res) => {
  res.status(404).end();
});

app.listen("8083", () => {
  console.log("listening on port 8083");
});
