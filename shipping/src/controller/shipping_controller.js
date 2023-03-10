const { Order } = require("../model/order");
const { Address } = require("./../model/address");
const fetch = require("node-fetch");

const get_listing = async (listing_id) => {
  var response;
  try {
    response = await fetch(`http://catalog:8081/listing/${listing_id}`, {
      method: "GET",
    });
  } catch (e) {}
  return response.json();
};

const get_bid = async (bid_id) => {
  var response;
  try {
    response = await fetch(`http://marketplace:8083/bid/${bid_id}`, {
      method: "GET",
    });
  } catch (e) {}
  return response.json();
};

class ShippingController {
  static async show(req, res) {
    const user_id = req.params.user_id;
    const status_filter = req.params.status_filter || "";
    if (!user_id) {
      return res.status(500).end();
    }
    const orders = await Order.find_all_by_user_id(user_id, status_filter);
    res.json({ orders: orders });
  }

  static async create(req, res) {
    const { user_id, listing_id, bid_id } = req.body;
    var order;
    try {
      order = await Order.create({
        user_id,
        listing_id,
        bid_id,
        status: "unconfirmed",
      });
    } catch (e) {
      if (e.message.includes("duplicate")) {
        // 1 in a trillion chance that there is UUID collision
        res.statusMessage = `Order already exists with UUID, please retry request`;
      }
      console.log(e);
      return res.status(500).end();
    }
    res.json(order);
  }

  static async update(req, res) {
    const {
      user,
      body: { order_id, action, address },
    } = req.body;

    if (action == "confirm") {
      // behavior if someone wants to confirm their order
      const order = await Order.find_by_id(order_id);
      const listing = await get_listing(order.listing_id);
      const bid = await get_bid(order.bid_id);
      try {
        response = await fetch("http://wallet:8082/transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reciever_id: listing.owner_id,
            sender_id: user.id,
            amount: bid.value,
          }),
        });
      } catch (e) {
        console.log(e);
      }
      var shipping_address;
      if (address != null) {
        shipping_address = Address.create({ user_id: user.id, ...address });
      } else {
        shipping_address = Address.find_default(user_id);
      }
      order.update({
        status: "confirmed",
        address_id: shipping_address.id,
      });
    } else if (action == "decline") {
      // behavior if someone want to reject order
      const order = await Order.find_by_id(order_id);
      const listing = await get_listing(order.listing_id);
      const bid = await get_bid(order.bid_id);
      try {
        response = await fetch("http://wallet:8082/transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reciever_id: listing.owner_id,
            sender_id: user.id,
            amount: Math.floor(bid.value / 10),
          }),
        });
      } catch (e) {
        console.log(e);
      }
      order.update({
        status: "declined",
      });
    }
    res.status(204).end();
  }

  static async create_default_address(req, res) {
    const {
      user,
      body: { address },
    } = req.body;
    var default_address = await Address.find_default(user.id);
    if (!default_address) {
      default_address = await Address.create(...address);
    } else {
      default_address = await Address.update({
        user_id: user.id,
        ...address,
      });
    }
    res.json(new_address);
  }
  static async delete() {}
}

exports.ShippingController = ShippingController;
