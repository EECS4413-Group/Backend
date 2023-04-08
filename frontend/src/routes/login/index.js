import { React, useState } from "react";
import api_wrapper from "../../api/api_wrapper";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const errors = {
    uname: "invalid username",
    pass: "invalid password",
  };

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    api_wrapper
      .post("/login", { login: uname.value, password: pass.value })
      .then((res) => {
        console.log(res);
        if (res.status != 200) {
          setErrorMessage("invalid username or password");
        } else {
          localStorage.setItem("authorization", res.data.token);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Generate JSX code for error message
  const renderErrorMessage = () => {
    if (errorMessage) {
      return <div className="error">{errorMessage}</div>;
    }
    return <div></div>;
  };

  // JSX code for login form
  const RenderForm = () => {
    return (
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Username </label>
            <input type="text" name="uname" required />
          </div>
          <div className="input-container">
            <label>Password </label>
            <input type="password" name="pass" required />
          </div>
          <div className="button-container">
            <input type="submit" />
          </div>
          {renderErrorMessage()}
        </form>
      </div>
    );
  };

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Sign In</div>
        <RenderForm />
      </div>
    </div>
  );
};

export default Login;
