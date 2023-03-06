import React from "react";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import {
    LoginWrapper, DetailsContainer, DetailsWrapper, DetailsHead, ImageContainer, ImageWrapper
} from "./Login.styles";
import LoginBackground from '../../assets/images/LoginBackground.jpg';

export default function Login() {

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    return (
        <LoginWrapper>
            <DetailsContainer>
                <DetailsWrapper>
                    <Typography component="h1" variant="h4" marginBottom="30px">
                        Log in
                    </Typography>
                    <Typography component="h1" variant="h5" fontSize="15px" color="#A6A3A3">
                        Welcome back Please Enter your Details
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Typography variant="h6" align="left" fontSize="15px" color="#615D77">
                            Email Address
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            size="small"
                        />
                        <Typography variant="h6" align="left" fontSize="15px" color="#615D77">
                            Password
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            size="small"
                        />
                        <Grid container>
                            <Grid item>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            style={{ borderRadius: "50px", color: "#ffffff", backgroundColor: "#34609B" }}
                        >
                            Log In
                        </Button>
                    </Box>
                </DetailsWrapper>
            </DetailsContainer>
            <ImageWrapper>
                <ImageContainer src={LoginBackground}>
                </ImageContainer></ImageWrapper>
        </LoginWrapper >
    )
}