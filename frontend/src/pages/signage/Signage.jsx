import React, { useEffect, useState, useRef } from "react";
import styles from "./Signage.module.css";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import Loading from "../loading/Loading";
import { io } from "socket.io-client";

export default function Signage() {
  const { id } = useParams();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const previousData = useRef(null);

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
    mutate: mutateSignage,
  } = useSWR(`http://localhost:5000/api/signages/${id}`, fetchSignageData, {
    refreshInterval: isConnected ? 0 : 5000, // Socket接続時は自動更新停止
  });

  // Socket.IO接続管理
  useEffect(() => {
    if (!signage) return;

    // Socket.IO接続を初期化
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // 接続成功時
    newSocket.on("connect", () => {
      console.log("Socket.IOに接続:", newSocket.id);

      // サイネージとして登録
      newSocket.emit("signage-connect", {
        theaterId: signage.theaterId,
      });
    });

    // 接続確認受信
    newSocket.on("connection-confirmed", (data) => {
      console.log("サイネージ接続OK:", data);
      setIsConnected(true);
    });

    // サイネージデータ更新受信
    newSocket.on("signage-data-updated", (updatedSignage) => {
      console.log("サイネージデータを更新:", updatedSignage);

      // データが変更された場合のみフェードアニメーションを実行
      if (
        previousData.current &&
        (previousData.current.movie?.id !== updatedSignage.movie?.id ||
          previousData.current.titleOverride !== updatedSignage.titleOverride ||
          JSON.stringify(previousData.current.showingType) !==
            JSON.stringify(updatedSignage.showingType))
      ) {
        // フェードアウト開始
        setIsTransitioning(true);

        // 300ms後にデータ更新とフェードイン
        setTimeout(() => {
          mutateSignage(updatedSignage, false);
          setAnimationKey((prev) => prev + 1);
          setIsTransitioning(false);
        }, 300);
      } else {
        // データが同じ場合は即座に更新
        mutateSignage(updatedSignage, false);
      }
    });

    // 接続エラー
    newSocket.on("connection-error", (error) => {
      console.error("サイネージ接続エラー:", error);
      setIsConnected(false);
    });

    // 切断時
    newSocket.on("disconnect", () => {
      console.log("Socket.IOから切断");
      setIsConnected(false);
    });

    // クリーンアップ処理
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [signage?.theaterId, mutateSignage]);

  // データ変更の監視
  useEffect(() => {
    if (signage) {
      previousData.current = {
        movie: signage.movie,
        titleOverride: signage.titleOverride,
        showingType: signage.showingType,
      };
    }
  }, [signage]);

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
      {/* 接続状態インジケーター */}
      <div
        className={`${styles.connectionStatus} ${
          isConnected ? styles.connected : styles.disconnected
        }`}
      >
        <div className={styles.statusIndicator}></div>
        <span>{isConnected ? "オンライン" : "オフライン"}</span>
      </div>

      {/* ポスター表示エリア */}
      <div
        className={`${styles.posterArea} ${
          isTransitioning ? styles.fadeOut : styles.fadeIn
        }`}
        key={`poster-${animationKey}`}
      >
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
        <div
          className={`${styles.showingTypeArea} ${
            isTransitioning ? styles.fadeOut : styles.fadeIn
          }`}
          key={`showing-${animationKey}`}
        >
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
                <div className={styles.showingTypeTag}>4K上映</div>
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
        <div
          className={`${styles.titleArea} ${
            isTransitioning ? styles.fadeOut : styles.fadeIn
          }`}
          key={`title-${animationKey}`}
        >
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
        <div className={styles.footerInfo}>
          <div className={styles.theaterInfo}>シアター {signage.theaterId}</div>
          
        </div>
      </div>
    </div>
  );
}
