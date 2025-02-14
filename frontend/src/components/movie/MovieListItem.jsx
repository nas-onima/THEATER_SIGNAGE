import React from "react";
import styles from "./MovieListItem.module.css";
import { fromZonedTime, format } from "date-fns-tz";
import { Link, useNavigate } from "react-router-dom";

export default function Movie({ movie }) {
  const timeZone = "Asia/Tokyo";
  const zonedDate = fromZonedTime(movie.releaseDate, timeZone);
  const formattedDate = format(zonedDate, "yyyy/MM/dd", { timeZone });
  const formattedTime = format(zonedDate, "HH:mm", { timeZone });
  const nav = useNavigate();

  const handleMovieClick = async () => {
    nav("/movie/" + movie._id);
  };

  let ratingStyle;
  if (movie.rating === "G") {
    ratingStyle = { borderLeft: "3px solid green" };
  } else if (movie.rating === "PG12") {
    ratingStyle = { borderLeft: "3px solid blue" };
  } else if (movie.rating === "R15+") {
    ratingStyle = { borderLeft: "3px solid magenta" };
  } else if (movie.rating === "R18+") {
    ratingStyle = { borderLeft: "3px solid red" };
  } else {
    ratingStyle = { borderLeft: "3px solid gray", marginRight: "10px" };
  }

  return (
    <div className={styles.movie}>
      <div className={styles.movieWrapper} onClick={handleMovieClick}>
        <div className={styles.pubDate}>
          <div className={styles.date}>{formattedDate || "----/--/--"}</div>
          <div className={styles.pubLabel}>公開</div>
        </div>
        {movie.image ? (
          <img
            src={`data:image/png;base64,${movie.image}`}
            alt={movie.title + "のポスター画像"}
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
            {movie.showingType}
          </div>
        )}
        <div className={styles.description}>
          <div className={styles.title}>
            {movie.rating ? (
              <span className={styles.rating} style={ratingStyle}>
                【{movie.rating}】
              </span>
            ) : (
              <span className={styles.rating} style={ratingStyle}></span>
            )}
            {movie.title || "NO TITLE"}
          </div>
        </div>
        {/* <div className={styles.rating}>{movie.rating}</div> */}
      </div>
    </div>
  );
}
