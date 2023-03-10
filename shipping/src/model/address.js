const { Database } = require("../database/client");

const uuid = require("uuid").v4;

class Address {
  // assumes all addresses are in canada
  constructor(
    id,
    user_id,
    street_number,
    street_name,
    apt_number,
    postal_code,
    province,
    is_default
  ) {
    this.id = id;
    this.user_id = user_id;
    this.street_name = street_name;
    this.street_number = street_number;
    this.apt_number = apt_number;
    this.postal_code = postal_code;
    this.province = province;
    this.is_default = is_default;
  }

  static migrate() {
    return Database.execute(
      `CREATE TABLE IF NOT EXISTS addresses (
            id UUID NOT NULL UNIQUE,
            user_id UUID NOT NULL,
            street_name VARCHAR(256),
            street_number INTEGER,
            apt_number VARCHAR(10),
            province VARCHAR(24),
            postal_code VARCHAR(8),
            is_default BOOLEAN
        )`
    );
  }

  static async find_all_by_user_id(user_id) {
    const rows = (
      await Database.execute("SELECT * FROM addresses WHERE user_id = $1", [
        user_id,
      ])
    ).rows;
    if (rows.length == 0) {
      return null;
    }
    return rows.map((row) => {
      return new Address(
        row.id,
        row.user_id,
        row.street_name,
        row.street_number,
        row.apt_number,
        row.province,
        row.postal_code,
        row.is_default
      );
    });
  }

  static async find_default(user_id) {
    const rows = (
      await Database.execute(
        "SELECT * FROM addresses WHERE user_id = $1 AND is_default = TRUE",
        [user_id]
      )
    ).rows;
    if (rows.length == 0) {
      return null;
    }
    const row = rows[0];
    return new Address(
      row.id,
      row.user_id,
      row.street_name,
      row.street_number,
      row.apt_number,
      row.province,
      row.postal_code,
      row.is_default
    );
  }

  static async create({
    user_id,
    street_number,
    street_name,
    apt_number,
    postal_code,
    province,
    is_default,
  }) {
    const address_id = uuid();
    const row = (
      await Database.execute(
        `INSERT INTO addresses (id, user_id, street_number, street_name, apt_number, postal_code, province, is_default)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          address_id,
          user_id,
          street_number,
          street_name,
          apt_number,
          postal_code,
          province,
          is_default,
        ]
      )
    ).rows[0];
    return new Address(
      row.address_id,
      row.user_id,
      row.street_number,
      row.street_name,
      row.apt_number,
      row.postal_code,
      row.province,
      row.is_default
    );
  }

  async update({
    street_number,
    street_name,
    apt_number,
    postal_code,
    province,
  }) {
    const newRow = (
      await Database.execute(
        `UPDATE orders SET
            street_number = $1,
            street_name = $2,
            apt_number = $3,
            postal_code = $4,
            province = $5,
            WHERE id=$6 AND is_default = TRUE RETURNING *`,
        [street_number, street_name, apt_number, postal_code, province, this.id]
      )
    ).rows[0];
    this.street_number = newRow.street_number || this.street_number;
    this.street_name = newRow.street_name || this.street_name;
    this.apt_number = newRow.apt_number || this.apt_number;
    this.postal_code = newRow.postal_code || this.postal_code;
    this.province = newRow.province || this.province;
  }

  delete() {}
}

exports.Address = Address;
