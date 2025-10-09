import React from "react";
import stylesForListView from "./MovieListItemForListView.module.css";
import stylesForPosterView from "./MovieListItemForPosterView.module.css";
import { fromZonedTime, format } from "date-fns-tz";
import { Link, useNavigate } from "react-router-dom";

export default function MovieListItem({
  movie,
  displayMode = "poster",
  onMovieClick,
}) {
  const timeZone = "Asia/Tokyo";
  const zonedReleaseDate = movie.releaseDate
    ? fromZonedTime(movie.releaseDate, timeZone)
    : null;
  const zonedEndDate = movie.endDate
    ? fromZonedTime(movie.endDate, timeZone)
    : null;
  const formattedReleaseDate = zonedReleaseDate
    ? format(zonedReleaseDate, "yyyy/MM/dd", { timeZone })
    : null;
  const formattedEndDate = zonedEndDate
    ? format(zonedEndDate, "yyyy/MM/dd", { timeZone })
    : null;
  const nav = useNavigate();

  const handleMovieClick = () => {
    //nav("/movie/" + movie._id);
    onMovieClick(movie);
  };

  let ratingStyle;
  if (movie.rating === "G") {
    ratingStyle = { borderLeft: "5px solid green" };
  } else if (movie.rating === "PG12") {
    ratingStyle = { borderLeft: "5px solid blue" };
  } else if (movie.rating === "R15+") {
    ratingStyle = { borderLeft: "5px solid magenta" };
  } else if (movie.rating === "R18+") {
    ratingStyle = { borderLeft: "5px solid red" };
  } else {
    ratingStyle = { borderLeft: "5px solid gray", marginRight: "10px" };
  }

  if (displayMode === "list") {
    return (
      <div className={stylesForListView.movie}>
        <div
          className={stylesForListView.movieWrapper}
          onClick={handleMovieClick}
        >
          <div className={stylesForListView.pubDate}>
            <div className={stylesForListView.date}>
              {formattedReleaseDate || "----/--/--"} 公開
            </div>
            <div className={stylesForListView.pubLabel}>
              {formattedEndDate ? formattedEndDate + " 終了"  : "終了日未定"}
            </div>
          </div>
          {movie.image ? (
            <img
              src={`data:image/png;base64,${movie.image}`}
              alt={movie.title + "のポスター画像"}
              className={stylesForListView.moviePosterImage}
            />
          ) : (
            <div
              className={stylesForListView.moviePosterImage}
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
          <div className={stylesForListView.description}>
            <div className={stylesForListView.title}>
              {movie.rating ? (
                <span className={stylesForListView.rating} style={ratingStyle}>
                  【{movie.rating}】
                </span>
              ) : (
                <span
                  className={stylesForListView.rating}
                  style={ratingStyle}
                ></span>
              )}
              {movie.title || "NO TITLE"}
            </div>
          </div>
          {/* <div className={styles.rating}>{movie.rating}</div> */}
        </div>
      </div>
    );
  } else if (displayMode === "poster") {
    return (
      <>
        <div className={stylesForPosterView.movie}>
          <div
            className={stylesForPosterView.movieWrapper}
            onClick={handleMovieClick}
          >
            {movie.image ? (
              <img
                src={`data:image/png;base64,${movie.image}`}
                alt={movie.title + "のポスター画像"}
                className={stylesForPosterView.moviePosterImage}
              />
            ) : (
              <div
                className={stylesForPosterView.moviePosterImage}
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
            <div className={stylesForPosterView.ratingField}>
              {movie.rating ? (
                <span className={stylesForListView.rating} style={ratingStyle}>
                  【{movie.rating}】
                </span>
              ) : (
                <span className={stylesForListView.rating} style={ratingStyle}>
                  {" "}
                  【NR】
                </span>
              )}
            </div>
            {/* <div className={styles.rating}>{movie.rating}</div> */}
          </div>
        </div>
      </>
    );
  }
}
