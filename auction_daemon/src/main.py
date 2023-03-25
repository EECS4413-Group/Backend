from api import api
import pause
import time
from datetime import datetime
from datetime import timedelta
import traceback


def winner_tasks(listing):
    winning_bid = api.get_winning_bid(listing)
    success = api.create_wallet_transaction(listing, winning_bid)
    if not success:
        return
    success = api.create_shipping_notification(listing, winning_bid)
    if not success:
        print(f'failed to create shipping notification for {listing.id}')


def main():
    time.sleep(30)
    while (True):
        try:
            print("started")
            end = datetime.now() + timedelta(seconds=5)
            listings = api.get_expiring_listings()
            listings.sort(key=lambda x: x.end_date)
            for listing in listings:
                pause.until(listing.end_date)
                winner_tasks(listing)
            pause.until(end)
            print("finished")
        except Exception as e:
            print(traceback.format_exc())
            time.sleep(5)


if __name__ == "__main__":
    main()
