import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import api_wrapper from "../../api/api_wrapper";
import styled from "styled-components";

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

const CreateListing = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [type, setType] = useState("normal");
  let navigate = useNavigate();

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { name, description, type, target_price, end_date } = document.forms[0];

    const data = {
      name: name.value,
      type: type.value,
      description: description.value,
      price: target_price?.value || 0,
      start_date: new Date().toISOString(),
      end_date: end_date?.value || new Date().toISOString(),
    };

    console.log(data);

    api_wrapper
      .post("/catalog/listing", data)
      .then((res) => {
        console.log(res);
        if (res.status != 201) {
          setErrorMessage("username already exists");
        } else {
          navigate("/");
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
            <label>Name </label>
            <input type="text" name="name" required />
          </div>
          <div className="input-container">
            <label>Description </label>
            <textarea name="description" required />
          </div>
          <label>Type </label>
          <div className="input-container">
            <label>normal </label>
            <input
              type="radio"
              name="type"
              value="normal"
              checked
              onClick={() => {
                setType("normal");
              }}
            />
            <label>dutch </label>
            <input
              type="radio"
              name="type"
              value="dutch"
              onClick={() => {
                setType("dutch");
              }}
            />
          </div>
          {type == "normal" ? (
            <div className="input-container">
              <label>End Time</label>
              <input type="text" name="end_date" />
              <label>{new Date().toISOString()}</label>
            </div>
          ) : (
            <div className="input-container">
              <label>Price </label>
              <input type="number" name="price" />
            </div>
          )}
          <div className="button-container">
            <input type="submit" />
          </div>
          {renderErrorMessage()}
        </form>
      </div>
    </Main>
  );
};

export default CreateListing;
