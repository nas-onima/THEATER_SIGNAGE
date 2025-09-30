import React from "react";
import styles from "./SignageListItem.module.css";
import useSWR from "swr";

export default function SignageListItem({ signage, onSignageClick }) {
  return (
    <div className={styles.signageListItem}>
      <div className={styles.topContainer}>
        <div className={styles.topLeft}>
          <div className={styles.theaterNumber}>{signage.theaterId}</div>
          <div className={styles.signageState}>
            {signage.isConnected ? "オンライン" : "オフライン"}
          </div>
        </div>
        {signage.movie && signage.movie.image ? (
          <img
            src={`data:image/png;base64,${signage.movie.image}`}
            alt={signage.movie.title + "のポスター画像"}
            className={styles.moviePosterImage}
          />
        ) : (
          <div
            className={styles.moviePosterImage}
            style={{
              height:"100%",
              aspectRatio: "2/3",
              backgroundColor: "grey",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            NO IMAGE
          </div>
        )}
        <div className={styles.showingTypeButtons}>
          <div className={styles.showingTypeButton}>字幕</div>
          <div className={styles.showingTypeButton}>吹替</div>
          <div className={styles.showingTypeButton}>日本語字幕</div>
          <div className={styles.showingTypeButton}>4K</div>
          <div className={styles.showingTypeButton}>応援上映</div>
          <div className={styles.showingTypeButton}>中継</div>
          <div className={styles.showingTypeButton}>舞台挨拶</div>
        </div>
      </div>
      <div className={styles.showingTitle}>
        {signage.movie ? signage.movie.title : "---"}
      </div>
    </div>
  );
}
