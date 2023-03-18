import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import {
    LoginWrapper, DetailsContainer, DetailsWrapper, ImageContainer, ImageWrapper
} from "./Login.styles";
import LoginBackground from '../../assets/images/LoginBackground.jpg';

export default function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const Email = "admin";
    const Password = "admin@123";

    const handleSubmit = () => {
        if (email == Email && password == Password) {

            const user = { email };
            const userString = JSON.stringify(user);
            localStorage.setItem("user", userString);
            navigate("/dashboard");
        }
    };

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <LoginWrapper >
            <DetailsContainer>
                <DetailsWrapper>
                    <Typography component="h1" variant="h4" marginBottom="30px">
                        Log in
                    </Typography>
                    <Typography component="h1" variant="h5" fontSize="15px" color="#A6A3A3">
                        Welcome back Please Enter your Details
                    </Typography>
                    <Box noValidate sx={{ mt: 1 }}>
                        <Typography variant="h6" align="left" fontSize="15px" color="#615D77">
                            Email / Username
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            size="small"
                            onChange={(e) => setEmail(e.target.value)}

                        />
                        <Typography variant="h6" align="left" fontSize="15px" color="#615D77">
                            Password
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            size="small"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
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
                            onClick={handleSubmit}
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

    );
}