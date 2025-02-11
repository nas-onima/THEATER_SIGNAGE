import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import {
  auth,
  loginWithEmailAndPassword,
  signInWithGoogle,
} from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoLogoGoogle } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const nav = useNavigate();
  // const { user, isFetching, error, dispatch } = useContext(AuthContext);

  useEffect(() => {
    if (loading) return;
    if (user) nav("/home");
  }, [user, loading]);

  const validateEmail = (email) => {
    // 簡易的なメールアドレスの正規表現
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrorMessage("無効なメールアドレスです。");
      return;
    }
    loginWithEmailAndPassword(email, password);
  };

  return (
    <>
      <div className={styles.login}>
        <div className={styles.loginWrapper}>
          <div className={styles.loginForm}>
            <form className={styles.loginForm} onSubmit={handleLogin}>
              <h3>ログイン</h3>
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
                  ログイン
                </button>
              </div>
            </form>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            <div className={styles.signup}>
              <button
                className={styles.signupButton}
                onClick={signInWithGoogle}
              >
                Googleでサインイン
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
