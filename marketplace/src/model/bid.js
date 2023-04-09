const { Database } = require("../database/client");

const uuid = require("uuid").v4;

class Bid {
  constructor(id, listing_id, bidder_id, amount) {
    this.id = id;
    this.listing_id = listing_id;
    this.bidder_id = bidder_id;
    this.amount = amount;
  }

  static migrate() {
    return Database.execute(
      `CREATE TABLE IF NOT EXISTS bids (
        id UUID NOT NULL UNIQUE,
        listing_id UUID,
        bidder_id UUID,
        amount INTEGER
        )`
    );
  }

  static async find_by_id(bid_id) {
    const rows = (
      await Database.execute("Select * FROM bids WHERE id = $1 LIMIT 1", [
        bid_id,
      ])
    ).rows;

    if (rows.length == 0) {
      return null;
    }
    const row = rows[0];
    return new Bid(row.id, row.listing_id, row.bidder_id, row.amount);
  }

  static async find_highest_for_listing(listing_id) {
    const rows = (
      await Database.execute(
        "SELECT * FROM bids WHERE listing_id = $1 ORDER BY amount DESC LIMIT 1",
        [listing_id]
      )
    ).rows;
    if (rows.length == 0) {
      return null;
    }
    const row = rows[0];

    return new Bid(row.id, row.listing_id, row.bidder_id, row.amount);
  }

  static async create({ listing_id, bidder_id, amount }) {
    const bid_id = uuid();
    const row = (
      await Database.execute(
        `INSERT INTO bids (id, listing_id, bidder_id, amount)
            VALUES ($1, $2, $3, $4) RETURNING *`,
        [bid_id, listing_id, bidder_id, amount]
      )
    ).rows[0];
    return new Bid(row.id, row.listing_id, row.bidder_id, row.amount);
  }

  delete() {}
}

exports.Bid = Bid;
