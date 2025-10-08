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
import { useUserData } from "../../hooks/useUserData";
import Loading from "../loading/Loading";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false); // ログイン処理中の状態
  const [user, loading, error] = useAuthState(auth);
  const { mutate } = useUserData(); // SWRのmutate関数を取得
  const nav = useNavigate();
  // const { user, isFetching, error, dispatch } = useContext(AuthContext);

  useEffect(() => {
    if (loading) return;
    if (user) {
      setIsLoggingIn(true); // ログイン成功時もローディング表示
      // Firebase認証成功時にSWRキャッシュを更新
      mutate();
      // 少し遅延してからナビゲート（SWRの更新を待つ）
      setTimeout(() => {
        setIsLoggingIn(false);
        nav("/home");
      }, 500); // ローディング時間を少し延長
    }
  }, [user, loading, mutate, nav]);

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

    setIsLoggingIn(true); // ログイン処理開始
    setErrorMessage(""); // エラーメッセージをクリア

    try {
      await loginWithEmailAndPassword(email, password);
      // ログイン成功後、SWRキャッシュを強制更新
      mutate();
    } catch (error) {
      setIsLoggingIn(false); // エラー時はローディング停止
      setErrorMessage("ログインに失敗しました。");
      console.error("Login error:", error);
    }
  };

  // ログイン処理中またはFirebase初期化中の場合、Loadingを表示
  if (loading || isLoggingIn) {
    return <Loading />;
  }

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
                <button
                  type="submit"
                  className={styles.loginButton}
                  disabled={isLoggingIn} // ログイン中はボタンを無効化
                >
                  {isLoggingIn ? "ログイン中..." : "ログイン"}
                </button>
              </div>
            </form>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            <div className={styles.signup}>
              <button
                className={styles.signupButton}
                disabled={isLoggingIn} // ログイン中はボタンを無効化
                onClick={async () => {
                  setIsLoggingIn(true); // Google認証開始
                  setErrorMessage(""); // エラーメッセージをクリア

                  try {
                    await signInWithGoogle();
                    mutate(); // Google認証成功後もSWRキャッシュを更新
                  } catch (error) {
                    setIsLoggingIn(false); // エラー時はローディング停止
                    setErrorMessage("Googleサインインに失敗しました。");
                    console.error("Google sign in error:", error);
                  }
                }}
              >
                {isLoggingIn ? "サインイン中..." : "Googleでサインイン"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
