const express = require("express");
const proxy = require("express-http-proxy");
const { Database } = require("./database/client");
const { Migrator } = require("./database/migrator");
const { UserController } = require("./controller/user_controller");
const { Token } = require("./model/token");

Database.init();
Migrator.migrateAll();

const app = express();
app.use(express.json());

// register new user
app.post("/sign_up", async (req, res) => {
  UserController.create(req, res);
});

// grant new token (other tokens can exist)
app.post("/sign_in", async (req, res) => {
  UserController.login(req, res);
});

// expire this token
app.post("/sign_out", async (req, res) => {
  UserController.logout(req, res);
});

// expire all tokens
app.post("/sign_out_all", async (req, res) => {
  UserController.logout_all(req, res);
});

// hash new password and save, salt stays the same
app.post("/change_password", async (req, res) => {
  UserController.change_password(req, res);
});

// show bearer token, if valid return 200, else, return 403
app.get("/verify_login", async (req, res) => {
  UserController.validate_user(req, res);
});

// show bearer token, if valid return 200, else, return 403
app.post("/change_user_info", async (req, res) => {
  UserController.change_user_info(req, res);
});

app.use(
  "/catalog",
  proxy("catalog:8083", {
    proxyReqBodyDecorator: (bodyContent, srcReq) => {
      return new Promise((resolve, reject) => {
        Token.find_by_token(srcReq.headers.authorization).then((token) => {
          if (token == null) {
            reject(null);
            return;
          }
          resolve({ body: bodyContent, user: token.user });
        });
      });
    },
    filter: (req, res) => {
      return new Promise((resolve, reject) => {
        Token.find_by_token(req.headers.authorization).then((token) => {
          resolve(token != null);
        });
      });
    },
  })
);

app.use(
  "/wallet",
  proxy("wallet:8082", {
    proxyReqPathResolver: (req) => {
      // all get requests need to be decorated with user id
      // this prevents other users from accessing a users wallet
      if (req.method != "GET") {
        return req.url;
      }
      return new Promise((resolve, reject) => {
        Token.find_by_token(req.headers.authorization).then((token) => {
          if (token == null) {
            reject(null);
            return;
          }
          resolve(`req.url?${token.user.id}`);
        });
      });
    },
    proxyReqBodyDecorator: (bodyContent, srcReq) => {
      return new Promise((resolve, reject) => {
        Token.find_by_token(srcReq.headers.authorization).then((token) => {
          if (token == null) {
            reject(null);
            return;
          }
          resolve({ body: bodyContent, user: token.user });
        });
      });
    },
    filter: (req, res) => {
      return new Promise((resolve, reject) => {
        Token.find_by_token(req.headers.authorization).then((token) => {
          resolve(token != null);
        });
      });
    },
  })
);

app.use((req, res) => {
  res.status(403).end();
});

app.listen("8080", () => {
  console.log("listening on port 8080");
});
