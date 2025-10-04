// SignageDetailsDialog.jsx
import React, { useState, useEffect } from "react";
import styles from "./SignageDetailsDialog.module.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { getIdTokenForSWR } from "../../hooks/useUserData";
import MovieSelectionList from "../movieSelectionList/MovieSelectionList";

export default function SignageDetailsDialog({
  signage,
  open,
  onClose,
  mutate,
}) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showingType, setShowingType] = useState({
    sub: false,
    dub: false,
    jsub: false,
    fourK: false,
    threeD: false,
    cheer: false,
    live: false,
    greeting: false,
    greetingLive: false,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (signage) {
      setSelectedMovie(signage.movie || null);
      setShowingType(
        signage.showingType || {
          sub: false,
          dub: false,
          jsub: false,
          fourK: false,
          threeD: false,
          cheer: false,
          live: false,
          greeting: false,
          greetingLive: false,
        }
      );
    }
  }, [signage]);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  const handleShowingTypeChange = (type) => {
    setShowingType((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSave = async () => {
    if (!selectedMovie) {
      alert("映画を選択してください");
      return;
    }

    setIsUpdating(true);
    try {
      const token = await getIdTokenForSWR();
      const res = await fetch(
        `http://localhost:5000/api/signages/${signage._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movieId: selectedMovie._id,
            showingType: showingType,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`API ERROR: ${res.statusText}`);
      }

      mutate();
      onClose();
    } catch (error) {
      console.error("サイネージの更新に失敗しました:", error.message);
      alert("サイネージの更新に失敗しました");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveMovie = async () => {
    setIsUpdating(true);
    try {
      const token = await getIdTokenForSWR();
      const res = await fetch(
        `http://localhost:5000/api/signages/${signage._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movieId: null,
            showingType: {
              sub: false,
              dub: false,
              jsub: false,
              fourK: false,
              threeD: false,
              cheer: false,
              live: false,
              greeting: false,
              greetingLive: false,
            },
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`API ERROR: ${res.statusText}`);
      }

      mutate();
      onClose();
    } catch (error) {
      console.error("映画の削除に失敗しました:", error.message);
      alert("映画の削除に失敗しました");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="body">
      <DialogTitle>
        シアター{signage?.theaterId} サイネージ設定
        {signage && (
          <span className={styles.connectionStatus}>
            ({signage.isConnected ? "オンライン" : "オフライン"})
          </span>
        )}
      </DialogTitle>

      <DialogContent>
        <div className={styles.dialogContent}>
          {/* 現在設定されている映画の表示 */}
          <div className={styles.currentMovieSection}>
            <h3>現在の設定</h3>
            {selectedMovie ? (
              <div className={styles.currentMovie}>
                <div className={styles.movieInfo}>
                  <div className={styles.moviePoster}>
                    {selectedMovie.image ? (
                      <img
                        src={`data:image/png;base64,${selectedMovie.image}`}
                        alt={selectedMovie.title + "のポスター画像"}
                        className={styles.posterImage}
                      />
                    ) : (
                      <div className={styles.noImage}>NO IMAGE</div>
                    )}
                  </div>
                  <div className={styles.movieDetails}>
                    <div className={styles.movieTitle}>
                      {selectedMovie.rating && (
                        <span className={styles.rating}>
                          【{selectedMovie.rating}】
                        </span>
                      )}
                      {selectedMovie.title}
                    </div>
                    {selectedMovie.duration && (
                      <div className={styles.movieDetail}>
                        上映時間: {selectedMovie.duration}分
                      </div>
                    )}
                    {selectedMovie.genre && (
                      <div className={styles.movieDetail}>
                        ジャンル: {selectedMovie.genre}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleRemoveMovie}
                  disabled={isUpdating}
                  className={styles.removeButton}
                >
                  セット解除
                </Button>
              </div>
            ) : (
              <div className={styles.noMovieSelected}>未設定</div>
            )}
          </div>

          {/* 映画選択リスト */}
          <div className={styles.movieSelectionSection}>
            <h3>映画を選択</h3>
            <MovieSelectionList
              onMovieSelect={handleMovieSelect}
              selectedMovieId={selectedMovie?._id}
            />
          </div>
        </div>

        {/* 上映種別の設定 */}
        <div className={styles.showingTypeSection}>
          <h3>上映種別</h3>
          <div className={styles.checkboxGrid}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showingType.sub}
                  onChange={() => handleShowingTypeChange("sub")}
                />
              }
              label="字幕版"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showingType.dub}
                  onChange={() => handleShowingTypeChange("dub")}
                />
              }
              label="吹替版"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showingType.jsub}
                  onChange={() => handleShowingTypeChange("jsub")}
                />
              }
              label="日本語字幕版"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showingType.fourK}
                  onChange={() => handleShowingTypeChange("fourK")}
                />
              }
              label="4K"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showingType.threeD}
                  onChange={() => handleShowingTypeChange("threeD")}
                />
              }
              label="3D"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showingType.cheer}
                  onChange={() => handleShowingTypeChange("cheer")}
                />
              }
              label="応援上映"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showingType.live}
                  onChange={() => handleShowingTypeChange("live")}
                />
              }
              label="LV"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showingType.greeting}
                  onChange={() => handleShowingTypeChange("greeting")}
                />
              }
              label="舞台挨拶"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showingType.greetingLive}
                  onChange={() => handleShowingTypeChange("greetingLive")}
                />
              }
              label="舞台挨拶中継"
            />
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isUpdating}>
          キャンセル
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={isUpdating}>
          {isUpdating ? "更新中..." : "保存"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
