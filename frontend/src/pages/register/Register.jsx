import React, { useEffect, useState } from "react";
import styles from "./Register.module.css";
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../../firebase";

import { IoLogoGoogle } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useUserData } from "../../hooks/useUserData";
import Loading from "../loading/Loading";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  //const [user, loading, error] = useAuthState(auth);
  const nav = useNavigate();
  // const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const { userData, isLoading, isError, mutate } = useUserData();

  useEffect(() => {
    if (isLoading) return;
    if (userData) nav("/home");
  }, [userData, isLoading]);

  const validateEmail = (email) => {
    // 簡易的なメールアドレスの正規表現
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrorMessage("無効なメールアドレスです。");
      return;
    }
    if (name !== "") {
      registerWithEmailAndPassword(name, email, password);
    } else {
      alert("名前を入力してください");
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.login}>
          <div className={styles.loginWrapper}>
            <form className={styles.loginForm} onSubmit={handleRegister}>
              <h3>新規登録</h3>
              <div className={styles.inputItem}>
                <label htmlFor="email">ユーザ名:</label>
                <input
                  type="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputItem}>
                <label htmlFor="email">メールアドレス:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputItem}>
                <label htmlFor="password">パスワード:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <button type="submit" className={styles.loginButton}>
                  登録
                </button>
              </div>
              {errorMessage && <p className={styles.error}>{errorMessage}</p>}
              <div className={styles.signup}>
                <button
                  className={styles.signupButton}
                  onClick={signInWithGoogle}
                >
                  Googleでサインアップ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
