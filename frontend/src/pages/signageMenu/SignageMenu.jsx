import React from "react";
import styles from "./SignageMenu.module.css";
import Topbar from "../../components/topbar/Topbar";
import { useUserData } from "../../hooks/useUserData";
import useSWR from "swr";
import Loading from "../loading/Loading";
import { Link } from "react-router-dom";
import { createApiUrl } from "../../config/api";

export default function SignageMenu() {
  const {
    userData,
    isLoading: userLoading,
    isError: userError,
  } = useUserData();

  const fetchSignages = async (url) => {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new Error(`API ERROR: ${res.statusText}`);
    }
    return res.json();
  };

  const {
    data: signageData,
    error: signageError,
    isLoading: signageLoading,
  } = useSWR(createApiUrl("/api/signages"), fetchSignages);

  const signages = signageData?.signages || [];

  if (userLoading || signageLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <Loading />
      </div>
    );
  }

  if (signageError || !signageData) {
    return (
      <>
        <Topbar />
        <div className={styles.errorWrapper}>
          <div className={styles.errorMessage}>
            <h1>エラー</h1>
            <p>サイネージ情報の取得に失敗しました</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>サイネージ選択</h1>
          <p>表示するサイネージを選択してください</p>
        </div>

        <div className={styles.signageList}>
          {signages.map((signage) => (
            <Link
              key={signage._id}
              to={`/signage/${signage._id}`}
              className={styles.signageItem}
            >
              <div className={styles.theaterNumber}>
                シアター {signage.theaterId}
              </div>
              <span className={styles.arrow}>→</span>
            </Link>
          ))}
        </div>

        {signages.length === 0 && (
          <div className={styles.emptyState}>
            <h3>サイネージが登録されていません</h3>
            <p>サイネージ管理画面でサイネージを登録してください</p>
            <Link to="/manage/signages" className={styles.manageLink}>
              サイネージ管理へ
            </Link>
          </div>
        )}

        <div className={styles.backButton}>
          <Link to="/home" className={styles.backLink}>
            ← メニューに戻る
          </Link>
        </div>
      </div>
    </>
  );
}
