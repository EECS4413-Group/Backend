const { Database } = require("../database/client");

const uuid = require("uuid").v4;

class Account {
  constructor(id, owner_id, balance, last_redeem_time) {
    this.id = id;
    this.owner_id = owner_id;
    this.balance = balance;
    this.last_redeem_time = last_redeem_time;
  }

  static migrate() {
    return Database.execute(
      `CREATE TABLE IF NOT EXISTS accounts (
            id UUID NOT NULL UNIQUE,
            owner_id UUID NOT NULL,
            balance INTEGER,
            last_redeem_time TIMESTAMP
        )`
    );
  }

  static async find_by_owner_id(owner_id) {
    const rows = (
      await Database.execute(
        "SELECT * FROM accounts WHERE owner_id = $1 LIMIT 1",
        [owner_id]
      )
    ).rows;
    if (rows.length == 0) {
      return null;
    }
    const row = rows[0];

    return new Account(row.id, row.owner_id, row.balance, row.last_redeem_time);
  }

  static async create(user_id) {
    const wallet_id = uuid();
    const row = (
      await Database.execute(
        `INSERT INTO accounts (id, owner_id, balance, last_redeem_time)
            VALUES ($1, $2, $3, to_timestamp('${new Date(
              0
            ).toISOString()}', 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"')) RETURNING *`,
        [wallet_id, user_id, 0]
      )
    ).rows[0];
    return new Account(
      row.id,
      row.listing_id,
      row.balance,
      new Date(row.last_redeem_time)
    );
  }

  async update({ balance, last_redeem_time }) {
    const newRow = (
      await Database.execute(
        `UPDATE accounts SET
            balance=$1,
            last_redeem_time=to_timestamp('${last_redeem_time.toISOString()}', 'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"')
            WHERE id=$2 RETURNING *`,
        [balance, this.id]
      )
    ).rows[0];
    this.balance = newRow.balance;
    this.last_redeem_time = new Date(newRow.last_redeem_time);
  }

  delete() {}
}

exports.Account = Account;
