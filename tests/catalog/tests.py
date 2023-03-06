import requests
import json
import random
from dotenv import load_dotenv
import os


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
    response = requests.get(f'http://{API}/catalog/foo')
    assert response.status_code == 403

    # when auth header provided
    response = requests.get(
        f'http://{API}/catalog/foo',
        headers={'authorization': token},
        json={'foo': 'bar'}
    )
    # it will proxy, but will return 404, since /foo route does not exist
    assert response.status_code == 404


def test_create_new_listing():
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']
    listing_json_body = {
        'name': 'foo',
        'description': 'foo bar baz',
        'type': 'normal',
        'start_date': '2023-03-05T12:00:00.000Z',
        'end_date': '2023-03-06T12:00:00.000Z',

    }
    response = requests.post(
        f'http://{API}/catalog/listing',
        headers={'authorization': token},
        json=listing_json_body
    )
    assert response.status_code == 201
    body = json.loads(response.content)
    for k, v in listing_json_body.items():
        assert body[k] == v


def test_update_existing_listing():
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']
    listing_json_body = {
        'name': 'foo',
        'description': 'foo bar baz',
        'type': 'normal',
        'start_date': '2023-03-05T12:00:00.000Z',
        'end_date': '2023-03-06T12:00:00.000Z',

    }
    response = requests.post(
        f'http://{API}/catalog/listing',
        headers={'authorization': token},
        json=listing_json_body
    )
    assert response.status_code == 201
    listing_id = json.loads(response.content)['id']

    response = requests.post(
        f'http://{API}/catalog/listing/{listing_id}',
        headers={'authorization': token},
        json={
            'description': 'foo bar baz spam eggs ham'
        }
    )

    assert response.status_code == 200
    body = json.loads(response.content)
    assert body['description'] == 'foo bar baz spam eggs ham'


def test_getting_one_listing():
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']
    listing_json_body = {
        'name': 'foo',
        'description': 'foo bar baz',
        'type': 'normal',
        'start_date': '2023-03-05T12:00:00.000Z',
        'end_date': '2023-03-06T12:00:00.000Z',

    }
    response = requests.post(
        f'http://{API}/catalog/listing',
        headers={'authorization': token},
        json=listing_json_body
    )
    assert response.status_code == 201
    listing_id = json.loads(response.content)['id']

    response = requests.get(
        f'http://{API}/catalog/listing/{listing_id}',
        headers={'authorization': token}
    )

    assert response.status_code == 200
    body = json.loads(response.content)
    for k, v in listing_json_body.items():
        assert body[k] == v


def test_getting_listings_by_filter():
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']
    listing_ids = []
    for i in range(5):
        listing_json_body = {
            'name': f'foo{i}',
            'description': 'foo bar baz',
            'type': 'normal',
            'start_date': '2023-03-05T12:00:00.000Z',
            'end_date': '2023-03-06T12:00:00.000Z',

        }
        response = requests.post(
            f'http://{API}/catalog/listing',
            headers={'authorization': token},
            json=listing_json_body
        )
        assert response.status_code == 201
        listing_id = json.loads(response.content)['id']
        listing_ids.append(listing_id)

    response = requests.get(
        f'http://{API}/catalog/listing?search=foo',
        headers={'authorization': token}
    )
    assert response.status_code == 200

    body = json.loads(response.content)
    for listing_id in listing_ids:
        assert any([x['id'] == listing_id for x in body['listings']])

    for i in range(5):
        assert any([x['name'] == f'foo{i}' for x in body['listings']])
