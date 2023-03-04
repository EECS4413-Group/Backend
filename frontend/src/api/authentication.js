import api_wrapper from "./api_wrapper";

export const signin = async (username, password) => {
  const response = await api_wrapper.post("/sign_in", {
    username: username,
    password: password,
  });
  if (response.status == 400) {
  }

  if (response.status == 403) {
  }

  if (response.status == 200) {
    const token = response.body.token;
    window.localStorage.setItem("bearer-token", token);
  }
};

export const signout = async () => {
  const response = api_wrapper.post("/sign_out");
  if (response.status == 403) {
  }

  if (response.status == 201) {
    window.localStorage.removeItem("bearer-token");
  }
};

export const signup = async (username, password, firstName, lastName) => {
  const response = await api_wrapper.post("/sign_up", {
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
  });
  if (response.status == 400) {
  }

  if (response.status == 403) {
  }

  if (response.status == 200) {
    window.localStorage.setItem("bearer-token", response.body.token);
    window.localStorage.setItem("user", response.body.token);
  }
};

export const signout_all = async () => {
  const response = api_wrapper.post("/sign_out_all");
  if (response.status == 403) {
  }

  if (response.status == 201) {
    window.localStorage.removeItem("bearer-token");
  }
};

export const verify_login = async () => {
  const response = api_wrapper.post("/verify_login");
  if (response.status != 201) {
    window.localStorage.removeItem("bearer-token");
  }
};

export const update_user_info = async (params) => {
  const response = api_wrapper.post("/update_user_info", params);
  if (response.status == 403) {
  }
  if (response.status == 200) {
    window.localStorage.setItem("user", response.body);
  }
};

// exports.signin = signin;
// exports.signout = signout;
// exports.signup = signup;
// exports.signout_all = signout_all;
// exports.verify_login = verify_login;
// exports.update_user_info = update_user_info;
