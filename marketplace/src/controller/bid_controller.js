const { Bid } = require("../model/bid");
const fetch = require("node-fetch");

const get_user_wallet = async (user_id) => {
  var response;
  try {
    response = await fetch(`http://wallet:8082/account/${user_id}`, {
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
  return response.json();
};

class BidController {
  static async show(req, res) {
    console.log(req.params);
    const listing_id = req.params.listing_id;
    if (!listing_id) {
      return res.status(500).end();
    }
    const bid = await Bid.find_highest_for_listing(listing_id);
    console.log(bid);
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
      if (Date.now() > Date.parse(current_listing.end_date)) {
        res.statusMessage = `Auction over. Your bid cannot be placed`;
        return res.status(403).end();
      }
      const current_top_bid = await Bid.find_highest_for_listing(
        bid.listing_id
      );

      if (current_top_bid && current_top_bid.amount > bid.amount) {
        res.statusMessage = `current bid is ${current_top_bid.amount}. Please bid a higher amount`;
        return res.status(403).end();
      }

      var new_bid;
      try {
        new_bid = await Bid.create({ bidder_id: user.id, ...bid });
      } catch (e) {
        if (e.message.includes("duplicate")) {
          // 1 in a trillion chance that there is UUID collision
          res.statusMessage = `Bid already exists with UUID, please retry request`;
        }
        console.log(e);
        return res.status(500).end();
      }
      return res.json(new_bid);
    } else if (current_listing.type == "dutch") {
      const current_top_bid = await Bid.find_highest_for_listing(
        bid.listing_id
      );
      if (current_top_bid != null) {
        res.statusMessage = `Item has been purchased already`;
        return res.status(403).end();
      }

      var current_price = current_listing.price;
      var time_delta = Date.now() - Date.parse(current_listing.start_date);
      time_delta = Math.floor(time_delta / 60000); // 60 seconds in a minute, 1000 milliseconds in a minute

      // current price is the max of half off and
      // 2% drop every minute that the listing is live
      // aka start at full price and drop 2% of full price until
      // listing is half off
      current_price = Math.max(
        current_price / 2,
        current_price * (1 - 0.02 * time_delta)
      );

      if (current_price > bid.amount) {
        res.statusMessage =
          "bid is too low. The auction has not arrived to this price yet";
        return res.status(403).end();
      }

      var new_bid;
      try {
        new_bid = await Bid.create({
          bidder_id: user.id,
          listing_id: bid.listing_id,
          amount: Math.min(bid.amount, current_listing.price),
        });
      } catch (e) {
        if (e.message.includes("duplicate")) {
          // 1 in a trillion chance that there is UUID collision
          res.statusMessage = `Bid already exists with UUID, please retry request`;
        }
        console.log(e);
        return res.status(500).end();
      }
      res.json(new_bid);
    } else {
      res.status(404).end();
    }
  }

  static async delete() {}
}

exports.BidController = BidController;
