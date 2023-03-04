const { Pool } = require('pg');

class Database {
    static #client = null;

    static init() {
        this.#client = new Pool();
    }

    static execute(query_string, query_args) {
        return new Promise((resolve, reject) => {
            this.#client.query(query_string, query_args, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        })
    }
}

exports.Database = Database;
