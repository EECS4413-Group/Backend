import { useState } from "react";
import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Main = styled.div`
  display: flex;
  flex-direction: row;
  height: 75px;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 0px;
  padding: 0px;
  border-bottom: solid;
  box-sizing: border-box;
`;

function Header() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("authorization") != null
  );

  let navigate = useNavigate();
  return (
    <div>
      {loggedIn ? (
        <Main>
          <button
            onClick={() => {
              localStorage.removeItem("authorization");
              setLoggedIn(false);
              navigate("/");
              window.location.reload();
            }}
          >
            logout
          </button>
        </Main>
      ) : (
        <Main>
          <div>
            <button
              onClick={() => {
                navigate("/login");
              }}
            >
              login
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                navigate("/sign_up");
              }}
            >
              create account
            </button>
          </div>
        </Main>
      )}
    </div>
  );
}

export default Header;
