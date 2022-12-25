import { React } from 'react';
import styled from 'styled-components';

const Main = styled.div`
    display: flex;
    flex-direction: row;
    height: 75px;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin: 0px;
    padding: 0px;
    border: solid;

`;

function Header() {
    return (<Main>
        <h1>foo</h1>
    </Main>);
}
  
  
export default Header;
  