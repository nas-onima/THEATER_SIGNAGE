import React from "react";
import styles from "./SignageListItem.module.css";
import useSWR from "swr";

export default function SignageListItem({ signage, onSignageClick }) {
  const handleSignageClick = () => {
    onSignageClick(signage);
  };

  return (
    <div className={styles.signageListItem} onClick={handleSignageClick}>
      <div className={styles.theaterNumber}>
        <div className={styles.theaterLabel}>シアター</div>
        <div className={styles.theaterNumberText}>{signage.theaterId}</div>
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
      <div className={styles.description}>
        <div className={styles.title}>
          {signage.movie && signage.movie.rating ? (
            <span className={styles.rating}>
              {!signage.isConnected ? (
                <span
                  className={styles.statusIndicator}
                  title="オフライン"
                  style={{ backgroundColor: "#dc3545" }}
                >
                  !
                </span>
              ) : (
                <span
                  className={styles.statusIndicator}
                  title={
                    signage.activeConnections > 1
                      ? `オンライン (${signage.activeConnections}台接続中)`
                      : "オンライン"
                  }
                  style={{ backgroundColor: "#009e15ff" }}
                >
                  {signage.activeConnections > 1 && signage.activeConnections}
                </span>
              )}
              【{signage.movie.rating}】
              {signage.titleOverride ||
                (signage.movie
                  ? signage.movie.title || "NO TITLE"
                  : "NOT SELECTED")}
            </span>
          ) : (
            <span className={styles.rating}>
              {!signage.isConnected ? (
                <span
                  className={styles.statusIndicator}
                  title="オフライン"
                  style={{ backgroundColor: "#dc3545" }}
                >
                  !
                </span>
              ) : (
                <span
                  className={styles.statusIndicator}
                  title={
                    signage.activeConnections > 1
                      ? `オンライン (${signage.activeConnections}台接続中)`
                      : "オンライン"
                  }
                  style={{ backgroundColor: "#009e15ff" }}
                >
                  {signage.activeConnections > 1 && signage.activeConnections}
                </span>
              )}
              【-】
              {signage.titleOverride ||
                (signage.movie
                  ? signage.movie.title || "NO TITLE"
                  : "NO DATA")}
            </span>
          )}
        </div>
        <hr className={styles.horizontalBar} />
        <div className={styles.showingTypeLabelText}>上映種別</div>
        <div className={styles.showingTypeField}>
          {Object.values(signage.showingType).some(Boolean) ? (
            <>
              {signage.showingType.sub && (
                <div className={styles.showingTypeStatus}>字幕版</div>
              )}
              {signage.showingType.dub && (
                <div className={styles.showingTypeStatus}>吹替版</div>
              )}
              {signage.showingType.jsub && (
                <div className={styles.showingTypeStatus}>日本語字幕版</div>
              )}
              {signage.showingType.fourK && (
                <div className={styles.showingTypeStatus}>4K</div>
              )}
              {signage.showingType.threeD && (
                <div className={styles.showingTypeStatus}>3D</div>
              )}
              {signage.showingType.cheer && (
                <div className={styles.showingTypeStatus}>応援上映</div>
              )}
              {signage.showingType.live && (
                <div className={styles.showingTypeStatus}>LV</div>
              )}
              {signage.showingType.greeting && (
                <div className={styles.showingTypeStatus}>舞台挨拶</div>
              )}
              {signage.showingType.greetingLive && (
                <div className={styles.showingTypeStatus}>舞台挨拶中継</div>
              )}
            </>
          ) : (
            <div className={styles.showingTypeStatus}>
              通常上映（上映種別指定なし）
            </div>
          )}
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
