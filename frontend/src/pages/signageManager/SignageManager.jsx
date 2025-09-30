import React from "react";
import Topbar from "../../components/topbar/Topbar";
import styles from "./SignageManager.module.css";
import MovieRegistrationForm from "../../components/movieRegistrationForm/MovieRegistrationForm";
import SignageListItem from "../../components/signageListItem/SignageListItem";
import useSWR from "swr";

function SignageManager() {
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

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    `http://localhost:5000/api/signages`,
    fetchSignages
  );

  return (
    <>
      <Topbar />
      <div className={styles.signageManagerWrapper}>
        <h1 className={styles.pageTitle}>サイネージ管理</h1>
        <div className={styles.signageList}>
          {data?.signages.map((signage) => (
            <SignageListItem signage={signage} key={signage.theaterId} />
          ))}
        </div>
      </div>
    </>
  );
}

export default SignageManager;
