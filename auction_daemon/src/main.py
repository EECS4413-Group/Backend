from api import api


def main():
    while (True):
        listings = api.get_expiring_listings()


if __name__ == "__main__":
    main()
