import styled from "styled-components";
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import api_wrapper from "../../api/api_wrapper";

const Main = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-grow: 1;
  border-bottom: solid;
  flex: 1 1 auto;
`;

const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState("");
  let navigate = useNavigate();

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var {
      uname,
      pass,
      fname,
      lname,
      sname,
      snumber,
      aptnumber,
      province,
      pcode,
    } = document.forms[0];

    const data = {
      login: uname.value,
      password: pass.value,
      firstName: fname.value,
      lastName: lname.value,
      address: {
        street_number: snumber.value,
        street_name: sname.value,
        apt_number: aptnumber.value || null,
        postal_code: pcode.value,
        province: province.value,
      },
    };

    api_wrapper
      .post("/sign_up", data)
      .then((res) => {
        if (res.status != 201) {
          setErrorMessage("username already exists");
        } else {
          localStorage.setItem("authorization", res.data.token);
          navigate("/");
          window.location.reload();
        }
      })
      .catch((err) => {});
  };

  const renderErrorMessage = () => {
    if (errorMessage) {
      return <div className="error">{errorMessage}</div>;
    }
    return <div></div>;
  };
  return (
    <Main>
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
          <div className="input-container">
            <label>First Name </label>
            <input type="text" name="fname" required />
          </div>
          <div className="input-container">
            <label>Last Name </label>
            <input type="text" name="lname" required />
          </div>
          <div className="input-container">
            <label>Street Number </label>
            <input type="number" name="snumber" required />
          </div>
          <div className="input-container">
            <label>Street Name</label>
            <input type="text" name="sname" required />
          </div>
          <div className="input-container">
            <label>Apt Number </label>
            <input type="number" name="aptnumber" />
          </div>
          <div className="input-container">
            <label>Province </label>
            <select name="province">
              <option value="BC">British Columbia</option>
              <option value="AB">Alberta</option>
              <option value="SK">Saskatchewan</option>
              <option value="MB">Manitoba</option>
              <option value="ON">Ontario</option>
              <option value="NB">New Brunswick</option>
              <option value="NS">Nova Scotia</option>
              <option value="PE">Prince Edward Island</option>
              <option value="NL">Newfoundland and Labrador</option>
              <option value="NT">North West Territories</option>
              <option value="NU">Nunavut</option>
              <option value="YT">Yukon</option>
            </select>
          </div>
          <div className="input-container">
            <label>Postal Code </label>
            <input type="text" name="pcode" />
          </div>
          <div className="button-container">
            <input type="submit" />
          </div>
          {renderErrorMessage()}
        </form>
      </div>
    </Main>
  );
};

export default SignUp;
