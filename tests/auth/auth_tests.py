
import requests
import json
import random
from dotenv import load_dotenv
import os


load_dotenv()
API = os.getenv("API_HOST")


def random_string(length):
    ret = ''
    chars = "012345689abcedfghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for _ in range(length):
        ret = ret + random.sample(chars, 1)[0]

    return ret


def create_user(login, password, first_name, last_name):
    json_body = {
        "login": login,
        "password": password,
        "firstName": first_name,
        "lastName": last_name
    }
    response = requests.post(f'http://{API}/sign_up', json=json_body)
    return response

# ======================== TESTS START HERE ======================


def test_create_user():
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    # checks if status code is correct
    assert response.status_code == 201

    body = json.loads(response.content)
    # checks if user info is correct and also makes sure that password isnt returned
    assert body.get('user', None) != None
    assert body['user']['firstName'] == 'fname'
    assert body['user']['lastName'] == 'lname'
    assert body['user']['login'] == login
    assert body.get('password', None) == None

    # checks if token is returned
    assert body.get('token', None) != None


def test_login():
    login = f'user_{random_string(5)}'
    create_user(login, 'password', 'fname', 'lname')

    response = requests.post(
        f'http://{API}/sign_in', json={"login": login, "password": 'password'}
    )

    assert response.status_code == 200
    body = json.loads(response.content)
    assert body.get('user', None) != None
    assert body['user']['firstName'] == 'fname'
    assert body['user']['lastName'] == 'lname'
    assert body['user']['login'] == login
    assert body.get('password', None) == None

    assert body.get('token', None) != None


def test_verify_login():
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']
    response = requests.get(
        f'http://{API}/verify_login',
    )
    assert response.status_code == 403
    response = requests.get(
        f'http://{API}/verify_login', headers={"authorization": token}
    )
    assert response.status_code == 200


def test_logout():
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']
    response = requests.get(
        f'http://{API}/verify_login', headers={"authorization": token}
    )
    assert response.status_code == 200

    response = requests.post(
        f'http://{API}/sign_out', headers={"authorization": token})
    assert response.status_code == 204

    response = requests.get(
        f'http://{API}/verify_login', headers={"authorization": token}
    )
    assert response.status_code == 403


def test_logout_all():
    # create user
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']
    response = requests.get(
        f'http://{API}/verify_login', headers={"authorization": token}
    )
    assert response.status_code == 200

    # create 2nd token
    response = requests.post(
        f'http://{API}/sign_in', json={"login": login, "password": 'password'}
    )
    token2 = json.loads(response.content)['token']
    response = requests.get(
        f'http://{API}/verify_login', headers={"authorization": token2}
    )
    assert response.status_code == 200

    # invalidate all tokens
    response = requests.post(
        f'http://{API}/sign_out_all', headers={"authorization": token})
    assert response.status_code == 204

    # verify both tokens dont work
    response = requests.get(
        f'http://{API}/verify_login', headers={"authorization": token}
    )
    assert response.status_code == 403

    response = requests.get(
        f'http://{API}/verify_login', headers={"authorization": token2}
    )
    assert response.status_code == 403


def test_change_password():
    # create user
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']
    response = requests.get(
        f'http://{API}/verify_login',
        headers={"authorization": token}
    )
    assert response.status_code == 200

    response = requests.post(
        f'http://{API}/change_password',
        headers={"authorization": token},
        json={
            "old_password": "password",
            "new_password": "password2"
        }
    )
    assert response.status_code == 200

    new_token = json.loads(response.content)['token']
    response = requests.get(
        f'http://{API}/verify_login',
        headers={"authorization": token}
    )
    assert response.status_code == 403

    response = requests.get(
        f'http://{API}/verify_login',
        headers={"authorization": new_token}
    )
    assert response.status_code == 200


def change_username():
    # create user
    login = f'user_{random_string(5)}'
    response = create_user(login, 'password', 'fname', 'lname')
    token = json.loads(response.content)['token']

    response = requests.post(
        f'http://{API}/change_user_info',
        headers={"authorization": token},
        json={
            "first_name": "fname2",
            "last_name": "lname2"
        }
    )
    assert response.status_code == 200
    body = json.loads(response.content)
    assert body.get('user', None) != None
    assert body['user']['firstName'] == 'fname2'
    assert body['user']['lname'] == 'lname2'
