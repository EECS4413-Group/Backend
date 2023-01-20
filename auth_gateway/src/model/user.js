const { Database } = require('../database/client');
const { InvalidPasswordError } = require('../errors/validation_errors');

const bcrypt  = require('bcrypt');
const uuid = require('uuid').v4;

class User {
    #salt;
    #password;

    constructor(id, login, password, salt, firstName, lastName) {
        this.id = id;
        this.login = login;
        this.#salt = salt;
        this.#password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    static async migrate() {
        Database.execute(
            `CREATE TABLE IF NOT EXISTS users (
                id UUID NOT NULL UNIQUE,
                login VARCHAR(64) NOT NULL UNIQUE PRIMARY KEY,
                pw_hash VARCHAR(512),
                pw_salt VARCHAR(512),
                first_name VARCHAR(32),
                last_name VARCHAR(32)
            )`);
    }

    static async find_by_id(id) {
        const rows = (await Database.execute("SELECT * FROM users WHERE id = $1 LIMIT 1", [id])).rows;
        if (rows.length == 0) {
            return null;
        }
        const row = rows[0];
        return new User(row.id, row.login, row.salt, row.pw_hash, row.firstName, row.lastName);
    }

    static async find_by_login(login) {
        const rows = (await Database.execute("SELECT * FROM users WHERE login = $1 LIMIT 1", [login])).rows;
        if (rows.length == 0) {
            return null;
        }
        const row = rows[0];
        return new User(row.id, row.login, row.salt, row.pw_hash, row.firstName, row.lastName);
    }
    static async create({ login, password, firstName, lastName }) {
        const salt = await new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    reject(err);
                }
                resolve(salt);
            });
        });
        const hash = await new Promise((resolve, reject) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
        const user_id = uuid();
        const row = (await Database.execute(
            `INSERT INTO Users (id, login, pw_hash, pw_salt, first_name, last_name)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [user_id, login, hash, salt, firstName, lastName]
        )).rows[0];
        return new User(row.id, row.login, row.salt, row.pw_hash, row.first_name, row.last_name);
    }

    async authenticate(password) {
        const hash = await new Promise((resolve, reject) => {
            bcrypt.hash(password, this.#salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
        return hash != this.pw_hash
    }


    async update_password(old_password, new_password) {
        if (!old_password) {
            throw InvalidPasswordError('old password not provided');
        }
        const old_password_hash = await new Promise((resolve, reject) => {
            bcrypt.hash(old_password, this.#salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        })
        if (old_password_hash != this.#password) {
            throw InvalidPasswordError('Incorrect old password');
        }
        if (!new_password) {
            throw InvalidPasswordError('new password not provided');
        }

        new_password_hash = await new Promise((resolve, reject) => {
            bcrypt.hash(new_password, this.#salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
        const newRow = (await Database.execute(
            `UPDATE Users
            SET pw_hash = $1
            WHERE id=$2 RETURNING *`,
            [
                new_password_hash,
                this.id
            ]
        )).rows[0];
        // push to database, update current object with new params
        this.#password = newRow.password
    }

    async update_name(firstName, lastName) {
        const newRow = (await Database.execute(
            `UPDATE Users
            SET first_name = $1, last_name = $2
            WHERE id=$3 RETURNING *`,
            [
                firstName ? firstName : this.firstName,
                lastName ? lastName : this.lastName,
                this.id
            ]
        )).rows[0];
        this.firstName = newRow.first_name
        this.lastName = newRow.last_name
    }

    delete() {

    }
}

exports.User = User;


