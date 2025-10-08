import React from "react";
import Topbar from "../../components/topbar/Topbar";
import SchedulePanel from "../../components/schedulePanel/SchedulePanel";
import styles from "./Home.module.css";
import Login from "../login/Login";
import { useUserData } from "../../hooks/useUserData";
import MovieList from "../movieList/movieList";
import { Link } from "react-router-dom";

export default function Home() {
  const { userData, isLoading, isError } = useUserData();

  return (
    <>
      <Topbar />
      <div className={styles.homeContainer}>
        <h1>メニュー</h1>
        <div className={styles.menuContainer}>
          <div className={styles.menuItem}>
            <Link to="/signage-menu" className={styles.menuLink}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>📺</span>
              </div>
              <div className={styles.menuContent}>
                <h3>サイネージ表示</h3>
                <p>表示するサイネージを選択</p>
              </div>
              <span className={styles.arrow}>→</span>
            </Link>
          </div>

          <div className={styles.menuItem}>
            <Link to="/manage/signages" className={styles.menuLink}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>🏛️</span>
              </div>
              <div className={styles.menuContent}>
                <h3>サイネージ集中管理</h3>
                <p>サイネージの表示の遠隔操作</p>
              </div>
              <span className={styles.arrow}>→</span>
            </Link>
          </div>

          <div className={styles.menuItem}>
            <Link to="/manage/movie" className={styles.menuLink}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>🎬</span>
              </div>
              <div className={styles.menuContent}>
                <h3>作品管理</h3>
                <p>映画作品の登録・編集・管理</p>
              </div>
              <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
