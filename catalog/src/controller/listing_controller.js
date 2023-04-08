const { Listing } = require("../model/listing");

class ListingController {
  static async index(req, res) {
    let name_filters = req.query.search;
    if (!name_filters) {
      name_filters = "";
    }
    const listings = await Listing.find_all_by_name(name_filters);
    res.json({ listings: listings });
  }

  static async indexEndingSoon(req, res) {
    const listings = await Listing.find_all_ending_soon();
    res.json({ listings: listings });
  }

  static async show(req, res) {
    const listing_id = req.params.listing_id;
    const listing = await Listing.find_by_id(listing_id);
    if (!listing) {
      res.statusMessage = `listing with id: ${listing_id} does not exist`;
      return res.status(404).end();
    }
    // TODO: get top bid from auction if normal auction
    res.json(listing);
  }

  static async create(req, res) {
    const {
      user,
      body: { name, description, price, type, start_date, end_date },
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
      // TODO: start date should be 10 minutes prior to time.now() or after
      missing_values.push("start_date");
    }
    if (!end_date) {
      missing_values.push("end_date");
    }
    if (missing_values.length > 0) {
      let missing_args_string = missing_values.reduce((acc, curr) => {
        return `${acc}, ${curr}`;
      }, "");
      res.statusMessage = `failed to provide the following arguments [${missing_args_string}]`;
      return res.status(400).end();
    }

    if (!["normal", "dutch"].includes(type)) {
      res.statusMessage = `parameter 'type' must be either 'normal' or 'dutch'`;
      return res.status(400).end();
    }
    var listing;
    try {
      listing = await Listing.create({
        owner_id: user.id,
        name,
        description,
        price,
        type,
        start_date,
        end_date,
      });
    } catch (e) {
      if (e.message.includes("duplicate")) {
        // 1 in a trillion chance that there is UUID collision
        res.statusMessage = `Listing already exists with UUID, please retry request`;
      }
      console.log(e);
      return res.status(500).end();
    }
    res.status(201).json(listing);
  }

  static async update(req, res) {
    const {
      user,
      body: { name, description, price, type, start_date, end_date, image },
    } = req.body;

    const { listing_id } = req.params;
    if (!listing_id) {
      res.statusMessage = "must specify an id";
      return res.status(400).end();
    }
    if (type && !["normal", "dutch"].includes(type)) {
      res.statusMessage = `parameter 'type' must be either 'normal' or 'dutch'`;
      return res.status(400).end();
    }
    const listing = await Listing.find_by_id(listing_id);
    if (listing.owner_id != user.id) {
      res.statusMessage = "you must be the owner to update the listing";
      return res.status(403).end();
    }
    await listing.update({
      name,
      description,
      price,
      type,
      start_date,
      end_date,
      image,
    });
    res.json(listing);
  }

  static async delete() {}
}

exports.ListingController = ListingController;
