import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import MainDrawer from "./components/MainDrawer/MainDrawer";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<Login />} />
                <Route path="/dashboard" exact element={<MainDrawer />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;