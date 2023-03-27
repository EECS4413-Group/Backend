const express = require("express");
const { Database } = require("./database/client");
const { Migrator } = require("./database/migrator");
const { ShippingController } = require("./controller/shipping_controller");

Database.init();
Migrator.migrateAll();

const app = express();
app.use(express.json());

app.get("/orders/:user_id", (req, res) => {
  ShippingController.show(req, res);
});

app.post("/order", (req, res) => {
  ShippingController.create(req, res);
});

app.post("/order/:order_id", (req, res) => {
  ShippingController.update(req, res);
});

app.get("/address/:user_id", (req, res) => {
  ShippingController.get_default_address(req, res);
});

app.post("/address", (req, res) => {
  ShippingController.create_default_address(req, res);
});

app.use("*", (req, res) => {
  res.status(404).end();
});

app.listen("8084", () => {
  console.log("listening on port 8084");
});
