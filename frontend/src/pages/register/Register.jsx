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
import Loading from "../loading/Loading";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const nav = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) {
      setIsRegistering(true);
      // 登録成功時は少し遅延してからナビゲート
      setTimeout(() => {
        setIsRegistering(false);
        nav("/home");
      }, 200);
    }
  }, [user, loading, nav]);

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
      setIsRegistering(true);
      setErrorMessage(""); // エラーメッセージをクリア

      try {
        await registerWithEmailAndPassword(name, email, password);
        // 登録成功後はuseEffectでナビゲーションされる
      } catch (error) {
        setIsRegistering(false);
        setErrorMessage("登録に失敗しました。");
        console.error("Registration error:", error);
      }
    } else {
      setErrorMessage("名前を入力してください");
    }
  };

  // 登録処理中またはFirebase初期化中の場合、Loadingを表示
  if (loading || isRegistering) {
    return <Loading />;
  }

  return (
    <>
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
                disabled={isRegistering}
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
                disabled={isRegistering}
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
                disabled={isRegistering}
              />
            </div>
            <div>
              <button
                type="submit"
                className={styles.loginButton}
                disabled={isRegistering}
              >
                {isRegistering ? "登録中..." : "登録"}
              </button>
            </div>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            {/* <div className={styles.signup}>
              <button
                className={styles.signupButton}
                type="button"
                disabled={isRegistering}
                onClick={async () => {
                  setIsRegistering(true);
                  setErrorMessage("");

                  try {
                    await signInWithGoogle();
                    // Google認証成功後はuseEffectでナビゲーションされる
                  } catch (error) {
                    setIsRegistering(false);
                    setErrorMessage("Googleサインアップに失敗しました。");
                    console.error("Google sign up error:", error);
                  }
                }}
              >
                {isRegistering ? "サインアップ中..." : "Googleでサインアップ"}
              </button>
            </div> */}

            {/* ログインページへのリンク */}
            <div className={styles.registerLink}>
              <p>すでにアカウントをお持ちの場合</p>
              <Link to="/login" className={styles.registerButton}>
                ログイン画面へ
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
