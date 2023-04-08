import styled from "styled-components";
import Header from "./common/header/header";
import PageSelector from "./common/page_selector/page_selector";
import Router from "./routes";

const Main = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  height 100%;
  width 100%;
  margin: 0px;
  padding: 0px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: start;
  width: 100%;
  height: 100%;
`;

function App() {
  return (
    <Main>
      <Header />
      <Content>
        <PageSelector></PageSelector>
        <Router />
      </Content>
    </Main>
  );
}

export default App;
