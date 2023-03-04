import { React } from "react";
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
  let navigate = useNavigate();
  return (
    <Main>
      <div>
        <button
          onClick={() => {
            navigate("/sign_up");
          }}
        >
          login
        </button>
      </div>
    </Main>
  );
}

export default Header;
