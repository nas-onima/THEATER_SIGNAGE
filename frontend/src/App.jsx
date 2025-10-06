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
import SignageManager from "./pages/signageManager/SignageManager";
import Signage from "./pages/signage/Signage";
import MovieList from "./pages/movieList/movieList";

function App() {
  const { userData, isLoading, isError, mutate } = useUserData();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={userData ? <Home /> : isLoading ? <Loading /> : <Login />}
        />
        <Route
          path="/home"
          element={userData ? <Home /> : isLoading ? <Loading /> : <Login />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/manage/movie" element={<MovieList />} />
        <Route path="/manage/signages" element={<SignageManager />} />
        <Route path="/signage/:id" element={<Signage/>} />
      </Routes>
    </Router>
  );
}

export default App;
