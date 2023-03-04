const { Listing } = require("./../model/listing");

class Migrator {
  static async migrateAll() {
    Listing.migrate();
  }
}

exports.Migrator = Migrator;
