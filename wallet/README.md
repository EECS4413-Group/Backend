# WALLET
the following endpoints have been created thus far within this API:
| method | URI | required headers | required body | required parameters | description |
|---|---|---|---|---|---|
| GET | `/wallet` | ```Authorization: ${auth_token}``` | none | none | returns the wallet of the user, showing how many credits they have |
| GET | `/transaction` | none (for internal use only) | ```{ sender_id: id, receiver_id id, amount: ###  }``` | Given the provided ids and amount, is the transaction possible? |
| GET | `/transaction` | none (for internal use only) | ```{ sender_id: id, receiver_id id, amount: ###  }``` | Given the provided ids and amount, execute the transaction while still validating if it is possible |
