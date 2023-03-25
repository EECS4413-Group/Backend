# CATALOG
the following endpoints have been created thus far within this API:
| method | URI | required headers | required body | required_parameters | description |
|---|---|---|---|---|---|
| GET | `/listing` | ```Authorization: ${auth_token}``` | none | ```?search=``` | query for listings based on provided params |
| GET | `listing/ending_soon` | none (should only be called internally) | none | none | provides all soon to end actions (time is tightly coupled with auction daemon cycle time) |
| GET | `/listing/:listing_id` | ```Authorization: ${auth_token}``` | none | none | get detailed information about a specific listing |
| POST |  `/listing` | ```Authorization: ${auth_token}``` | ```{name: "${name}", description: ${description}, type: {normal/dutch}, start_date: datetime, end_date: datetime, image: binary}``` | none | create new listing |
| POST |  `/listing/:listing_id` | ```Authorization: ${auth_token}``` | ```{name: "${name}", description: ${description}, type: {normal/dutch}, start_date: datetime, end_date: datetime, image: binary}``` | none | update listing with specified parameters |
