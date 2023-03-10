const { Order } = require("../model/order");
const { Address } = require("./../model/address");

class Migrator {
  static async migrateAll() {
    var initialized = false;
    while (!initialized) {
      try {
        await Account.migrate();
        await Transaction.migrate();
        initialized = true;
        console.log("Migrated successfully");
      } catch (e) {
        console.log("failed to migrate models, retrying in 2 seconds");
        await new Promise((r) => setTimeout(r, 2000));
        console.log("retrying in 2 seconds");
      }
    }
  }
}

exports.Migrator = Migrator;
