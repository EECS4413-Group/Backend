const { Database } = require('../database/client');
const { User } = require('../model/user');

const crypto = require('crypto');
const bcrypt = require('bcrypt');

class Token {
    constructor(token, user) {
        this.token = token
        this.user = user
    }

    static async migrate() {
        await Database.execute(
            `CREATE TABLE IF NOT EXISTS tokens (
                token VARCHAR(256) NOT NULL UNIQUE PRIMARY KEY,
                user_id UUID
            )`
        );
        // create index on user_id
        //await Database.execute();
    }

    static async find_by_token(token) {
        const hashedToken = await new Promise((resolve, reject) => {
            bcrypt.hash(token, 0, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
        console.log(hashedToken);
        const row = (await Database.execute("SELECT * FROM tokens WHERE token = $1 LIMIT 1", [hashedToken])).rows[0];
        if (!row) {
            return null;
        }
        const user = await User.find_by_id(row.user_id);
        return new Token(row.token, user);
    }

    static async delete_all_by_user_id(id) {
        await Database.execute("DELETE FROM tokens WHERE user_id = $1", [id])
    }

    static async create(user) {
        const newToken = await new Promise((resolve, reject) => {
            crypto.randomBytes(128, (err, buffer) => {
                if (err) {
                    reject(err);
                }
                resolve(buffer.toString('hex'));
            });
        });
        const hashedToken = await new Promise((resolve, reject) => {
            bcrypt.hash(newToken, 0, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        })
        const row = (await Database.execute(
            `INSERT INTO Tokens (token, user_id)
            VALUES ($1, $2) RETURNING *`,
            [hashedToken, user.id]
        )).rows[0];
        return new Token(newToken, user);
    }


    update() {

    }

    async delete() {
        await Database.execute("DELETE FROM tokens WHERE token = $1", [this.token])
    }
}

exports.Token = Token;
