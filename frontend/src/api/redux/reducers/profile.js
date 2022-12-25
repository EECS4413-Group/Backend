/* eslint-disable no-nested-ternary */
import { createReducer, createActions } from 'reduxsauce';

import profileTypes from 'lib/redux/types/profile';


const {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_ERROR,
  CLEANUP_PROFILE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
} = profileTypes;

const { Types, Creators } = createActions({
  getProfileRequest: null,
  getProfileSuccess: null,
  getProfileError: null,
  cleanupProfile: null,
  signupSuccess: null,
  updateProfileRequest: ['data'],
  updateProfileSuccess: null,
  updateProfileError: null,
});

export default Creators;

export const INITIAL_STATE = {
  user_profile: {},
};

const request = (state) => ({
  ...state,
  fetching: true,
});

const success = (state, { data }) => ({
  ...state,
  fetching: false,
  error: null,
});

const getProfileSuccess = (state, { data }) => ({
  ...state,
  fetching: false,
  error: null,
  user_profile: data,
});


const updateProfileSuccess = (state, { data }) => ({
    ...state,
    fetching: false,
    error: null,
    user_profile: data,
  });

const cleanup = () => INITIAL_STATE;

export const reducer = createReducer(INITIAL_STATE, {
  [GET_PROFILE_REQUEST]: request,
  [GET_PROFILE_SUCCESS]: getProfileSuccess,
  [GET_PROFILE_ERROR]: failure,
  [CLEANUP_PROFILE]: cleanup,
  [UPDATE_PROFILE_REQUEST]: request,
  [UPDATE_PROFILE_SUCCESS]: updateProfileSuccess,
  [UPDATE_PROFILE_ERROR]: failure,
});