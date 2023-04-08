const { Database } = require("../database/client");

const uuid = require("uuid").v4;

class Listing {
  constructor(
    id,
    owner_id,
    name,
    description,
    type,
    price,
    start_date,
    end_date
  ) {
    this.id = id;
    this.owner_id = owner_id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.price = price;
    this.start_date = start_date;
    this.end_date = end_date;
  }

  static migrate() {
    return Database.execute(
      `CREATE TABLE IF NOT EXISTS listings (
            id UUID NOT NULL UNIQUE,
            owner_id UUID NOT NULL,
            name VARCHAR(128) NOT NULL,
            description VARCHAR(256),
            type VARCHAR(32),
            price INTEGER,
            start_date TIMESTAMP,
            end_date TIMESTAMP,
            image BYTEA
        )`
    );
  }

  static async find_by_id(id) {
    const rows = (
      await Database.execute("SELECT * FROM listings WHERE id = $1 LIMIT 1", [
        id,
      ])
    ).rows;
    if (rows.length == 0) {
      return null;
    }
    const row = rows[0];
    return new Listing(
      row.id,
      row.owner_id,
      row.name,
      row.description,
      row.type,
      row.price,
      row.start_date,
      row.end_date
    );
  }

  static async find_all_ending_soon() {
    const result = await Database.execute(
      `Select * From listings WHERE type LIKE 'normal' AND end_date BETWEEN LOCALTIMESTAMP AND LOCALTIMESTAMP + INTERVAL '3 seconds'`
    );

    return result.rows.map((row) => {
      return new Listing(
        row.id,
        row.owner_id,
        row.name,
        row.description,
        row.type,
        row.price,
        row.start_date,
        row.end_date
      );
    });
  }

  static async find_all_by_name(query) {
    const rows = (
      await Database.execute(`SELECT * FROM listings WHERE name LIKE $1`, [
        `%${query}%`,
      ])
    ).rows;
    if (rows.length == 0) {
      return [];
    }
    return rows.map((row) => {
      return new Listing(
        row.id,
        row.owner_id,
        row.name,
        row.description,
        row.type,
        row.price,
        row.start_date,
        row.end_date
      );
    });
  }
  static async create({
    owner_id,
    name,
    description,
    type,
    price,
    start_date,
    end_date,
  }) {
    const listing_id = uuid();
    const row = (
      await Database.execute(
        `INSERT INTO listings (id, owner_id, name, description, type, price, start_date, end_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          listing_id,
          owner_id,
          name,
          description,
          type,
          type == "dutch" ? price : 0,
          start_date,
          end_date,
        ]
      )
    ).rows[0];
    return new Listing(
      row.id,
      row.owner_id,
      row.name,
      row.description,
      row.type,
      row.price,
      row.start_date,
      row.end_date
    );
  }

  async update({
    name,
    description,
    type,
    price,
    start_date,
    end_date,
    image,
  }) {
    const newRow = (
      await Database.execute(
        `UPDATE Listings SET
            name = $1,
            description = $2,
            type = $3,
            price = $4,
            start_date = $5,
            end_date = $6,
            image = $7
            WHERE id=$8 RETURNING *`,
        [
          name ? name : this.name,
          description ? description : this.description,
          type ? type : this.type,
          price ? price : this.price,
          start_date ? start_date : this.start_date,
          end_date ? end_date : this.end_date,
          image ? image : this.image,
          this.id,
        ]
      )
    ).rows[0];
    this.name = newRow.name;
    this.description = newRow.description;
    this.type = newRow.type;
    this.price = newRow.price;
    this.start_date = newRow.start_date;
    this.end_date = newRow.end_date;
    this.image = newRow.image;
  }

  delete() {}
}

exports.Listing = Listing;
