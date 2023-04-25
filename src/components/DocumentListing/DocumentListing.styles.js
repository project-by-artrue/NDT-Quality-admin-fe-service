import styled from "styled-components";

const DocumentContainer = styled.div`
   
`;

const HeaderWrapper = styled.div`
    font-size: 20px;
    color: rgba(1,49,113,1);
    justify-content: space-between;
    display: flex;
    align-items: center;
    .create-button {
        height: 40px;
        background: rgba(1, 49, 113, 1);
        :hover {
            background: rgba(1, 49, 113, 0.85);
        }
    }
`;
const DocumentSumary = styled.div`
display: flex;
height: 200px;
border: 1px solid #d1d1d1;
margin-top:8px;
margin-bottom:8px;

`;

export {
    DocumentContainer,
    HeaderWrapper,
    DocumentSumary,
};