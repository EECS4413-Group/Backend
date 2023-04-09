import requests
import json
import random
from dotenv import load_dotenv
import os
import datetime
import time


load_dotenv()
API = os.getenv('API_HOST')


def random_string(length):
    ret = ''
    chars = '012345689abcedfghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for _ in range(length):
        ret = ret + random.sample(chars, 1)[0]

    return ret


def create_user(login, password, first_name, last_name):
    json_body = {
        'login': login,
        'password': password,
        'firstName': first_name,
        'lastName': last_name
    }
    response = requests.post(f'http://{API}/sign_up', json=json_body)
    return response


# ======================== TESTS START HERE ======================
def test_proxy_auth_works():
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']
    # no auth header provided
    response = requests.get(f'http://{API}/shipping/foo')
    assert response.status_code == 403

    # when auth header provided
    response = requests.get(
        f'http://{API}/shipping/foo',
        headers={'authorization': token},
        json={'foo': 'bar'}
    )
    # it will proxy, but will return 404, since /foo route does not exist
    assert response.status_code == 404


def test_user_can_create_default_shipping_address():
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']

    response = requests.post(
        f'http://{API}/shipping/address',
        headers={'authorization': token},
        json={"address": {
            "street_number": 1,
            "street_name": "foo st",
            "apt_number": None,
            "postal_code": "A1A 1A1",
            "province": "ON",
        }}
    )

    assert response.status_code == 201
    body = json.loads(response.content)
    assert body["street_number"] == 1
    assert body["street_name"] == "foo st"
    assert body.get("apt_number", None) == None
    assert body["postal_code"] == "A1A 1A1"
    assert body["province"] == "ON"

    response = requests.get(
        f'http://{API}/shipping/address',
        headers={'authorization': token}
    )

    assert response.status_code == 200
    body = json.loads(response.content)
    assert body["street_number"] == 1
    assert body["street_name"] == "foo st"
    assert body.get("apt_number", None) == None
    assert body["postal_code"] == "A1A 1A1"
    assert body["province"] == "ON"

    response = requests.post(
        f'http://{API}/shipping/address',
        headers={'authorization': token},
        json={"address": {
            "street_number": 1,
            "street_name": "foo ave",
            "apt_number": None,
            "postal_code": "A1A 1A1",
            "province": "ON",
        }}
    )

    assert response.status_code == 201
    body = json.loads(response.content)
    assert body["street_name"] == "foo ave"


# condense multiple tests to reduce waiting time
def test_winning_auction_creates_shipping_label_and_user_can_update_label():
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']
    listing_json_body = {
        'name': 'foo',
        'description': 'foo bar baz',
        'type': 'normal',
        'start_date': '2023-03-05T12:00:00.000Z',
        'end_date': (datetime.datetime.utcnow() + datetime.timedelta(seconds=3)).isoformat(),

    }
    response = requests.post(
        f'http://{API}/catalog/listing',
        headers={'authorization': token},
        json=listing_json_body
    )
    listing = json.loads(response.content)

    login2 = f'user_{random_string(5)}'
    response = create_user(login2, 'password', 'fname', 'lname')
    user_id = json.loads(response.content)['user']['id']
    token2 = json.loads(response.content)['token']

    response = requests.get(
        f'http://{API}/wallet/redeem', headers={"authorization": token2}, json={})
    response = requests.post(
        f'http://{API}/marketplace/bid', headers={"authorization": token2},
        json={'bid': {'amount': 500, 'listing_id': listing["id"]}})

    time.sleep(5)

    response = requests.get(
        f'http://{API}/shipping/orders?status_filter=unconfirmed',
        headers={'authorization': token2}
    )

    assert response.status_code == 200
    body = json.loads(response.content)
    print(json.dumps(body, indent=2))
    assert body["orders"] != None
    assert any([x["listing"]["id"] == listing["id"] for x in body["orders"]])

    order = {}
    for x in body["orders"]:
        if x["listing"]["id"] == listing["id"]:
            order = x
            break

    response = requests.post(
        f'http://{API}/shipping/order/{order["id"]}',
        headers={'authorization': token2},
        json={"shipping_type": "standard"}
    )

    print(response.status_code)
    print(response.content)
    assert response.status_code == 204
