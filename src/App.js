import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./components/Login/Login";
const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;