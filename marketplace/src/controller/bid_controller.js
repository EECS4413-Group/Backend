const { Bid } = require("../model/bid");
const fetch = require("node-fetch");

const get_user_wallet = async (user_id) => {
  var response;
  try {
    response = await fetch(`http://wallet:8082/wallet/${user_id}`, {
      method: "GET",
    });
  } catch (e) {}
  return response.json();
};

const get_listing = async (listing_id) => {
  var response;
  try {
    response = await fetch(`http://catalog:8083/listing/${listing_id}`, {
      method: "GET",
    });
  } catch (e) {}
};

class BidController {
  static async show(req, res) {
    const listing_id = req.params.listing_id;
    if (!listing_id) {
      return res.status(500).end();
    }
    const bid = await Bid.find_highest_for_listing(listing_id);
    if (!bid) {
      res.statusMessage = `no bids for listing with id ${listing_id}`;
      return res.status(404).end();
    }
    res.json(bid);
  }

  static async create(req, res) {
    const {
      user,
      body: { bid },
    } = req.body;

    const user_wallet = await get_user_wallet(user.id);
    if (user_wallet.balance < bid.amount) {
      res.statusMessage = `user does not have enough tokens to place bid`;
      return res.status(403).end();
    }

    const current_listing = await get_listing(bid.listing_id);
    if (current_listing.type == "normal") {
      if (Date.now() > new Date(current_listing.end_time).getTime()) {
        res.statusMessage = `Auction over. Your bid cannot be placed`;
        res.status(403).end();
      }
      const current_top_bid = await Bid.find_highest_for_listing(
        bid.listing_id
      );
      if (current_top_bid && current_top_bid > bid.amount) {
        res.statusMessage = `current bid is ${current_top_bid.amount}. Please bid a higher amount`;
        return res.status(403).end();
      }

      var new_bid;
      try {
        new_bid = await Bid.create({ ...bid });
      } catch (e) {
        if (e.message.includes("duplicate")) {
          // 1 in a trillion chance that there is UUID collision
          res.statusMessage = `Bid already exists with UUID, please retry request`;
        }
        console.log(e);
        return res.status(500).end();
      }
    } else if (current_listing.type == "dutch") {
      const current_top_bid = await Bid.find_highest_for_listing(
        bid.listing_id
      );
      if (current_top_bid != null) {
        res.statusMessage = `Item has been purchased already`;
        return res.status(403).end();
      }

      // TODO: check if price provided by user equal to calculated price based on time increment rules
      // if yes, bid can be created.
      // else if bid is higher than time increment rule, create bid
      // otherwise return 403
      var new_bid;
      try {
        new_bid = await Bid.create({ ...bid });
      } catch (e) {
        if (e.message.includes("duplicate")) {
          // 1 in a trillion chance that there is UUID collision
          res.statusMessage = `Bid already exists with UUID, please retry request`;
        }
        console.log(e);
        return res.status(500).end();
      }
    }
    res.json(new_bid);
  }

  static async delete() {}
}

exports.BidController = BidController;
