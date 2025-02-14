import React from "react";
import styles from "./Movie.module.css";
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

  // let amountTextStyle;
  // let amountBGStyle;

  // if (movie.isPending) {
  //   amountBGStyle = { backgroundColor: "#f2ec4d" };
  //   amountTextStyle =
  //     movie.amount > 0 ? { color: "#4CAF50" } : { color: "#F44336" };
  // } else if (movie.amount > 0) {
  //   amountTextStyle = { color: "#4CAF50" };
  //   amountBGStyle = { backgroundColor: "#DFF2D8" };
  // } else {
  //   amountTextStyle = { color: "#F44336" };
  //   amountBGStyle = { backgroundColor: "#FDECEA" };
  // }

  return (
    <div className={styles.movie}>
      <div className={styles.movieWrapper} onClick={handleMovieClick}>
        <div className={styles.datetime}>
          <div className={styles.date}>{formattedDate || "----/--/--"}</div>
          <div className={styles.pubLabel}>公開</div>
        </div>
        <div className={styles.description}>
          <div className={styles.title}>{movie.title || "NO TITLE"}</div>
        </div>
        <div className={styles.rating}>{movie.rating}</div>
      </div>
    </div>
  );
}
