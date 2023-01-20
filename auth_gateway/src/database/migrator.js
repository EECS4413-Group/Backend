const { User } = require("./../model/user");
const { Token } = require("./../model/token");

class Migrator {
    static async migrateAll() {
        User.migrate();
        Token.migrate();

    }
}

exports.Migrator = Migrator;
