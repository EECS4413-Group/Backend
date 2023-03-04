const { Database } = require("../database/client");

const uuid = require("uuid").v4;

class Wallet {
  constructor(id, owner_id, balance, last_redeem_time) {
    this.id = id;
    this.owner_id = owner_id;
    this.balance = balance;
    this.last_redeem_time = last_redeem_time;
  }

  static async migrate() {
    Database.execute(
      `CREATE TABLE IF NOT EXISTS wallets (
            id UUID NOT NULL UNIQUE,
            owner_id UUID NOT NULL,
            balance INTEGER,
            last_redeem_time DATETIME
        )`
    );
  }

  static async find_by_owner_id(owner_id) {
    const rows = (
      await Database.execute(
        "SELECT * FROM wallets WHERE owner_id = $1 LIMIT 1",
        [owner_id]
      )
    ).rows;
    if (rows.length == 0) {
      return null;
    }
    const row = rows[0];
    return new Wallet(row.id, row.owner_id, row.balance, row.last_redeem_time);
  }

  static async create(user_id) {
    const wallet_id = uuid();
    const row = (
      await Database.execute(
        `INSERT INTO wallets (id, owner_id, balance, last_redeem_time)
            VALUES ($1, $2, $3, to_timestamp(${Date(0)} / 1000.0)) RETURNING *`,
        [wallet_id, user_id, 0]
      )
    ).rows[0];
    return new Wallet(
      row.id,
      row.listing_id,
      row.balance,
      Date(row.last_redeem_time * 1000)
    );
  }

  async update({ balance, last_redeem_time }) {
    const newRow = (
      await Database.execute(
        `UPDATE wallets SET
            balance=$1,
            last_redeem_time=to_timestamp(${redeem_time} / 1000.0),
            WHERE id=$3 RETURNING *`,
        [balance, last_redeem_time, this.id]
      )
    ).rows[0];
    this.balance = newRow.balance;
    this.last_redeem_time = Date(newRow.last_redeem_time * 1000);
  }

  delete() {}
}

exports.Wallet = Wallet;
