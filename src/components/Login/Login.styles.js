import styled from "styled-components";

const LoginWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const DetailsContainer = styled.div`
    width: 50%;
    height: calc(100vh - 20px);
    display: flex;
    justify-content: center;
    align-items: center;

    @media screen and (min-width: 0px) and (max-width: 820px) {
        width: 100%;   /* show it on small screens */
}
`;

const DetailsWrapper = styled.div`
    dispaly: flex;
    align-items: center;
    text-align: center;
    padding: 25px 40px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;

const DetailsHead = styled.div`
    text-align: center;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 35px;
    line-height: 59px;
`;

const ImageWrapper = styled.div`
    width: 50%;
    height: 100%;
    
    @media screen and (min-width: 0px) and (max-width: 821px) {
        display: none;   /* show it on small screens */
}

    @media screen and (min-width: 821px) and (max-width: 1024px) {
      display: block;    /* hide it elsewhere */
}
`;

const ImageContainer = styled.img`
    width: 100%;
    height: calc(100vh - 20px);
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',

    
    
`;

export {
    LoginWrapper,
    DetailsContainer,
    DetailsWrapper,
    DetailsHead,
    ImageWrapper,
    ImageContainer,
};