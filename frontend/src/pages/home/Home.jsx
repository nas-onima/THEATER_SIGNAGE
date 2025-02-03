import React from "react";
import Topbar from "../../components/topbar/Topbar";
import SchedulePanel from "../../components/schedulePanel/SchedulePanel";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <>
      <Topbar />
      <div className={styles.homeContainer}>
        <SchedulePanel />
      </div>
    </>
  );
}
