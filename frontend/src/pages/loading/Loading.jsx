import React from "react";
import styles from "./Loading.module.css";
import { ThreeDots } from "react-loader-spinner";

export default function Loading() {
  return (
    <>
      <div className={styles.mainContainer}>
        <ThreeDots type="Puff" color="#111111" height={100} width={100} />
        <div className={styles.loadingText}>Loading</div>
      </div>
    </>
  );
}
