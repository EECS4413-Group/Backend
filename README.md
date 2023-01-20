# MONOREPO
This Repository contains the entire codebase for our application.

Within each directory should exist an independent api, which performs a specific service. The following is a list of these services

|  Name | Purpose | Technology/framework | URI prefix | Owner | Status |
|---|---|---|---|---|---|
|  Frontend | Serves the UI to the user | React + redux  | N/A | N/A  | Incomplete|
|  Auth Gateway | Facilitates User creation and Authentication. This is the only entry point to all other api services  | Express.js   | `/*` (no prefix) | Eli  | In Progress (almost done) |
|  Catalog  |  Allows marketplace to create items that can be bought and sold | N/A  | `/catalog/*` | N/A  | Not started |
|  Wallet  | stores user balances  | N/A  | `/wallet/*` | N/A  | Not started |
|  Marketplace  | Entrypoint for all transactions. When a user decides to buy an item or bid for one, the auction house will talk to Wallet and Catalog to decide what to do.| N/A | `/marketplace/*` | N/A | Not started |
| Auction Daemon | Listens to active bids and informs listening websockets of live bid updates  | N/A  | `/live_auction/*`| N/A | Not started |


## GETTING STARTED
The following should be installed on your pc and running:
- docker

The following packages should be installed in your terminal:
- `make`

With these alone, you should be able to simply run the entire app. Docker allows your system to not require languages, packages and frameworks to be installed, and instead will load them into the container image before launching the app.

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
- ruby 3.0.2
  - use `rvm` (ruby version manager) to manage your ruby installation
- python 3.11
  - python version management is annoying to use, so probably just upgrade to the latest version of python (lol)

## CONVENTIONS
To make it easy to understand what is going on, please document the available endpoints for your system in the README found within each microservice directory.


