import React, { useState } from "react";
import styles from "./SchedulePanel.module.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import { ja } from "date-fns/locale";
import startOfWeek from "date-fns/startOfWeek";
import axios from "axios";
import { useUserData } from "../../hooks/useUserData";

const locales = {
  ja: ja,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const resources = [
  { resource: 1, resourceTitle: "シアター1" },
  { resource: 2, resourceTitle: "シアター2" },
  { resource: 3, resourceTitle: "シアター3" },
  { resource: 4, resourceTitle: "シアター4" },
  { resource: 5, resourceTitle: "シアター5" },
  { resource: 6, resourceTitle: "シアター6" },
  { resource: 7, resourceTitle: "シアター7" },
  { resource: 8, resourceTitle: "シアター8" },
];

export default function SchedulePanel() {
  const { userData, isLoading, isError, mutate } = useUserData();

  const minTime = new Date();
  minTime.setHours(7, 0, 0); // AM7:00に設定

  const maxTime = new Date();
  maxTime.setHours(23, 59, 59); // PM12:00に設定

  const formats = {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "HH:mm", culture),
  };

  const events = [
    {
      title: "イベント1",
      start: new Date(2025, 2, 11, 12, 0),
      end: new Date(2025, 2, 11, 13, 0),
      resource: 1,
    },
  ];

  return (
    <div className={styles.mainContainer}>
      {userData ? userData.name : "未ログイン"}
      {isLoading ? "true" : "false"}
      <Calendar
        localizer={localizer}
        events={events}
        showAllEvents={true}
        step={1}
        timeslots={5}
        resources={resources}
        resourceTitleAccessor="resourceTitle"
        defaultView={Views.DAY}
        min={minTime} // 動的に設定
        max={maxTime} // 動的に設定
        formats={formats} // 24時間表記に設定
        className={styles.calendar}
      />
    </div>
  );
}
