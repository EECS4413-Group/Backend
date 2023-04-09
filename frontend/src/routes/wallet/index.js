import styled from "styled-components";
import { React, useState, useEffect } from "react";
import api_wrapper from "../../api/api_wrapper";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";

const Main = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wallet = () => {
  const [account, setAccount] = useState({});
  useEffect(() => {
    api_wrapper.get("/wallet/account").then((res) => {
      if (res.status != 200) {
      } else {
        setAccount(res.data);
      }
    });
  }, []);

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

  if (account == {}) {
    return <></>;
  }

  const redeemTokens = () => {
    api_wrapper.get("/wallet/redeem").then((res) => {
      if (res.status != 200) {
      } else {
        setAccount({
          balance: res.data.balance,
          last_redeem_time: res.data.last_redeem_time,
        });
      }
    });
  };

  const next_redeem_time =
    new Date(account?.last_redeem_time || Date.now()).getTime() +
    4 * 60 * 60 * 1000;
  return (
    <Main>
      <>
        Current Balance: {account.balance}
        <br />
      </>
      {next_redeem_time < Date.now() ? (
        <>
          <button onClick={redeemTokens}>Redeem Tokens</button>
        </>
      ) : (
        <>
          <>Time Until Next redeem:</>
          <Countdown date={next_redeem_time} />
        </>
      )}
    </Main>
  );
};

export default Wallet;
