
class Bid():

    def __init__(self, bid):
        self.id = bid.get('id', None)
        self.bidder_id = bid.get('bidder_id', None)
        self.amount = bid.get('amount', None)
