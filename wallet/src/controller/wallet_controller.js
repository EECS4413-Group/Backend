const { Account } = require("../model/account");
const { Transaction } = require("../model/transaction");

class WalletController {
  static async show(req, res) {
    const account_id = req.params.account_id;
    if (!account_id) {
      return res.status(500).end();
    }
    const account = await Account.find_by_owner_id(account_id);
    if (!account) {
      res.statusMessage = `account with id: ${account_id} does not exist`;
      return res.status(404).end();
    }
    res.json({
      balance: account.balance,
      last_redeem_time: account.last_redeem_time,
    });
  }

  static async create(req, res) {
    const { user } = req.body;
    var account;
    try {
      account = await Account.create(user.id);
    } catch (e) {
      if (e.message.includes("duplicate")) {
        // 1 in a trillion chance that there is UUID collision
        res.statusMessage = `Account already exists with UUID, please retry request`;
      }
      console.log(e);
      return res.status(500).end();
    }
    res.json(account);
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

    const Account_sender = await Account.find_by_id(sender_id);
    if (Account_sender - amount < 0) {
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

    const account_sender = await Account.find_by_id(sender_id);
    if (account_sender.balance - amount < 0) {
      res.statusMessage =
        "transaction not possible, user doesn't not have enough tokens";
      res.status(403).end();
    }

    const account_reciever = await Account.find_by_id(reciever_id);
    if (!account_reciever) {
      res.statusMessage = `reciever with id ${reciever_id} does not have a wallet`;
      res.status(403).end();
    }

    account_sender.update({ balance: account_sender.balance - amount });
    account_reciever.update({ balance: account_reciever + amount });
    Transaction.create({
      reciever_id: reciever_id,
      sender_id: sender_id,
      type: "buy",
      amount: amount,
    });
    res.status(200).end();
  }

  static async redeem_tokens(req, res) {
    // FIXED CONSTANT, SHOULD BE LOADED FROM ENVIRONMENT
    const TOKENS_PER_REDMPTION = 4000;
    const MS_PER_MINUTES = 60000;
    const TIME_BETWEEN_REDEEMS = 60 * 24 * MS_PER_MINUTES;

    const account_id = req.params.account_id;
    const account_redeemer = await Account.find_by_owner_id(account_id);

    if (!account_redeemer) {
      res.statusMessage = `account for user with id ${account_id} does not exist`;
      res.status(404).end();
    }

    if (
      new Date(Date.now() - TIME_BETWEEN_REDEEMS).getTime() <
      account_redeemer.last_redeem_time.getTime()
    ) {
      res.statusMessage = `Please wait before redeeming again`;
      return res.status(403).end();
    }

    account_redeemer.update({
      balance: account_redeemer.balance + TOKENS_PER_REDMPTION,
      last_redeem_time: new Date(Date.now()),
    });
    res.json(account_redeemer);
  }

  static async delete() {}
}

exports.WalletController = WalletController;
