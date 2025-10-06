// MovieDetailsDialog.jsx
import React, { useState } from "react";
import styles from "./MovieDetailsDialog.module.css";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getIdTokenForSWR } from "../../hooks/useUserData";
import { createApiUrl } from "../../config/api";

export default function MovieDetailsDialog({ movie, onClose, mutate }) {
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [updatedMovie, setUpdatedMovie] = useState({ ...movie });

  const handleEditClick = (field, value) => {
    setEditField(field);
    setEditValue(value);
  };

  const handleSaveEdit = () => {
    setUpdatedMovie((prev) => ({ ...prev, [editField]: editValue }));
    setEditField(null);
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      const token = await getIdTokenForSWR();
      const res = await fetch(createApiUrl(`/api/movies/movie/${movie._id}`), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMovie),
      });

      if (!res.ok) {
        throw new Error(`API ERROR: ${res.statusText}`);
      }

      setHasChanges(false);
      setIsConfirmDialogOpen(false);
      mutate();
      onClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleConfirmClose = () => {
    setIsConfirmDialogOpen(false);
    onClose();
  };

  const handleDialogClose = () => {
    if (hasChanges) {
      setIsConfirmDialogOpen(true);
    } else {
      onClose();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditValue(reader.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.dialog}>
      <div className={styles.posterField}>
        {updatedMovie.image ? (
          <img
            src={`data:image/png;base64,${updatedMovie.image}`}
            alt={updatedMovie.title + "のポスター画像"}
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
            {updatedMovie.showingType}
          </div>
        )}
        <EditIcon
          className={styles.editIcon}
          style={{
            position: "absolute",
            right: "0",
            bottom: "0",
            margin: "5px",
          }}
          onClick={() => handleEditClick("image", updatedMovie.image)}
        />
      </div>
      <div className={styles.detailsField}>
        <h2>
          {updatedMovie.title}
          <EditIcon
            className={styles.editIcon}
            onClick={() => handleEditClick("title", updatedMovie.title)}
          />
        </h2>
        <h3 className={styles.detailsItem}>
          公開: {new Date(updatedMovie.releaseDate).toLocaleDateString()}
          <EditIcon
            className={styles.editIcon}
            onClick={() =>
              handleEditClick("releaseDate", new Date(updatedMovie.releaseDate))
            }
          />
        </h3>
        <h3 className={styles.detailsItem}>
          上映終了:
          {updatedMovie.endDate
            ? new Date(updatedMovie.endDate).toLocaleDateString()
            : "未定・対象外"}
          <EditIcon
            className={styles.editIcon}
            onClick={() =>
              handleEditClick(
                "endDate",
                updatedMovie.endDate ? new Date(updatedMovie.endDate) : null
              )
            }
          />
        </h3>
        <h3 className={styles.detailsItem}>
          レーティング: {updatedMovie.rating ? updatedMovie.rating : "なし"}
          <EditIcon
            className={styles.editIcon}
            onClick={() => handleEditClick("rating", updatedMovie.rating)}
          />
        </h3>
      </div>
      <button className={styles.closeButton} onClick={handleDialogClose}>
        {hasChanges ? "保存して閉じる" : "閉じる"}
      </button>

      {/* 編集ダイアログ */}
      <Dialog open={!!editField} onClose={handleDialogClose}>
        <div className={styles.dialogContent}>
          {editField === "releaseDate" ? (
            <DatePicker
              selected={editValue}
              onChange={(date) => setEditValue(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="日付を選択"
              onKeyDown={(e) => e.preventDefault()}
              inline
            />
          ) : editField === "endDate" ? (
            <>
              <DatePicker
                selected={editValue}
                onChange={(date) => setEditValue(date)}
                dateFormat="yyyy/MM/dd"
                placeholderText="日付を選択"
                onKeyDown={(e) => e.preventDefault()}
                inline
              />
              <Button onClick={() => setEditValue("")}>未定とする</Button>
            </>
          ) : editField === "rating" ? (
            <TextField
              select
              label={editField}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              fullWidth
            >
              <MenuItem value="G">G（全年齢）</MenuItem>
              <MenuItem value="PG12">
                PG12（12歳未満 保護者の助言・指導必要）
              </MenuItem>
              <MenuItem value="R15+">R15+（15歳未満 禁止）</MenuItem>
              <MenuItem value="R18+">R18+（18歳未満 禁止）</MenuItem>
              <MenuItem value="">
                レーティング対象外（LV・舞台挨拶など）
              </MenuItem>
            </TextField>
          ) : editField === "image" ? (
            <>
              <input type="file" onChange={handleFileChange} />
              {editValue && (
                <img
                  src={`data:image/png;base64,${editValue}`}
                  alt="プレビュー"
                  style={{ width: "100%", marginTop: "10px" }}
                />
              )}
              <Button onClick={() => setEditValue("")}>画像を削除</Button>
            </>
          ) : (
            <TextField
              label={editField}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              fullWidth
            />
          )}
          <Button onClick={handleSaveEdit}>OK</Button>
        </div>
      </Dialog>

      {/* 確認ダイアログ */}
      <Dialog open={isConfirmDialogOpen} onClose={handleConfirmClose}>
        <div className={styles.dialogContent}>
          <h3>変更を保存しますか？</h3>
          <Button onClick={handleConfirmClose}>破棄</Button>
          <Button onClick={handleSaveChanges}>保存</Button>
        </div>
      </Dialog>
    </div>
  );
}
