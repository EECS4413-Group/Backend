# MONOREPO
This Repository contains the entire codebase for our application.


## GETTING STARTED
The following should be installed on your pc and running:
- docker desktop

The following packages should be installed in your terminal:
- `make`
- `npm`
- `python3`

With these you should be able to simply run the entire app.

The following commands will allow you to create your own runtime environment for the app.
- `make up`
  - this will build all the containers, and launch them into a runtime environment

To takedown the app, the following command will kill all containers:
- `make down`

if the containers are being stubborn and not dying, use the following command:
- `make clean`
  - this will forceably kill all the containers, and then erase every docker image from your system (include those from other projects). Use at your own risk.

## DEVELOPMENT
If you intend on developing the various api's, it is required to have these packages installed in your terminal (expand list as you introduce your own framework):
- nodejs-19.3
  - use `nvm` (node version manager) to manage your node installation
- python 3.11
  - python version management is annoying to use, so probably just upgrade to the latest version of python

## CONVENTIONS
To make it easy to understand what is going on, please document the available endpoints for your system in the README found within each microservice directory.

Within each directory should exist an independent api, which performs a specific service. The following is a list of these services. The entire backend can only be accessed via the `auth gateway`, and as such, to access a specific service, you must make a request to the `auth gateway` with a URI prefix that indicates where the request is heading (for example: `http://localhost:8080/marketplace/create_listing`). See the table below for further information.

|  Name | Purpose | Technology/framework | URI prefix | Status |
|---|---|---|---|---|
|  [Frontend](frontend/) | Serves the UI to the user | React + redux  | N/A | To be completed for part 3 |
|  [Auth Gateway](auth_gateway/) | Facilitates User creation and Authentication. This is the only entry point to all other api services  | Express.js   | `/*` (no prefix) | Finished and Tested |
|  [Catalog](catalog/)  |  Allows marketplace to create items that can be bought and sold | Express.js  | `/catalog/*` | Finished and Tested |
|  [Wallet](wallet/)  | stores user balances and transactions  | Express.js  | `/wallet/*` | Finished, needs more tests |
|  [Marketplace](marketplace/)  | Entrypoint for all transactions. When a user decides to buy an item or bid for one, the auction house will talk to Wallet and Catalog to decide what to do.| Express.js | `/marketplace/*` | Finished, needs tests |
| [Auction Daemon](auction_daemon/) | Listens to active bids and closes them when needed |  Python3 | `/auction/*` | Finished, needs tests |
| [Shipping](shipping/) | Lets users confirm orders and specify shipping location | Express.js  | `/shipping/*`| Finished, needs tests |


