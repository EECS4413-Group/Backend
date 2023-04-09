const { Order } = require("../model/order");
const { Address } = require("./../model/address");
const fetch = require("node-fetch");

const get_listing = async (listing_id) => {
  var response;
  try {
    response = await fetch(`http://catalog:8083/listing/${listing_id}`, {
      method: "GET",
    });
  } catch (e) {}
  if (response.status > 300) {
    return {};
  }
  return response.json();
};

const get_bid = async (bid_id) => {
  var response;
  if (!bid_id) {
    return {};
  }
  try {
    response = await fetch(`http://marketplace:8081/bid/id/${bid_id}`, {
      method: "GET",
    });
  } catch (e) {
    console.log(e);
  }
  if (response.status > 300) {
    return {};
  }
  return response.json();
};

class ShippingController {
  static async index(req, res) {
    const user_id = req.params.user_id;
    const status_filter = req.query.status_filter || "";
    if (!user_id) {
      return res.status(500).end();
    }
    const orders = await Order.find_all_by_user_id(user_id, status_filter);

    const new_orders = [];
    for (let i = 0; i < orders.length; i++) {
      var new_order = {};
      new_order.bid = await get_bid(orders[i].bid_id);
      new_order.address = await Address.find_by_id(orders[i].address_id);
      new_order.listing = await get_listing(orders[i].listing_id);
      new_order.user_id = orders[i].user_id;
      new_order.id = orders[i].id;
      new_order.status = orders[i].status;
      new_orders.push(new_order);
    }
    res.json({ orders: new_orders });
  }

  static async show(req, res) {
    const order_id = req.params.order_id;
    const user_id = req.params.user_id;
    const order = await Order.find_by_id(order_id);
    order.bid = await get_bid(order.bid_id);
    order.address = order.address_id
      ? await Address.find_by_id(order.address_id)
      : await Address.find_default(user_id);
    order.listing = await get_listing(order.listing_id);
    order.user_id = order.user_id;
    order.id = order.id;
    order.status = order.status;
    res.status(200).json(order);
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
    order.bid = await get_bid(order.bid_id);
    order.address = await Address.find_by_id(order.address_id);
    order.listing = await get_listing(order.listing_id);
    order.user_id = order.user_id;
    order.id = order.id;
    order.status = order.status;
    res.status(201).json(order);
  }

  static async update(req, res) {
    const order_id = req.params.order_id;
    const {
      user,
      body: { shipping_type, address },
    } = req.body;
    const order = await Order.find_by_id(order_id);

    var shipping_address;
    if (address != null) {
      shipping_address = Address.create({ user_id: user.id, ...address });
    } else {
      shipping_address = Address.find_default(user.id);
    }
    order.update({
      status: `confirmed-${shipping_type}`,
      address_id: shipping_address.id,
    });
    res.status(204).end();
  }

  static async get_default_address(req, res) {
    const user_id = req.params.user_id;
    const default_address = await Address.find_default(user_id);
    res.json(default_address || {});
  }

  static async create_default_address(req, res) {
    const {
      user,
      body: { address },
    } = req.body;
    var default_address = await Address.find_default(user.id);
    if (!default_address) {
      default_address = await Address.create({
        user_id: user.id,
        is_default: true,
        ...address,
      });
    } else {
      await default_address.update({
        user_id: user.id,
        ...address,
      });
    }
    res.status(201).json(default_address);
  }
  static async delete() {}
}

exports.ShippingController = ShippingController;
