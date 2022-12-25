import { createReducer, createActions } from 'reduxsauce';
import authenticationTypes from 'lib/redux/types/authentication';

const {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
} = authTypes;

const { Types, Creators } = createActions({
  loginRequest: ['username', 'password'],
  loginSuccess: null,
  loginError: null,
  logout: null,
  signupRequest: ['name', 'username', 'password'],
  signupSuccess: null,
  signupError: null,
});

export default Creators;

export const INITIAL_STATE = {
  accessToken: null,
  accessClient: null,
  accessUID: null,
  fetching: false,
  error: null,
};

const request = (state) => ({
  ...state,
  fetching: true,
});

const success = (
  state,
  { data: { accessToken, accessClient, accessUID } },
) => ({
  ...state,
  fetching: false,
  error: null,
  accessToken,
  accessClient,
  accessUID,
});

const failure = (state, { error }) => ({
  ...state,
  fetching: false,
  error,
});


const logout = () => INITIAL_STATE;

export const reducer = createReducer(INITIAL_STATE, {
  [LOGIN_REQUEST]: request,
  [LOGIN_SUCCESS]: success,
  [LOGIN_ERROR]: failure,
  [LOGOUT]: logout,
  [SIGNUP_REQUEST]: request,
  [SIGNUP_SUCCESS]: success,
  [SIGNUP_ERROR]: failure,
});