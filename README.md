# MONOREPO
This Repository contains the entire codebase for our application.

Within each directory should exist an independent api, which performs a specific service. The following is a list of these services

|  Name | Purpose   | Technology/framework | Owner | Status |
|---|---|---|---|---|
|  Frontend | Serves the UI to the user | React + redux  | N/A  | Incomplete|
|  Auth Gateway | Facilitates User creation and Authentication. This is the only entry point to all other api services  | Express.js   | Eli  | In Progress (almost done) |
|  Catalog  |  Allows Users to post items to buy and sell | N/A  | N/A  | Not started |
|  Wallet  | stores user balances  | N/A  | N/A  | Not started |
|  Marketplace  | Entrypoint for all transactions. When a user decides to buy an item or bid for one, the auction house will talk to Wallet and Catalog to decide what to do.| N/A  | N/A | Not started |
| Auction Daemon | Listens to active bids and informs listening websockets of live bid updates  | N/A  | N/A  | Not started |
