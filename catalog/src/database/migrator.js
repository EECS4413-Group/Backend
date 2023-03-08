const { Listing } = require("./../model/listing");

class Migrator {
  static async migrateAll() {
    var initialized = false;
    while (!initialized) {
      try {
        await Listing.migrate();
        initialized = true;
        console.log("Migrated successfully");
      } catch (e) {
        console.log(e);
        await new Promise((r) => setTimeout(r, 2000));
        console.log("retrying in 2 seconds");
      }
    }
  }
}

exports.Migrator = Migrator;
