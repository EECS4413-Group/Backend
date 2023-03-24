from datetime import datetime


class Auction():

    def __init__(self, listing):
        self.name = listing.get("name", None)
        self.id = listing.get("id", None)
        self.owner_id = listing.get("owner_id", None)
        self.name = listing.get("name", None)
        self.description = listing.get("description", None)
        self.type = listing.get("type", None)
        self.start_date = listing.get("start_date", None)
        self.end_date = datetime.strptime(listing.get("end_date", None))

    def end(self):
        return
