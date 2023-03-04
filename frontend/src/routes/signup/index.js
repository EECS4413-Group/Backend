import React from "react";
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

const AboutWrapper = styled.div`
  display: flex;
  flex-direction column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  border-right: solid;
`;

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 50%;
  height: 100%;
`;

const SignUp = () => {
  return (
    <Main>
      <AboutWrapper>foo</AboutWrapper>
      <LoginWrapper>bar</LoginWrapper>
    </Main>
  );
};

export default SignUp;
