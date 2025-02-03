import React, { useState } from "react";
import styles from "./SchedulePanel.module.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import { ja } from "date-fns/locale";
import startOfWeek from "date-fns/startOfWeek";

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
  { resourceId: "theater1", resourceTitle: "シアター1" },
  { resourceId: "theater2", resourceTitle: "シアター2" },
  { resourceId: "theater3", resourceTitle: "シアター3" },
  { resourceId: "theater4", resourceTitle: "シアター4" },
  { resourceId: "theater5", resourceTitle: "シアター5" },
  { resourceId: "theater6", resourceTitle: "シアター6" },
  { resourceId: "theater7", resourceTitle: "シアター7" },
  { resourceId: "theater8", resourceTitle: "シアター8" },
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

  return (
    <div className={styles.mainContainer}>
      <Calendar
        localizer={localizer}
        events={[]}
        step={1}
        timeslots={5}
        resources={resources}
        resourceTitleAccessor="resourceTitle"
        defaultView={Views.DAY}
        min={minTime} // 動的に設定
        max={maxTime} // 動的に設定
        formats={formats} // 24時間表記に設定
      />
    </div>
  );
}
