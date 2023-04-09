import { React, useEffect, useState } from "react";
import styled from "styled-components";
import api_wrapper from "../../api/api_wrapper";
import { useNavigate } from "react-router-dom";

const Results = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderButton = styled.div`
  display: flex;
  flex-direction: row;
  width: 200px;
  justify-content: space-between;
`;

const ViewOrders = () => {
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

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api_wrapper
      .get(`/shipping/orders?status_filter=unconfirmed`)
      .then((res) => {
        setOrders(res.data.orders);
      });
  }, []);

  const QueryOrders = (type) => {
    api_wrapper.get(`/shipping/orders?status_filter=${type}`).then((res) => {
      setOrders(res.data.orders);
    });
  };

  const RenderOrders = () => {
    return orders.map((order) => {
      return (
        <button
          key={order.id}
          onClick={() => {
            navigate(`/orders/${order.id}`);
          }}
        >
          <OrderButton>
            <>{order.listing.name}</>
            <>{order.bid.amount}</>
          </OrderButton>
        </button>
      );
    });
  };
  return (
    <div>
      <button
        onClick={() => {
          QueryOrders("unconfirmed");
        }}
      >
        Show unconfirmed
      </button>
      <button
        onClick={() => {
          QueryOrders("confirmed-");
        }}
      >
        Show outgoing
      </button>
      <Results>{RenderOrders()}</Results>
    </div>
  );
};

export default ViewOrders;
