import requests
import json
import random
from dotenv import load_dotenv
import os
import datetime


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
def test_wallet_created_on_account_creation():
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']

    response = requests.get(f'http://{API}/wallet/account', headers={"authorization": token})
    assert response.status_code == 200

    body = json.loads(response.content)
    assert body['balance'] == 0
    assert body['last_redeem_time'] == datetime.datetime(
        1970, 1, 1).replace(
        tzinfo=datetime.timezone.utc).isoformat().replace(
        '+00:00', '.000Z')


def test_redeem():
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']

    response = requests.get(f'http://{API}/wallet/account', headers={"authorization": token})
    assert response.status_code == 200

    # assert empty wallet on account creation
    body = json.loads(response.content)
    assert body['balance'] == 0
    assert body['last_redeem_time'] == datetime.datetime(
        1970, 1, 1).replace(
        tzinfo=datetime.timezone.utc).isoformat().replace(
        '+00:00', '.000Z')

    response = requests.get(f'http://{API}/wallet/redeem', headers={"authorization": token}, json={})
    assert response.status_code == 200

    response = requests.get(f'http://{API}/wallet/account', headers={"authorization": token})
    assert response.status_code == 200
    body = json.loads(response.content)
    assert body['balance'] == 4000
    assert datetime.datetime.strptime(
        body['last_redeem_time'], "%Y-%m-%dT%H:%M:%S.%fZ") > datetime.datetime.now() - datetime.timedelta(minutes=5)
