import axios from "axios";

const makeRequest = (method, url, body, headers = {}) => {
  const bearer_token = window.localStorage.getItem("authorization");
  if (bearer_token) {
    headers["authorization"] = bearer_token;
  }
  headers["Content-Type"] = "application/json";
  return new Promise((resolve, reject) => {
    axios({
      method,
      url: `http://localhost:8080${url}`,
      data: body,
      headers: headers,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
// similar method signatures
// do not refactor
// might be neccessary to add intermediate steps
const get = (url, headers = {}) => {
  return makeRequest("GET", url, null, headers);
};
const post = (url, body = {}, headers = {}) => {
  return makeRequest("POST", url, body, headers);
};

const put = (url, body = {}, headers = {}) => {
  return makeRequest("PUT", url, body, headers);
};

const del = (url, body = {}, headers = {}) => {
  return makeRequest("DELETE", url, body, headers);
};

const api_wrapper = {
  get: get,
  post: post,
  put: put,
  delete: del,
};

export default api_wrapper;
