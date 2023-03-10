import requests
import os
import json
from models.auction import Auction

CATALOG_ENDPOINT = os.environ.get("CATALOG_ENDPOINT")


def get_expiring_listings(time=5):
    # get listings ending in `time` minutes
    response = requests.get(f'{CATALOG_ENDPOINT}/listings?ending={time}')
    body = json.loads(response.content)

    return [Auction(listing) for listing in body.get('listings', [])]


def create_shipping_notification(listing, winner_id):
    # TODO
    return


def create_wallet_transaction(listing, winner_id):
    # TODO
    return


def get_winning_bid(listing):
    # TODO
    return
