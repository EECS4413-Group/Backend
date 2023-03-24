import requests
import os
import json
from models.auction import Auction
from models.bid import Bid

CATALOG_ENDPOINT = os.environ.get("CATALOG_ENDPOINT")
SHIPPING_ENDPOINT = os.environ.get("SHIPPING_ENDPOINT")
WALLET_ENDPOINT = os.environ.get("WALLET_ENDPOINT")
MARKETPLACE_ENDPOINT = os.environ.get("MARKETPLACE_ENDPOINT")


def get_expiring_listings(time=5):
    # get listings ending in `time` minutes
    response = requests.get(f'{CATALOG_ENDPOINT}/listings?ending={time}')
    body = json.loads(response.content)

    return [Auction(listing) for listing in body.get('listings', [])]


def create_shipping_notification(listing, winning_bid):
    response = requests.post(
        f'{SHIPPING_ENDPOINT}/orders',
        json={
            "user_id": winning_bid.user_id,
            "listing_id": listing.id,
            "bid_id": winning_bid.id
        })
    if response.status_code != 201:
        return None
    return json.loads(response.content)


def create_wallet_transaction(listing, winning_bid):
    response = requests.post(
        f'{WALLET_ENDPOINT}/transaction',
        json={
            "sender_id": winning_bid.user_id,
            "reciever_id": listing.owner_id,
            "amount": winning_bid.amount
        })
    if response.status_code != 200:
        return None
    return True


def get_winning_bid(listing):
    response = requests.post(
        f'{MARKETPLACE_ENDPOINT}/bid/{listing.id}')
    if response.status_code != 200:
        return None

    return Bid(json.loads(response.content))
