import React from "react";
import styles from "./SignageListItem.module.css";
import useSWR from "swr";

export default function SignageListItem({ signage, onSignageClick }) {
  let ratingStyle;
  if (signage.movie) {
    if (signage.movie.rating === "G") {
      ratingStyle = { borderLeft: "5px solid green" };
    } else if (signage.movie.rating === "PG12") {
      ratingStyle = { borderLeft: "5px solid blue" };
    } else if (signage.movie.rating === "R15+") {
      ratingStyle = { borderLeft: "5px solid magenta" };
    } else if (signage.movie.rating === "R18+") {
      ratingStyle = { borderLeft: "5px solid red" };
    } else {
      ratingStyle = { borderLeft: "5px solid gray", marginRight: "10px" };
    }
  }

  return (
    <div className={styles.signageListItem}>
      <div className={styles.pubDate}>
        シアター{signage.theaterId}
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
            height: "95%",
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
      <div className={styles.description}>
        <div className={styles.title}>
          {signage.movie && signage.movie.rating ? (
            <span className={styles.rating} style={ratingStyle}>
              【{signage.movie.rating}】
            </span>
          ) : (
            <span className={styles.rating} style={ratingStyle}>【-】</span>
          )}
          {signage.movie ? signage.movie.title || "NO TITLE" : "NOT SELECTED"}
        </div>
      </div>
      {/* <div className={styles.signageListItemWrapper}>
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
                height: "100%",
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
      </div> */}
    </div>
  );
}
