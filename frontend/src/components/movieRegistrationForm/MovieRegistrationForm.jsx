import React, { useState } from "react";
import styles from "./MovieRegistrationForm.module.css";
import { previousDay } from "date-fns";
import { ListItem } from "@mui/material";

export default function MovieRegistrationForm() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState("G");
  const [sub, setSub] = useState(""); // 字幕版
  const [dub, setDub] = useState(""); // 吹替版
  const [jsub, setJsub] = useState(""); // 日本語字幕版
  const [fourk, setFourk] = useState(""); // 4K上映
  const [lv, setLv] = useState(""); // LV
  const [lgreeting, setLgreeting] = useState(""); // 舞台挨拶中継付上映
  const [greeting, setGreeting] = useState(""); // 舞台挨拶付上映
  const [releaseDate, setReleaseDate] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

  };

  return (
    <form className={styles.formWrapper} onSubmit={handleSubmit}>
      <div className={styles.formItems}>
        <div className={styles.formItem}>
          <label
            htmlFor="title"
            className={styles.formLabel}
            style={{ fontWeight: "bolder" }}
          >
            作品名（必須）：
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.formControl}
          />
        </div>
        <div className={styles.formItem}>
          <label
            htmlFor="rating"
            className={styles.formLabel}
            style={{ fontWeight: "bolder" }}
          >
            レーティング（必須）：
          </label>
          <select
            id="rating"
            value={rating}
            required
            onChange={(e) => setRating(e.target.value)}
            className={styles.formControl}
          >
            <option value="G" key={"g"}>
              G（全年齢）
            </option>
            <option value="PG12" key={"pg12"}>
              PG12（12歳未満 保護者の助言・指導必要）
            </option>
            <option value="R15+" key={"r15"}>
              R15+（15歳未満 禁止）
            </option>
            <option value="R18+" key={"r18"}>
              R18+（18歳未満 禁止）
            </option>
            <option value="" key={"nr"}>
              レーティング対象外（LV・舞台挨拶など）
            </option>
          </select>
        </div>
        <div className={styles.formItem}>
          <label
            htmlFor="showingType"
            className={styles.formLabel}
            style={{ fontWeight: "bolder" }}
          >
            上映種別設定：
          </label>
          <div className={styles.showingTypeSettings} id="showingType">
            <div className={styles.showingTypeItem}>
              <label htmlFor="sub" className={styles.formLabel}>
                字幕版：
              </label>
              <select
                id="sub"
                value={sub}
                required
                onChange={(e) => setSub(e.target.value)}
                className={styles.formControl}
              >
                <option value={false}>なし</option>
                <option value={true}>あり</option>
              </select>
            </div>
            <div className={styles.showingTypeItem}>
              <label htmlFor="dub" className={styles.formLabel}>
                吹替版：
              </label>
              <select
                id="dub"
                value={dub}
                required
                onChange={(e) => setDub(e.target.value)}
                className={styles.formControl}
              >
                <option value={false}>なし</option>
                <option value={true}>あり</option>
              </select>
            </div>
            <div className={styles.showingTypeItem}>
              <label htmlFor="jsub" className={styles.formLabel}>
                日本語字幕版：
              </label>
              <select
                id="jsub"
                value={jsub}
                required
                onChange={(e) => setJsub(e.target.value)}
                className={styles.formControl}
              >
                <option value={false}>なし</option>
                <option value={true}>あり</option>
              </select>
            </div>
            <div className={styles.showingTypeItem}>
              <label htmlFor="fourk" className={styles.formLabel}>
                4K上映：
              </label>
              <select
                id="fourk"
                value={fourk}
                required
                onChange={(e) => setFourk(e.target.value)}
                className={styles.formControl}
              >
                <option value={false}>なし</option>
                <option value={true}>あり</option>
              </select>
            </div>
            <div className={styles.showingTypeItem}>
              <label htmlFor="lv" className={styles.formLabel}>
                LV：
              </label>
              <select
                id="lv"
                value={lv}
                required
                onChange={(e) => setLv(e.target.value)}
                className={styles.formControl}
              >
                <option value={false}>なし</option>
                <option value={true}>あり</option>
              </select>
            </div>
            <div className={styles.showingTypeItem}>
              <label htmlFor="lgreeting" className={styles.formLabel}>
                舞台挨拶中継付上映：
              </label>
              <select
                id="lgreeting"
                value={lgreeting}
                required
                onChange={(e) => setLgreeting(e.target.value)}
                className={styles.formControl}
              >
                <option value={false}>なし</option>
                <option value={true}>あり</option>
              </select>
            </div>
            <div className={styles.showingTypeItem}>
              <label htmlFor="greeting" className={styles.formLabel}>
                舞台挨拶付上映：
              </label>
              <select
                id="greeting"
                value={greeting}
                required
                onChange={(e) => setGreeting(e.target.value)}
                className={styles.formControl}
              >
                <option value={false}>なし</option>
                <option value={true}>あり</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.formControlButtons}>
        <button type="reset" className={styles.formClearButton}>
          選択リセット
        </button>
        <button type="submit" className={styles.formSubmitButton}>
          登録
        </button>
      </div>
    </form>
  );
}
