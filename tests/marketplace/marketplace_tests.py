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
    response = requests.get(f'http://{API}/marketplace/foo')
    assert response.status_code == 403

    # when auth header provided
    response = requests.get(
        f'http://{API}/marketplace/foo',
        headers={'authorization': token},
        json={'foo': 'bar'}
    )
    # it will proxy, but will return 404, since /foo route does not exist
    assert response.status_code == 404


def test_bidding_on_listing():
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']
    listing_json_body = {
        'name': 'foo',
        'description': 'foo bar baz',
        'type': 'normal',
        'start_date': '2023-03-05T12:00:00.000Z',
        'end_date': (datetime.datetime.utcnow() + datetime.timedelta(seconds=5)).isoformat(),

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

    response = requests.post(
        f'http://{API}/marketplace/bid', headers={"authorization": token2},
        json={'bid': {'amount': 500, 'listing_id': listing["id"]}})
    assert response.status_code == 403
    response = requests.get(f'http://{API}/wallet/redeem', headers={"authorization": token2}, json={})
    assert response.status_code == 200

    response = requests.post(
        f'http://{API}/marketplace/bid', headers={"authorization": token2},
        json={'bid': {'amount': 500, 'listing_id': listing["id"]}})

    assert response.status_code == 200
    assert json.loads(response.content)['amount'] == 500
    assert json.loads(response.content)['listing_id'] == listing['id']
    assert json.loads(response.content)['bidder_id'] == user_id

    response = requests.post(
        f'http://{API}/marketplace/bid', headers={"authorization": token2},
        json={'bid': {'amount': 400, 'listing_id': listing["id"]}})

    assert response.status_code == 403
    time.sleep(5)

    response = requests.post(
        f'http://{API}/marketplace/bid', headers={"authorization": token2},
        json={'bid': {'amount': 600, 'listing_id': listing["id"]}})

    assert response.status_code == 403


def test_bidding_on_listing_dutch():
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']
    listing_json_body = {
        'name': 'foo',
        'description': 'foo bar baz',
        'type': 'dutch',
        'price': 500,
        'start_date': datetime.datetime.utcnow().isoformat(),
        'end_date': datetime.datetime.utcnow().isoformat(),  # end date holds no symbolic meaning

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

    response = requests.post(
        f'http://{API}/marketplace/bid', headers={"authorization": token2},
        json={'bid': {'amount': 500, 'listing_id': listing["id"]}})
    assert response.status_code == 403

    response = requests.get(f'http://{API}/wallet/redeem', headers={"authorization": token2}, json={})
    assert response.status_code == 200

    response = requests.post(
        f'http://{API}/marketplace/bid', headers={"authorization": token2},
        json={'bid': {'amount': 200, 'listing_id': listing["id"]}})

    assert response.status_code == 403

    response = requests.post(
        f'http://{API}/marketplace/bid', headers={"authorization": token2},
        json={'bid': {'amount': 500, 'listing_id': listing["id"]}})
    assert response.status_code == 200
    assert json.loads(response.content)['amount'] == 500
    assert json.loads(response.content)['listing_id'] == listing['id']
    assert json.loads(response.content)['bidder_id'] == user_id

    response = requests.post(
        f'http://{API}/marketplace/bid', headers={"authorization": token2},
        json={'bid': {'amount': 400, 'listing_id': listing["id"]}})

    assert response.status_code == 403


def test_ws_connection_notify_on_new_bid():
    return
