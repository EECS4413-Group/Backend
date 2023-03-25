# MARKETPLACE
the following endpoints have been created thus far within this API:
| method | URI | required headers | required body | description |
|---|---|---|---|---|
| GET | `/bid/{listing_id}` | none | none | provides the current highest bid for a given auction |
| POST | `/bid` | ```Authorization: ${auth_token}``` | ```{ listing_id: id, amount: ### }``` | provides an endpoint for the user to place a bid on a given auction, works for both `normal` and `dutch` auctions |
