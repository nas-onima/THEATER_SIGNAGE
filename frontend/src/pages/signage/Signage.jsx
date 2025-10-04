import React, { useEffect, useState } from "react";
import styles from "./Signage.module.css";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import Loading from "../loading/Loading";

export default function Signage() {
  const { id } = useParams();
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchSignageData = async (url) => {
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
    data: signage,
    error: errorOnSignage,
    isLoading: isLoadingOnSignage,
  } = useSWR(`http://localhost:5000/api/signages/${id}`, fetchSignageData, {
    refreshInterval: 5000, // 5秒ごとに更新
  });

  if (isLoadingOnSignage) {
    return (
      <div className={styles.loadingWrapper}>
        <Loading />
      </div>
    );
  }

  if (errorOnSignage || !signage) {
    return (
      <div className={styles.errorWrapper}>
        <div className={styles.errorMessage}>
          <h1>エラー</h1>
          <h1>データの取得に失敗しました</h1>
          <p>シアター{id}のデータが見つかりません</p>
        </div>
      </div>
    );
  }

  const movie = signage.movie;
  const showingType = signage.showingType || {};
  const hasAnyShowingType = Object.values(showingType).some(Boolean);

  return (
    <div className={styles.signageWrapper}>
      {/* ポスター表示エリア */}
      <div className={styles.posterArea}>
        {movie && movie.image ? (
          <img
            src={`data:image/png;base64,${movie.image}`}
            alt={movie.title + "のポスター画像"}
            className={styles.posterImage}
          />
        ) : (
          <div className={styles.noImage}>
            <div className={styles.noImageContent}>
              <h1>未設定</h1>
              <p>シアター {signage.theaterId}</p>
            </div>
          </div>
        )}
      </div>

      {/* 下部情報エリア */}
      <div className={styles.infoArea}>
        {/* 上映種別表示 */}
        <div className={styles.showingTypeArea}>
          {hasAnyShowingType ? (
            <div className={styles.showingTypeList}>
              {showingType.sub && (
                <div className={styles.showingTypeTag}>字幕版</div>
              )}
              {showingType.dub && (
                <div className={styles.showingTypeTag}>吹替版</div>
              )}
              {showingType.jsub && (
                <div className={styles.showingTypeTag}>日本語字幕版</div>
              )}
              {showingType.fourK && (
                <div className={styles.showingTypeTag}>4K</div>
              )}
              {showingType.threeD && (
                <div className={styles.showingTypeTag}>3D</div>
              )}
              {showingType.cheer && (
                <div className={styles.showingTypeTag}>応援上映</div>
              )}
              {showingType.live && (
                <div className={styles.showingTypeTag}>ライブビューイング</div>
              )}
              {showingType.greeting && (
                <div className={styles.showingTypeTag}>舞台挨拶</div>
              )}
              {showingType.greetingLive && (
                <div className={styles.showingTypeTag}>舞台挨拶中継</div>
              )}
            </div>
          ) : (
            <div className={styles.showingTypeList}>
              <div className={styles.showingTypeTag}>通常上映</div>
            </div>
          )}
        </div>

        {/* タイトル表示 */}
        <div className={styles.titleArea}>
          <h1 className={styles.movieTitle}>
            {movie && movie.rating && movie.rating !== "G" && (
              <span className={styles.rating}>【{movie.rating}】</span>
            )}
            {signage.titleOverride
              ? signage.titleOverride
              : movie
              ? movie.title || "未設定"
              : "未設定"}
          </h1>
        </div>

        {/* シアター情報と時刻 */}
        {/* <div className={styles.footerInfo}>
          <div className={styles.theaterInfo}>シアター {signage.theaterId}</div>
          
        </div> */}
      </div>
    </div>
  );
}
