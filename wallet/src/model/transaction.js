const { Database } = require("../database/client");

const uuid = require("uuid").v4;

class Transaction {
  constructor(id, reciever_id, sender_id, type, amount, transaction_time) {
    this.id = id;
    this.reciever_id = reciever_id;
    this.sender_id = sender_id;
    this.type = type;
    this.amount = amount;
    this.transaction_time = transaction_time;
  }

  static migrate() {
    return Database.execute(
      `CREATE TABLE IF NOT EXISTS transactions (
            id UUID NOT NULL UNIQUE,
            reciever_id UUID NOT NULL,
            sender_id UUID,
            type VARCHAR(32),
            amount INTEGER,
            transaction_time TIMESTAMP
        )`
    );
  }

  static async find_all_by_reciever_id(reciever_id) {
    const rows = (
      await Database.execute(
        "SELECT * FROM transactions WHERE reciever_id = $1",
        [reciever_id]
      )
    ).rows;
    if (rows.length == 0) {
      return null;
    }
    return rows.map((row) => {
      return new Transaction(
        row.id,
        row.reciever_id,
        row.sender_id,
        row.type,
        row.amount,
        row.transaction_time
      );
    });
  }

  static async create({ reciever_id, sender_id, type, amount }) {
    const transaction_id = uuid();
    const row = (
      await Database.execute(
        `INSERT INTO transactions (id, reciever_id, sender_id, type, amount, transaction_time)
            VALUES ($1, $2, $3, $4, $5, to_timestamp(${Date(
              0
            )} / 1000.0)) RETURNING *`,
        [transaction_id, reciever_id, sender_id, type, amount]
      )
    ).rows[0];
    return new Transaction(
      row.id,
      row.sender_id,
      row.reciever_id,
      row.type,
      row.amount,
      Date(row.last_redeem_time * 1000)
    );
  }

  delete() {}
}

exports.Transaction = Transaction;
