const { Database } = require("../database/client");

const uuid = require("uuid").v4;

class Listing {
  constructor(id, owner_id, name, description, type, start_date, end_date) {
    this.id = id;
    this.owner_id = owner_id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.start_date = start_date;
    this.end_date = end_date;
  }

  static async migrate() {
    Database.execute(
      `CREATE TABLE IF NOT EXISTS listings (
            id UUID NOT NULL UNIQUE,
            owner_id UUID NOT NULL,
            name VARCHAR(128) NOT NULL PRIMARY KEY,
            description VARCHAR(256),
            type VARCHAR(32),
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
      row.start_date,
      row.end_date
    );
  }

  static async find_all_by_name(query) {
    const rows = (
      await Database.execute("SELECT * FROM users WHERE name LIKE %$1%", [
        query,
      ])
    ).rows;
    if (rows.length == 0) {
      return null;
    }
    return rows.map((row) => {
      return new Listing(
        row.id,
        row.owner_id,
        row.name,
        row.description,
        row.type,
        row.start_date,
        row.end_date
      );
    });
  }
  static async create({ name, description, type, start_date, end_date }) {
    const listing_id = uuid();
    const row = (
      await Database.execute(
        `INSERT INTO listings (id, name, description, type, start_date, end_date)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [listing_id, name, description, type, start_date, end_date]
      )
    ).rows[0];
    return new Listing(
      row.id,
      row.owner_id,
      row.name,
      row.description,
      row.type,
      row.start_date,
      row.end_date
    );
  }

  async update({ name, description, type, start_date, end_date, image }) {
    const newRow = (
      await Database.execute(
        `UPDATE Listings SET
            name = $1,
            description = $2,
            type = $3,
            start_date = $4,
            end_date = $5,
            image = $6,
            WHERE id=$7 RETURNING *`,
        [
          name ? name : this.name,
          description ? description : this.description,
          type ? type : this.type,
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
    this.start_date = newRow.start_date;
    this.end_date = newRow.end_date;
    this.image = newRow.image;
  }

  delete() {}
}

exports.Listing = Listing;
