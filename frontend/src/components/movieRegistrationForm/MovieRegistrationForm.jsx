import React, { useState } from "react";
import styles from "./MovieRegistrationForm.module.css";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import { getIdTokenForSWR } from "../../hooks/useUserData";

import { previousDay } from "date-fns";
import { ListItem } from "@mui/material";

export default function MovieRegistrationForm() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [rating, setRating] = useState("G");
  const [selectedReleaseDate, setSelectedReleaseDate] = useState(new Date());
  const [formPage, setFormPage] = useState(1);
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [sub, setSub] = useState(""); // 字幕版
  const [dub, setDub] = useState(""); // 吹替版
  const [jsub, setJsub] = useState(""); // 日本語字幕版
  const [fourk, setFourk] = useState(""); // 4K上映
  const [lv, setLv] = useState(""); // LV
  const [lgreeting, setLgreeting] = useState(""); // 舞台挨拶中継付上映
  const [greeting, setGreeting] = useState(""); // 舞台挨拶付上映
  const [yearInput, setYearInput] = useState(new Date().getFullYear()); // 初期値を今年の年に設定

  const handleSubmit = async (e) => {
    try {
      const token = await getIdTokenForSWR();
      const res = await fetch(`http://localhost:5000/api/movies/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          image: imageBase64,
          rating: rating,
          releaseDate: selectedReleaseDate.toISOString(),
        }),
      });
      console.log("submitted");
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        setImage(event.target.result);
        setImageBase64(reader.result.split(",")[1]);
      };

      reader.onerror = (error) => {
        console.error("Base64 CONVERT ERROR", error);
      };
    }
  };

  const handleNextPage = () => {
    setFormPage(formPage + 1);
  };

  const handlePrevPage = () => {
    setFormPage(formPage - 1);
  };

  const handleEndDatePend = () => {
    setSelectedEndDate();
  };

  const doNothing = () => {};

  const setEndDateToCurrentDate = () => {
    setSelectedEndDate(new Date());
  };

  return (
    <form className={styles.formWrapper} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>作品情報 新規登録</h2>
      {formPage === 1 ? (
        <div className={styles.formItems}>
          <h3 className={styles.formSubTitle}>基本情報</h3>
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
          <div className={styles.formControlButtons}>
            <button type="reset" className={styles.formClearButton}>
              選択リセット
            </button>
            <button
              type="button"
              onClick={handleNextPage}
              className={styles.formSubmitButton}
              disabled={title ? false : true}
              style={
                title
                  ? { filter: "brightness(100%)" }
                  : { filter: "brightness(50%)" }
              }
            >
              次へ▶
            </button>
          </div>
          {/* <div className={styles.formItem}>
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
                </div> */}
        </div>
      ) : formPage === 2 ? (
        <div className={styles.formItems}>
          <h3 className={styles.formSubTitle}>上映情報</h3>
          <div className={styles.formItem}>
            <label
              htmlFor="releaseDate"
              className={styles.formLabel}
              style={{ fontWeight: "bolder" }}
            >
              公開日（必須）：
            </label>
            <DatePicker
              locale={"ja"}
              selected={selectedReleaseDate}
              onChange={(date) => setSelectedReleaseDate(date)}
              dateFormat={"yyyy/MM/dd"}
              placeholderText="公開日を選択"
              required
              onKeyDown={(e) => e.preventDefault()}
              renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {/* 年の入力フィールド */}
                  <input
                    type="number"
                    value={
                      selectedReleaseDate
                        ? selectedReleaseDate.getFullYear()
                        : new Date().getFullYear()
                    }
                    onChange={(event) => {
                      const newYear = parseInt(event.target.value, 10);
                      if (!isNaN(newYear)) {
                        setYearInput(newYear);
                        changeYear(newYear); // ここでカレンダーを更新
                        setSelectedReleaseDate(
                          new Date(
                            newYear,
                            selectedReleaseDate.getMonth(),
                            selectedReleaseDate.getDate()
                          )
                        );
                      }
                    }}
                    style={{ width: "70px", textAlign: "center" }}
                  />

                  {/* 月の選択ドロップダウン */}
                  <select
                    value={date.getMonth()}
                    onChange={(e) => {
                      const newMonth = parseInt(e.target.value, 10);
                      changeMonth(newMonth);
                      setSelectedReleaseDate(
                        new Date(
                          selectedReleaseDate.getFullYear(),
                          newMonth,
                          selectedReleaseDate.getDate()
                        )
                      );
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {i + 1}月
                      </option>
                    ))}
                  </select>

                  {/* 月の前後ボタン */}
                  <button
                    type="button"
                    onClick={() => {
                      decreaseMonth();
                      const newDate = new Date(
                        selectedReleaseDate.getFullYear(),
                        selectedReleaseDate.getMonth() - 1,
                        selectedReleaseDate.getDate()
                      );
                      setSelectedReleaseDate(newDate);
                      setYearInput(newDate.getFullYear());
                    }}
                    disabled={prevMonthButtonDisabled}
                    style={{ borderRadius: "5px" }}
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      increaseMonth();
                      const newDate = new Date(
                        selectedReleaseDate.getFullYear(),
                        selectedReleaseDate.getMonth() + 1,
                        selectedReleaseDate.getDate()
                      );
                      setSelectedReleaseDate(newDate);
                      setYearInput(newDate.getFullYear());
                    }}
                    disabled={nextMonthButtonDisabled}
                    style={{ borderRadius: "5px" }}
                  >
                    ▶
                  </button>
                </div>
              )}
            />
          </div>
          <div className={styles.formItem}>
            <label
              htmlFor="endDate"
              className={styles.formLabel}
              style={{ fontWeight: "bolder" }}
            >
              上映終了日：
            </label>
            <div className={styles.formEndDateField}>
              <DatePicker
                id="endDate"
                locale={"ja"}
                selected={selectedEndDate}
                onChange={(date) => setSelectedEndDate(date)}
                dateFormat={"yyyy/MM/dd"}
                placeholderText="未定"
                onKeyDown={(e) => e.preventDefault()}
                onFocus={selectedEndDate ? doNothing : setEndDateToCurrentDate}
                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {/* 年の入力フィールド */}
                    <input
                      type="number"
                      value={
                        selectedEndDate
                          ? selectedEndDate.getFullYear()
                          : yearInput
                      }
                      onChange={(event) => {
                        const newYear = parseInt(event.target.value, 10);
                        if (!isNaN(newYear)) {
                          setYearInput(newYear);
                          changeYear(newYear); // ここでカレンダーを更新
                          setSelectedEndDate(
                            new Date(
                              newYear,
                              selectedEndDate ? selectedEndDate.getMonth() : 0,
                              selectedEndDate ? selectedEndDate.getDate() : 1
                            )
                          );
                        }
                      }}
                      style={{ width: "70px", textAlign: "center" }}
                    />

                    {/* 月の選択ドロップダウン */}
                    <select
                      value={selectedEndDate ? selectedEndDate.getMonth() : 0}
                      onChange={(e) => {
                        const newMonth = parseInt(e.target.value, 10);
                        changeMonth(newMonth);
                        setSelectedEndDate(
                          new Date(
                            selectedEndDate
                              ? selectedEndDate.getFullYear()
                              : yearInput,
                            newMonth,
                            selectedEndDate ? selectedEndDate.getDate() : 1
                          )
                        );
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>
                          {i + 1}月
                        </option>
                      ))}
                    </select>

                    {/* 月の前後ボタン */}
                    <button
                      type="button"
                      onClick={() => {
                        decreaseMonth();
                        const newDate = new Date(
                          selectedEndDate
                            ? selectedEndDate.getFullYear()
                            : yearInput,
                          selectedEndDate ? selectedEndDate.getMonth() - 1 : 0,
                          selectedEndDate ? selectedEndDate.getDate() : 1
                        );
                        setSelectedEndDate(newDate);
                        setYearInput(newDate.getFullYear());
                      }}
                      disabled={prevMonthButtonDisabled}
                      style={{ borderRadius: "5px" }}
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        increaseMonth();
                        const newDate = new Date(
                          selectedEndDate
                            ? selectedEndDate.getFullYear()
                            : yearInput,
                          selectedEndDate ? selectedEndDate.getMonth() + 1 : 0,
                          selectedEndDate ? selectedEndDate.getDate() : 1
                        );
                        setSelectedEndDate(newDate);
                        setYearInput(newDate.getFullYear());
                      }}
                      disabled={nextMonthButtonDisabled}
                      style={{ borderRadius: "5px" }}
                    >
                      ▶
                    </button>
                  </div>
                )}
              />
              <button
                className={styles.pendingButton}
                type="button"
                onClick={handleEndDatePend}
              >
                未定として登録
              </button>
            </div>
          </div>
          <div className={styles.formControlButtons}>
            <button
              type="reset"
              onClick={handlePrevPage}
              className={styles.formClearButton}
            >
              ◀戻る
            </button>
            <button
              type="button"
              className={styles.formSubmitButton}
              onClick={handleNextPage}
              disabled={
                selectedEndDate
                  ? selectedEndDate >= selectedReleaseDate
                    ? false
                    : true
                  : false
              }
              style={
                selectedEndDate
                  ? selectedEndDate >= selectedReleaseDate
                    ? { filter: "brightness(100%)" }
                    : { filter: "brightness(50%)" }
                  : { filter: "brightness(100%)" }
              }
            >
              次へ▶
            </button>
          </div>
        </div>
      ) : formPage === 3 ? (
        <div className={styles.formItems}>
          <h3 className={styles.formSubTitle}>ポスター</h3>
          <div className={styles.formItem}>
            <label
              htmlFor="poster"
              className={styles.formLabel}
              style={{ fontWeight: "bolder" }}
            >
              ポスター画像：
            </label>
            <input
              type="file"
              id="poster"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.formControl}
              style={null}
            />
          </div>
          {image && (
            <div className={styles.formItem}>
              <img
                src={image}
                alt="Uploaded Poster"
                className={styles.posterImage}
              />
            </div>
          )}
          <div className={styles.formControlButtons}>
            <button
              type="reset"
              onClick={handlePrevPage}
              className={styles.formClearButton}
            >
              ◀戻る
            </button>
            <button
              type="submit"
              className={styles.formSubmitButton}
              disabled={image ? false : true}
              style={
                image
                  ? { filter: "brightness(100%)" }
                  : { filter: "brightness(50%)" }
              }
            >
              登録
            </button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
