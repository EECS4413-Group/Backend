import { call, put, all, takeEvery } from 'redux-saga/effects';

import api from 'lib/api';
import profileTypes from 'lib/redux/types/profile';
import authTypes from 'lib/redux/types/auth';
import notificationTypes from 'lib/redux/types/notification';
import errorHandler from 'utils/errorHandler';
import modalsTypes from 'lib/redux/types/modals';

const { TOGGLE_CHANGE_PASSWORD_MODAL } = modalsTypes;

const {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_ERROR,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
} = profileTypes;

const { LOGOUT } =
  authTypes;

const { SHOW_ERROR } = notificationTypes;

export function* getProfile() {
  let response = null;

  try {
    response = yield call(api.get, '/api/user_profiles/me');
  } catch (error) {
    yield put({
      type: SHOW_ERROR,
      error: errorHandler(error, "Can't receive user profile"),
    });
    return yield put({
      type: GET_PROFILE_ERROR,
      error: errorHandler(error, "Can't receive user profile"),
    });
  }

  if (response.status === 200) {
    return yield put({
      type: GET_PROFILE_SUCCESS,
      data: response.data,
    });
  }

  if (response.status === 401) {
    return yield put({ type: LOGOUT });
  }

  yield put({ type: SHOW_ERROR, error: "Can't receive user profile" });
  return yield put({
    type: GET_PROFILE_ERROR,
    error: "Can't receive user profile",
  });
}




function* updateProfile(action) {
  let response = null;

  try {
    response = yield call(api.put, `/api/user_profiles/${action.user_id}`, {
      body: action.data,
    });
  } catch (error) {
    return yield put({
      type: SHOW_ERROR,
      error: errorHandler(error, "Can't update user profile"),
    });
  }

  if (response.status === 200) {
    yield call(getUserProfile);
    return yield put({
      type: UPDATE_PROFILE_DATA_SUCCESS,
      ...response.data,
    });
  }

  yield put({ type: SHOW_ERROR, error: "Can't update user profile" });
  return yield put({
    type: UPDATE_PROFILE_DATA_ERROR,
    error: "Can't update user profile",
  });
}


export default function* watch() {
  yield all([
    takeEvery(GET_PROFILE_REQUEST, getProfile),
    takeEvery(UPDATE_PROFILE_REQUEST, updateProfile),
  ]);
}