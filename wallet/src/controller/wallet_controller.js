const { Wallet } = require("../model/wallet");
const { Transaction } = require("../model/transaction");

class WalletController {
  static async show(req, res) {
    const wallet_id = req.params.wallet_id;
    const wallet = await Wallet.find_by_id(wallet_id);
    if (!wallet) {
      res.statusMessage = `wallet with id: ${wallet_id} does not exist`;
      return res.status(404).end();
    }
    res.json(wallet);
  }

  static async create(req, res) {
    const { user } = req.body;
    var wallet;
    try {
      wallet = await Wallet.create(user.id);
    } catch (e) {
      if (e.message.includes("duplicate")) {
        // 1 in a trillion chance that there is UUID collision
        res.statusMessage = `Listing already exists with UUID, please retry request`;
      }
      return res.status(500).end();
    }
    res.json(wallet);
  }

  static async check_transaction(req, res) {
    const {
      body: { sender_id, reciever_id, amount },
    } = req.body;
    if (!sender_id) {
      res.statusMessage = "must specify an sender_id";
      return res.status(400).end();
    }
    if (!reciever_id) {
      res.statusMessage = "must specify an reciever_id";
      return res.status(400).end();
    }
    if (!amount) {
      res.statusMessage = "must specify an amount";
      return res.status(400).end();
    }

    const wallet_sender = await Listing.find_by_id(sender_id);
    if (wallet_sender - amount < 0) {
      res.statusMessage =
        "transaction not possible, user doesn't not have enough tokens";
      res.status(403).end();
    }
    res.status(200).end();
  }

  static async do_transaction(req, res) {
    const {
      body: { sender_id, reciever_id, amount },
    } = req.body;
    if (!sender_id) {
      res.statusMessage = "must specify an sender_id";
      return res.status(400).end();
    }
    if (!reciever_id) {
      res.statusMessage = "must specify an reciever_id";
      return res.status(400).end();
    }
    if (!amount) {
      res.statusMessage = "must specify an amount";
      return res.status(400).end();
    }

    const wallet_sender = await Listing.find_by_id(sender_id);
    if (wallet_sender.balance - amount < 0) {
      res.statusMessage =
        "transaction not possible, user doesn't not have enough tokens";
      res.status(403).end();
    }

    const wallet_reciever = await Listing.find_by_id(reciever_id);
    if (!wallet_reciever) {
      res.statusMessage = `reciever with id ${reciever_id} does not have a wallet`;
      res.status(403).end();
    }

    wallet_sender.update({ balance: wallet_sender.balance - amount });
    wallet_reciever.update({ balance: wallet_reciever + amount });
    Transaction.create({
      reciever_id: reciever_id,
      sender_id: sender_id,
      type: "buy",
      amount: amount,
    });
    res.status(200).end();
  }

  static async redeem_tokens(req, res) {
    const { user } = req.body;
    const wallet_redeemer = Wallet.find_by_owner_id(user.id);
    const MS_PER_MINUTES = 60000;
    const TIME_BETWEEN_REDEEMS = 60 * 24 * MS_PER_MINUTES;
    if (
      new Date(Date.now().getTime() - TIME_BETWEEN_REDEEMS).getTime() <
      wallet_redeemer.last_redeem_time.getTime()
    ) {
      res.statusMessage = `Please wait before redeeming again`;
      return res.status(403).end();
    }

    const TOKENS_PER_REDMPTION = 4000;
    wallet_redeemer.update({
      balance: wallet_redeemer.balance + TOKENS_PER_REDMPTION,
      last_redeem_time: Date.now(),
    });
    res.json(wallet_redeemer).end();
  }

  static async delete() {}
}

exports.WalletController = WalletController;
