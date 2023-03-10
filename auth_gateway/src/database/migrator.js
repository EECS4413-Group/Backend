const { User } = require("./../model/user");
const { Token } = require("./../model/token");

class Migrator {
  static async migrateAll() {
    var initialized = false;
    while (!initialized) {
      try {
        await User.migrate();
        await Token.migrate();
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
