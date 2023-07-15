import styled from "styled-components";

const CreateButton = styled.div`
    border-radius: 8px;
    margin: 24px 0;
    padding: 8px;
    justify-content: space-between;
    display: flex;
    align-items: center;
    background: rgba(248, 250, 251, 1);
    .MuiInputBase-root {
        border-radius: 8px;
    }
    input {
        height: 40px;
        box-sizing: border-box;
    }
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

const ModelHeader = styled.div`
    display: flex;
    justify-content: space-between;
`;
export {
    CreateButton,
    HeaderWrapper,
    ModelHeader,
};