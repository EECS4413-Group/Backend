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
def test_bidding_on_listing():
    return
