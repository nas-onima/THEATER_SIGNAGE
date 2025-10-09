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
import SignageMenu from "./pages/signageMenu/SignageMenu";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

// 認証が必要なページ用のラッパーコンポーネント
function ProtectedRoute({ children }) {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <Loading />;
  if (!user) return <Login />;

  return children;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signage" element={<SignageMenu />} />
      <Route path="/signage/:id" element={<Signage />} />
      <Route path="/manage/signage" element={<SignageManager />} />
      <Route
        path="/manage/movie"
        element={
          <ProtectedRoute>
            <MovieList />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
