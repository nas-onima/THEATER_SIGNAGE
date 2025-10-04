import React from "react";
import Topbar from "../../components/topbar/Topbar";
import SchedulePanel from "../../components/schedulePanel/SchedulePanel";
import styles from "./Home.module.css";
import Login from "../login/Login";
import { useUserData } from "../../hooks/useUserData";
import MovieList from "../movieList/movieList";

export default function Home() {
  const { userData, isLoading, isError } = useUserData();

  return (
    <>
      <Topbar />
      <div className={styles.homeContainer}>
        <MovieList />
      </div>
    </>
  );
}
