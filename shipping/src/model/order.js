const { Database } = require("../database/client");

const uuid = require("uuid").v4;

class Order {
  constructor(id, user_id, listing_id, bid_id, address_id, status) {
    this.id = id;
    this.user_id = user_id;
    this.listing_id = listing_id;
    this.bid_id = bid_id;
    this.address_id = address_id;
    this.status = status;
  }

  static migrate() {
    return Database.execute(
      `CREATE TABLE IF NOT EXISTS orders (
          id UUID NOT NULL UNIQUE,
          user_id UUID,
          listing_id UUID,
          bid_id UUID,
          address_id UUID,
          status VARCHAR(25)
        )`
    );
  }

  static async find_by_id(order_id) {
    const rows = await Database.execute(
      "SELECT * FROM orders where id = $1 LIMIT 1",
      [order_id]
    );

    if (rows.rows.length == 0) {
      return null;
    }
    const row = rows.rows[0];
    return new Order(
      row.id,
      row.user_id,
      row.listing_id,
      row.bid_id,
      row.address_id,
      row.status
    );
  }

  static async find_all_by_user_id(user_id, status_filter) {
    const rows = (
      await Database.execute(
        `SELECT * FROM orders WHERE user_id = $1 AND status LIKE '%${status_filter}%'`,
        [user_id]
      )
    ).rows;
    if (rows.length == 0) {
      return [];
    }

    return rows.map((row) => {
      return new Order(
        row.id,
        row.user_id,
        row.listing_id,
        row.bid_id,
        row.address_id,
        row.status
      );
    });
  }

  static async create({ user_id, listing_id, bid_id, address_id, status }) {
    const order_id = uuid();
    const row = (
      await Database.execute(
        `INSERT INTO orders (id, user_id, listing_id, bid_id, address_id, status)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [order_id, user_id, listing_id, bid_id, address_id, status]
      )
    ).rows[0];
    return new Order(
      row.id,
      row.user_id,
      row.listing_id,
      row.bid_id,
      row.address_id,
      row.status
    );
  }

  async update({ status, address_id }) {
    const newRow = (
      await Database.execute(
        `UPDATE orders SET
            status=$1,
            address_id=$2
            WHERE id=$3 RETURNING *`,
        [status, address_id, this.id]
      )
    ).rows[0];
    this.status = newRow.status || this.status;
    this.address_id = newRow.address_id || this.address_id;
  }

  delete() {}
}

exports.Order = Order;
