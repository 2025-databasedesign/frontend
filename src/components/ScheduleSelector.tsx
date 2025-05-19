import React from "react";
import "./ScheduleSelector.css";
import DateSlider from "./DateSlider";
import ScheduleSelectArea from "./ScheduleSelectArea";
import TheaterSelection from "./TheaterSelection";
import { useScheduleRelatedStore } from "../stores/ScheduleRelatedStore";
import MovieSelection from "./MovieSelection";

const ScheduleSelector: React.FC = () => {
  const today = new Date();
  const formatted = today.toISOString().split("T")[0]; // "2025-05-14"
  //const dayName = today.toLocaleDateString("ko-KR", { weekday: "short" }); //"월", "화"
  const { selectedTheater, scheduleViewType, selectedDate, selectedMovie } =
    useScheduleRelatedStore();
  const weekday = new Date(selectedDate).toLocaleDateString("ko-KR", {
    weekday: "short",
  });

  return (
    <div className="theater-main-container">
      <div className="left-area">
        {scheduleViewType == "theater" ? selectedTheater : selectedMovie}
      </div>
      <div className="right-area">
        {selectedDate ? selectedDate : formatted}({weekday})
      </div>
      {scheduleViewType == "theater" ? (
        <TheaterSelection />
      ) : (
        <MovieSelection />
      )}
      <div className="schedule-selection">
        <DateSlider />
        <div className="schedule-list-wrapper">
          <div className="schedule-list">
            <ScheduleSelectArea />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSelector;
