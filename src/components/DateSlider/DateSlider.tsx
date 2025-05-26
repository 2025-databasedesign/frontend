import React, { useRef, useState } from "react";
import "./DateSlider.css";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import { mockDateList } from "../../utils/scheduleRelatedUtils";

const DateSlider: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [chosenDateIndex, setChosenDateIndex] = useState<number | null>(0);
  const { setSelectedDate } = useScheduleRelatedStore();
  // const dates = getDaysWithWeekday(40); //will use later when fetch real api
  //mock dateList

  function handleNext() {
    const slider = sliderRef.current;
    if (!slider) return;

    const widthItem = slider.querySelector(".date-area")?.clientWidth || 0;
    //check if we are at the end, 12 in below is margin
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 12) {
      //if at the end, go to the first item in the slider
      slider.scrollLeft = 0;
    } else {
      slider.scrollLeft += widthItem + 64 * 6; //64px is margin
    }
  }

  function handlePrev() {
    const slider = sliderRef.current;
    if (!slider) return;

    const widthItem = slider.querySelector(".date-area")?.clientWidth || 0;
    const totalItems = slider.querySelectorAll(".date-area").length;
    //check if we are at the start
    if (slider.scrollLeft <= 20) {
      //if at the start, go to the last item in the slider ; 20: because sometimes there’s a slight margin.
      slider.scrollLeft = (widthItem + 64) * (totalItems - 1); //jump to the last item, 64 is margin
    } else {
      slider.scrollLeft -= widthItem + 64 * 6; //64px is margin, 7: 7 days
    }
  }

  return (
    <div className="time-slider-wrapper">
      <div className="time-slider" ref={sliderRef}>
        <div className="date-area-wrapper">
          {/* will use below line later with real api */}
          {/* {dates.map((dateInfo, index) => ( */}
          {mockDateList.map((dateInfo, index) => (
            <div className="date-area" key={index}>
              {(index == 0 || dateInfo.day == 1) && (
                <div className="month">{dateInfo.month}월</div>
              )}
              <div
                className={`main-date ${
                  dateInfo.weekday == "토"
                    ? "date-choose-sat"
                    : dateInfo.weekday == "일"
                    ? "date-choose-sun"
                    : ""
                }`}
                onClick={() => {
                  setChosenDateIndex(index);
                  setSelectedDate(dateInfo.date);
                }}
              >
                <div
                  className={`day ${
                    chosenDateIndex == index ? "choose-date" : ""
                  }`}
                >
                  {dateInfo.day}
                </div>
                <div className="date">
                  {index == 0 ? "오늘" : dateInfo.weekday}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="date-arrows-area">
          <div className="left-arrow" onClick={handlePrev}>
            ‹
          </div>
          <div className="right-arrow" onClick={handleNext}>
            ›
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateSlider;
