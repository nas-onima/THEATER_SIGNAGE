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
  { resourceId: 1, resourceTitle: "シアター1" },
  { resourceId: 2, resourceTitle: "シアター2" },
  { resourceId: 3, resourceTitle: "シアター3" },
  { resourceId: 4, resourceTitle: "シアター4" },
  { resourceId: 5, resourceTitle: "シアター5" },
  { resourceId: 6, resourceTitle: "シアター6" },
  { resourceId: 7, resourceTitle: "シアター7" },
  { resourceId: 8, resourceTitle: "シアター8" },
];

export default function SchedulePanel() {
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
      start: new Date(2025, 2, 8, 12, 0),
      end: new Date(2025, 2, 8, 13, 0),
      resource: 1,
    }
  ];

  return (
    <div className={styles.mainContainer}>
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
