const { Listing } = require("../model/listing");

class ListingController {
  static async index(req, res) {
    const name_filters = req.params.search;
    listings = await Listing.find_all_by_name(name_filters);
    res.json({ listings: listings });
  }
  static async show(req, res) {
    const listing_id = req.params.listing_id;
    listing = await Listing.find_by_id(listing_id);
    if (!listing) {
      res.statusMessage = `listing with id: ${listing_id} does not exist`;
      return res.status(404).end();
    }
    res.json(listing);
  }

  static async create(req, res) {
    const {
      user,
      body: { name, description, type, start_date, end_date },
    } = req.body;
    const missing_values = [];
    if (!name) {
      missing_values.push("name");
    }
    if (!description) {
      missing_values.push("description");
    }
    if (!type) {
      missing_values.push("type");
    }
    if (!start_date) {
      missing_values.push("start_date");
    }
    if (!end_date) {
      missing_values.push("end_date");
    }
    if (missing_values.length > 0) {
      missing_args_string = missing_values.reduce((acc, curr) => {
        return `${acc}, ${curr}`;
      }, "");
      res.statusMessage = `failed to provide the following arguments [${missing_args_string}]`;
      return res.status(400).end();
    }
    var listing;
    try {
      listing = await Listing.create({
        name,
        description,
        type,
        start_date,
        end_date,
      });
    } catch (e) {
      if (e.message.includes("duplicate")) {
        // 1 in a trillion chance that there is UUID collision
        res.statusMessage = `Listing already exists with UUID, please retry request`;
      }
      return res.status(500).end();
    }
    res.json(listing);
  }

  static async update(req, res) {
    const listing_id = req.body.listing_id;
    if (!listing_id) {
      res.statusMessage = "must specify an id";
      return res.status(400).end();
    }
    listing = await Listing.find_by_id(listing_id);
    await listing.update(req.id);
    res.json(listing);
  }

  static async delete() {}
}

exports.ListingController = ListingController;
