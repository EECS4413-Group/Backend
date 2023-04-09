import { React, useState, useEffect } from "react";
import api_wrapper from "../../api/api_wrapper";
import styled from "styled-components";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";

const Main = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddressCheckBox = styled.div`
  display: flex;
  flex-direction: row;
`;

const ViewOrder = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.localStorage.getItem("authorization") == null) {
      navigate("/");
    }

    api_wrapper
      .get("/verify_login")
      .then((res) => {
        if (res.status != 200) {
          navigate("/");
        }
      })
      .catch(() => {
        window.localStorage.removeItem("authorization");
        navigate("/");
      });
  }, []);

  const [order, setOrder] = useState({});

  useEffect(() => {
    let id = window.location.href.split("/").at(-1);
    api_wrapper.get(`/shipping/order/${id}`).then((res) => {
      setOrder(res.data);
    });
  }, []);

  const RenderConfirmedOrder = () => {
    return (
      <>
        <Main>
          <>
            {order.address.street_number} {order.address.street_name}{" "}
            {order.address.apt_number ? (
              <>apt number: {order.address.apt_number}</>
            ) : (
              <></>
            )}
            , {order.address.province}, {order.address.postal_code}
          </>
          <br />
          <>Order status: {order.status}</>
        </Main>
      </>
    );
  };

  const [defaultAddress, setDefaultAddress] = useState(true);
  const RenderUnconfirmedOrder = () => {
    const handleSubmit = (event) => {
      //Prevent page reload
      event.preventDefault();

      var { sname, snumber, aptnumber, province, pcode } = document.forms[0];
      const data = {
        shipping_type: event.nativeEvent.submitter.name,
        address: defaultAddress
          ? null
          : {
              street_number: snumber.value,
              street_name: sname.value,
              apt_number: aptnumber.value || null,
              postal_code: pcode.value,
              province: province.value,
            },
      };

      let id = window.location.href.split("/").at(-1);
      api_wrapper
        .post(`/shipping/order/${id}`, data)
        .then((res) => {
          if (res.status != 204) {
          } else {
            navigate("/orders");
            window.location.reload();
          }
        })
        .catch((err) => {});
    };

    return (
      <>
        <AddressCheckBox>
          Use Default Address
          <input
            type="checkbox"
            defaultChecked
            onClick={(event) => {
              setDefaultAddress(event.target.checked);
            }}
          />
        </AddressCheckBox>
        <form onSubmit={handleSubmit}>
          {defaultAddress ? (
            <Main>
              <>
                {order.address.street_number} {order.address.street_name}{" "}
                {order.address.apt_number ? (
                  <>apt number: {order.address.apt_number}</>
                ) : (
                  <></>
                )}
                , {order.address.province}, {order.address.postal_code}
              </>
            </Main>
          ) : (
            <>
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
            </>
          )}
          <input type="submit" name="standard" value="Confirmed Standard" />
          <input type="submit" name="expedited" value="Confirmed Expedited" />
        </form>
      </>
    );
  };

  return (
    <Main>
      <>Auction Name: {order?.listing?.name}</>
      <br />
      <>Order Cost: {order?.bid?.amount}</>
      {order.status == "unconfirmed" && RenderUnconfirmedOrder()}
      {order.status &&
        order.status.includes("confirmed-") &&
        RenderConfirmedOrder()}
    </Main>
  );
};

export default ViewOrder;
