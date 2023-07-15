import styled from "styled-components";

const MainWrapper = styled.div`
    display: flex;
`;

const LeftImg = styled.div`
    font-size: 30px;
    padding: 25px 30px;
`;

const LeftItem = styled.div`
    margin-top: 15px;

    li{
        list-style-type: none;
        font-size: 16px;
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 500;
        padding: 0 15px;
    }

`;

const LeftContent = styled.div`
    width: 15%;
    height: calc(100vh - 20px);
`;

const RightContent = styled.div`
    width: 85%;
`;

export {
    MainWrapper,
    LeftImg,
    LeftItem,
    LeftContent,
    RightContent
};
