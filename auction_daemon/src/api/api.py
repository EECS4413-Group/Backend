import requests
import os
import json
from models.auction import Auction
from models.bid import Bid

CATALOG_ENDPOINT = os.environ.get("CATALOG_ENDPOINT")
SHIPPING_ENDPOINT = os.environ.get("SHIPPING_ENDPOINT")
WALLET_ENDPOINT = os.environ.get("WALLET_ENDPOINT")
MARKETPLACE_ENDPOINT = os.environ.get("MARKETPLACE_ENDPOINT")


def get_expiring_listings():
    print('getting listings that end within next 5 seconds')
    response = requests.get(f'http://{CATALOG_ENDPOINT}:8083/listing/ending_soon')
    body = json.loads(response.content)

    return [Auction(listing) for listing in body.get('listings', [])]


def create_shipping_notification(listing, winning_bid):
    response = requests.post(
        f'http://{SHIPPING_ENDPOINT}:8084/orders',
        json={
            "user_id": winning_bid.bidder_id,
            "listing_id": listing.id,
            "bid_id": winning_bid.id
        })
    if response.status_code != 201:
        return None
    return json.loads(response.content)


def create_wallet_transaction(listing, winning_bid):
    response = requests.post(
        f'http://{WALLET_ENDPOINT}:8082/transaction',
        json={
            "sender_id": winning_bid.bidder_id,
            "reciever_id": listing.owner_id,
            "amount": winning_bid.amount
        })
    if response.status_code != 200:
        return None
    return True


def get_winning_bid(listing):
    response = requests.get(
        f'http://{MARKETPLACE_ENDPOINT}:8081/bid/{listing.id}')
    print(response.content)
    if response.status_code != 200:
        return None

    return Bid(json.loads(response.content))
