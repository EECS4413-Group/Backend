# SHIPPING
the following endpoints have been created thus far within this API:
| method | URI | required headers | required body | required parameters | description |
|---|---|---|---|---|---|
| GET | `/orders/:user_id` | ```Authorization: ${auth_token}``` | none | `?filter=`| gets all orders of a given type denoted by `filter` |
| POST | `/order` | none (for internal use only) | ```{ listing_id: id, bid_id: id, user_id: id  }``` | | creates an order for a user based on their participation in a given auction |
| POST | `/order/:order_Id` | ```Authorization: ${auth_token}``` | ```{ status: "status string"  }``` | | allows a user to update the status of an order, they may choose to get `standard` shipping or `expedited` shipping |
