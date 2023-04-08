import React from "react";
import styled from "styled-components";

import { useNavigate } from "react-router";

const NavBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  padding: 0px;
  margin: 0px;
`;

const Button = styled.button`
  background-color: #000000;
  color: white;
  border-radius: 0px;
  border-color: #FFFFFF;
  border-style: solid none none none;
  outline: 0;
  text-transform: uppercase;
  cursor: pointer;
  width: 15%;
  height 25%;
  margin: 0px;
  padding: 0px;
`;
const NavButton = ({ onClick, children }) => {
  return (
    <Button
      onClick={() => {
        onClick();
      }}
    >
      {children}
    </Button>
  );
};

const PageSelector = () => {
  const navigate = useNavigate();
  return (
    <NavBar>
      <NavButton
        key={"/home"}
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </NavButton>
      <NavButton
        key={"/listings"}
        onClick={() => {
          navigate("/listings");
        }}
      >
        Browse
      </NavButton>
      <NavButton
        key={"/Wallet"}
        onClick={() => {
          navigate("/Wallet");
        }}
      >
        Your Wallet
      </NavButton>
      <NavButton
        key={"/orders"}
        onClick={() => {
          navigate("/orders");
        }}
      >
        View Orders
      </NavButton>
    </NavBar>
  );
};

export default PageSelector;
