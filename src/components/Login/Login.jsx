import React from "react";
import {
    LoginWrapper, DetailsContainer, ImageContainer, ImageWrapper
} from "./Login.styles";
import LoginBackground from '../../assets/images/LoginBackground.jpg';

export default function Login() {
    return (
        <LoginWrapper>
            <DetailsContainer>Login</DetailsContainer>
            <ImageWrapper><ImageContainer
                src={LoginBackground}
            ></ImageContainer></ImageWrapper>
        </LoginWrapper>
    )
}