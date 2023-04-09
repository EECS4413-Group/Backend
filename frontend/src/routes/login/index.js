import { React, useState, useEffect } from "react";
import api_wrapper from "../../api/api_wrapper";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  let navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("authorization")) {
      navigate("/");
    }
  }, []);

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    api_wrapper
      .post("/sign_in", { login: uname.value, password: pass.value })
      .then((res) => {
        if (res.status != 200) {
          setErrorMessage("invalid username or password");
        } else {
          localStorage.setItem("authorization", res.data.token);
          navigate("/");
          window.location.reload();
        }
      })
      .catch((err) => {});
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
