import styled from "styled-components";
import Header from "./common/header/header";
import Router from "./routes";

const Main = styled.div`
  position: absolute;
  height 100%;
  width 100%;
  margin: 0px;
  padding: 0px;
`;

function App() {
  return (
    <Main>
      <Header />
      <Router />
    </Main>
  );
}

export default App;
