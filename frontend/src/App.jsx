import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import axios from "axios";
import Register from "./pages/register/Register";
import { useUserData } from "./hooks/useUserData";
import Loading from "./pages/loading/Loading";

function App() {
  const { userData, isLoading, isError, mutate } = useUserData();

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={userData ? <Home /> : isLoading ? <Loading /> : <Login />}
        />
        <Route
          exact
          path="/home"
          element={userData ? <Home /> : isLoading ? <Loading /> : <Login />}
        />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/schedule" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
