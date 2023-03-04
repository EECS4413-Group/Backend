const { Wallet } = require("./../model/wallet");

class Migrator {
  static async migrateAll() {
    Wallet.migrate();
  }
}

exports.Migrator = Migrator;
