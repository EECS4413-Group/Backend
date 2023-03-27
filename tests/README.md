# TESTS

## AUTHENTICATION
| test name | description |
| --- | --- |
|test_create_user| This test creates a user, and then checks that the api endpoint correctly stored the users information within the database |
|test_login| this test creates a user. Then, using the password the user "chose", logs in again, ensuring that the server returns a new token and ensures a 200 status code|
|test_verify_login| this tests that when a user is created and served an authentication token, that the `verify_login` endpoint returns a `200` code when the user provides their token|
|test_logout| this tests that, after a user is given an authentication token, if they choose to logout with this token, it will invalidate itself and no longer provide any authorization for the user |
|test_logout_all| this test verifies that upon creating multiple tokens, if a user chooses to logout with 1 token using the `logout_all` endpoint, every single existing token is immediately invalidated|
|test_change_password| this test verifies that, upon a user changing their password, all existing auth tokens no longer work, and that the old password also no longer serves the user a token.|
|test_change_user_name| this tests that a user may update their personal information through the authentication gateway|
## CATALOG
| test name | description |
| --- | --- |
|test_proxy_auth_works| tests that the user must provide an authentication token, through which the authentication server will proxy their request to the next microservice|
|test_create_new_listing| tests that upon creating a new listing, the data returned by the database is correct and formatted properly|
|test_update_existing_listing|tests that a user is able to update a listing, and that the database returns the updated information when the user requests information regarding the listing |
|test_getting_one_listing| tests that a user may provide a listing id, and they will be served with detailed information about a given listing |
|test_getting_listing_by_filter| tests that a user may provide a query term, and the api service will serve all existing listings which have similar strings within their name|
## MARKETPLACE
| test name | description |
| --- | --- |
|test_proxy_auth_works| tests if the auth server correctly proxies a request to the desired endpoint|
|test_bidding_on_listing| tests various interaction related to bidding on a listing. This includes bidding below the current top bid, bidding on a closed auction, and bidding conventionally |
| test_bidding_on_listing_dutch| tests various interaction related to bidding on a dutch auction. This includes checking if the price updates after given interval, bidding on an already closed auction, and bidding above and below the amount that the auction is currently at.|
## SHIPPING
| test name | description |
| --- | --- |
|test_proxy_auth_works| tests if authenticated user is able to route to the shipping server|
|test_user_can_create_default_shipping_address|Tests if a user is able to set a default shipping address|
|test_winning_auction_creates_shipping_label_and_user_can_update_label| tests if after winning an auction the user is served with an unconfirmed shipping message. Additionally tests if a user is able to update the notification and specify which type of shipping they want|
## WALLET
| test name | description |
| --- | --- |
|test_wallet_created_in_account_creation| tests if a wallet is created for a user when a user creates an account|
|test_redeem| tests various behaviours related to redeeming tokens. This includes redeeming and checking balance before and after the api call. Additionally checks that a user cannot invoke redeem more than once per day.|
|test_winning_auction_removes_tokens | tests if, after an auction ends, a user will have their money removed if they win an auction|
