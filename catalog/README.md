# AUTH GATEWAY
the following endpoints have been created thus far within this API:
| method | URI | required headers | required body | description |
|---|---|---|---|---|
| POST | `/sign_up` | none | ```{ "login": "", "password": "", "firstName": "", "lastName": ""}``` | sign a user up when they provide a valid (unique) login, a password and a their full name |
| POST | `/sign_in` | none | ```{ "login": "", "password": ""}``` | sign a user in when they provide their login and password |
| POST | `/sign_out` | ```Authorization: ${auth_token}``` | none | sign a user out by invalidating the bearer token they used to make the request |
| POST | `/sign_out_all` | ```Authorization: ${auth_token}``` | none | sign a user out and invalidate all existing bearer token they have |
| POST | `/change_password` | ```Authorization: ${auth_token}``` | ```{ "old_password": "", "new_password": ""}``` | changes password (hashed and salted) in database to new one, and invalidates all currently existing bearer tokens |
| POST | `/verify_login` | ```Authorization: ${auth_token}``` | none | simply checks if current bearer token is valid |
| POST | `change_name` | ```Authorization: ${auth_token}``` | ```{ "first_name": "", "last_name": ""}``` | update user's name |
