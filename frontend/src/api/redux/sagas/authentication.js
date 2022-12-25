import { call, put, all, takeEvery } from 'redux-saga/effects';

import api from 'lib/api';
import authenticationTypes from '../types/authentication';

import { getProfile } from './profile';

const {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
} = authenticationTypes;

function* login(action) {
  let response = null;
  try {
    response = yield call(api.post, '/auth/sign_in', {
      body: {
        username: action.username,
        password: action.password,
      },
      headers: { 'Access-Control-Expose-Headers': 'access-token, client, uid' },
    });
  } catch (error) {
    yield put({
      type: SHOW_ERROR,
      error: errorHandler(error, 'Please, try again later'),
    });
    return yield put({
      type: LOGIN_ERROR,
      error: errorHandler(error, 'Please, try again later'),
    });
  }

  if (response.status === 200) {
    return yield put({
      type: LOGIN_SUCCESS,
      data: {
        accessToken: response.headers['access-token'],
        accessClient: response.headers.client,
        accessUID: response.headers.uid,
      },
    });
  }

  yield put({ type: SHOW_ERROR, error: 'Please, try again later' });
  return yield put({ type: LOGIN_ERROR, error: 'Please, try again later' });
}

function* signup(action) {
  let response = null;
  const { name, username, password } = action;

  try {
    response = yield call(api.post, '/auth', {
      body: {
        username: username,
        password: password,
        name: name,
      },
    });
  } catch (error) {
    yield put({
      type: SHOW_ERROR,
      error: errorHandler(error, 'Please, try again later'),
    });
    return yield put({
      type: SIGNUP_ERROR,
      error: errorHandler(error, 'Please, try again later'),
    });
  }

  if (response.status === 200) {
    return yield put({
      type: SIGNUP_SUCCESS,
      data: {
        accessToken: response.headers['access-token'],
        accessClient: response.headers.client,
        accessUID: response.headers.uid,
      },
    });
  }

  yield put({ type: SHOW_ERROR, error: 'Please, try again later' });
  return yield put({ type: SIGNUP_ERROR, error: 'Please, try again later' });
}

function* logout() {
  //full cleanup
  return yield put({ type: CLEANUP_PROFILE });
}

function* getUserInfo() {
  return yield call(getProfile);
}

export default function* watch() {
  yield all([
    takeEvery(LOGIN_SUCCESS, getUserInfo),
    takeEvery(LOGIN_REQUEST, login),
    takeEvery(LOGOUT, logout),
    takeEvery(SIGNUP_REQUEST, signup),
  ]);
}