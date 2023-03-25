# AUCTION DAEMON
This system performs the following tasks:
- Monitors upcoming traditional auctions
- Upon completion of the auction, the daemon:
  - creates a transaction
  - creates a shipping notification

## DEVELOPMENT
This microservice was developed with `python3`. To contribute, make sure you have `python3` installed on your system.

## DEPENDENCIES
This microservice relies on the following systems:
- marketplace
- wallet
- catalog
- shipping

If any of these services are down, the system will not be able to successfully fulfill its obligations

Additionally, this system maintains no endpoints. This means that it is an independent monitor, and performs actions based on predefined business rules.
