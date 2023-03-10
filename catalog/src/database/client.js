const { Pool } = require("pg");

class Database {
  static #client = null;

  static async init() {
    var initialized = false;
    while (!initialized) {
      try {
        this.#client = await new Pool();
        this.#client.on("error", (err) => {
          console.log("db error");
        });
        console.log("connected successfully!");
        initialized = true;
      } catch (e) {
        console.log(
          "failed to initialize db connection, retrying in 2 seconds"
        );
        await new Promise((r) => setTimeout(r, 2000));
        console.log("retrying");
      }
    }
  }

  static execute(query_string, query_args) {
    return new Promise((resolve, reject) => {
      this.#client.query(query_string, query_args, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
}

exports.Database = Database;
