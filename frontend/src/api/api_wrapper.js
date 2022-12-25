import axios from 'axios';
import {store} from '../index';

const makeRequest = (method, url, body, headers) => {
  const auth_tokens = store.getState().auth;
  if (auth_tokens) {
        headers['access-token'] = auth_tokens.accessToken
        headers.client = auth_tokens.accessClient
        headers.uid = auth_tokens.accessUID
  }
  return axios({
    method,
    url: `${process.env.API_HOST}${url}`,
    data: body,
    headers: headers,
  });
};
// similar method signatures
// do not refactor
// might be neccessary to add intermediate steps
const get = (url, headers = {}) => {
    return makeRequest('GET', url, null, headers)
}
const post = (url, body = {}, headers = {}) => {
    return makeRequest('POST', url, body, headers)
}
    
const put = (url, body = {}, headers = {}) => {
    return makeRequest('PUT', url, body, headers)
}
    
const del = (url, body = {}, headers = {}) => {
    return makeRequest('DELETE', url, body, headers)
}

api_wrapper = {
    get: get,
    post: post,
    put: put,
    delete: del,
}
    

export default api_wrapper;