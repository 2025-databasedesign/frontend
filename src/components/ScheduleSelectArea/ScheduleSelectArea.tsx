import React, { useEffect, useState } from "react";
import "./ScheduleSelectArea.css";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import { FullSchedule } from "../../types/ScheduleRelatedType";
import { getfullSchedule } from "../../utils/scheduleRelatedUtils";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes/AppRoutes";
import { EMPTY_PEOPLE_COUNT } from "../../utils/constant";
// import Grade from "../Grade/Grade";

// const parseGradeNumber = (gradePath: string) => {
//   const match = gradePath.match(/grade_(\d+)\.png$/);
//   return match ? match[1] : "등급 정보 없음";
// };

const ScheduleSelectArea: React.FC = () => {
  const navigate = useNavigate();
  const [fullSchedule, setFullSchedule] = useState<FullSchedule[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  // ------------------------- Access store
  const selectedDate = useScheduleRelatedStore((state) => state.selectedDate);
  const selectedTheater = useScheduleRelatedStore(
    (state) => state.selectedTheater
  );
  const selectedMovie = useScheduleRelatedStore((state) => state.selectedMovie);

  const setSelectedTheater = useScheduleRelatedStore(
    (state) => state.setSelectedTheater
  );
  const setSelectedMovie = useScheduleRelatedStore(
    (state) => state.setSelectedMovie
  );
  const setSelectedGrade = useScheduleRelatedStore(
    (state) => state.setSelectedGrade
  );
  const setSelectedFormat = useScheduleRelatedStore(
    (state) => state.setSelectedFormat
  );
  const setSelectedScreenTime = useScheduleRelatedStore(
    (state) => state.setSelectedScreenTime
  );
  const setSelectedPeople = useScheduleRelatedStore(
    (state) => state.setSelectedPeople
  );
  const setSelectedSeats = useScheduleRelatedStore(
    (state) => state.setSelectedSeats
  );
  // ------------------------- Access store

  //find schedule with selected date
  const scheduleInfo =
    fullSchedule.find((s) => s.date === selectedDate)?.schedules || [];

  //Filter movies to only those with at least one matching theater,
  //if nothing matched, show all movies
  const filteredSchedules = scheduleInfo
    .filter((movie) => !selectedMovie || movie.movieName === selectedMovie)
    .filter((movie) =>
      movie.theaters.some(
        (theater) => !selectedTheater || theater.theaterName === selectedTheater
      )
    );

  function handleSelectSchedule(
    startTime: string,
    endTime: string,
    theaterName: string,
    movieName: string,
    grade: string,
    format: string
  ) {
    setSelectedScreenTime([startTime, endTime]);
    setSelectedTheater(theaterName);
    setSelectedMovie(movieName);
    setSelectedGrade(grade);
    setSelectedFormat(format);
    setSelectedPeople(EMPTY_PEOPLE_COUNT);
    setSelectedSeats([]);
    navigate(AppRoutes.SEAT_SELECTION_PAGE);
  }

  useEffect(() => {
    const fetchFullSchedule = async () => {
      const data = await getfullSchedule();
      if (data) {
        setFullSchedule(data);
      }
    };
    fetchFullSchedule();
  }, []);

  return (
    <div className="schedule-select-area">
      {filteredSchedules.map((groupTime, index1) => (
        <div className="group-time-select" key={index1}>
          <div className="movie-info-area">
            <img src={groupTime.grade} />
            <span className="movie-name">{groupTime.movieName}</span>
          </div>
          <div className="time-select-wrapper">
            {groupTime.theaters
              .filter(
                (theater) =>
                  !selectedTheater || theater.theaterName === selectedTheater
              )
              .map((theater, index2) => (
                <div className="time-select" key={index2}>
                  <div className="hall">
                    <span className="format">{theater.format}</span>
                    {theater.subDub && (
                      <span className="sub-dub">{theater.subDub}</span>
                    )}
                    <span className="hall-name">{theater.theaterName}</span>
                  </div>
                  <div className="main-schedule-area">
                    <ul>
                      {theater.startTimes.map((time, index3) => (
                        <li className="main-schedule" key={index3}>
                          <button
                            data-tooltip={`종료 ${theater.endTimes[index3]}`}
                            className={
                              selectedTime ===
                              `${groupTime.movieName}-${theater.theaterId}-${time}`
                                ? "selected-button"
                                : ""
                            }
                            onClick={() => {
                              setSelectedTime(
                                `${groupTime.movieName}-${theater.theaterId}-${time}`
                              );
                              handleSelectSchedule(
                                theater.startTimes[index3],
                                theater.endTimes[index3],
                                theater.theaterName,
                                groupTime.movieName,
                                groupTime.grade,
                                theater.format
                              );
                            }}
                          >
                            <div className="start-time">{time}</div>
                            <div className="seat-info">
                              <span className="avail-seat">
                                {theater.availSeat}
                              </span>
                              /
                              <span className="total-seat">
                                {theater.totalSeat}
                              </span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
      {filteredSchedules.length === 0 && (
        <p className="no-schedule-avail">
          선택한 조건에 해당하는 상영 일정이 없습니다.
        </p>
      )}
    </div>
  );
};

export default ScheduleSelectArea;
