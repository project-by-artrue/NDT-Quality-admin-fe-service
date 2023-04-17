import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import { ToastContainer } from "react-toastify";
import MainDrawer from "./components/MainDrawer/MainDrawer";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
 import 'react-toastify/dist/ReactToastify.css';

const client = new ApolloClient({
  cache:new  InMemoryCache(),
  uri: "http://localhost:3000/graphql",
});
const App = () => {
  return (
    <>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/dashboard" exact element={<MainDrawer />} />
        </Routes>
      </BrowserRouter>
     </ApolloProvider>
      <ToastContainer position="top-right"/>
    </>
  );
};

export default App;
