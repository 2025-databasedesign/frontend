import React, { useEffect, useState } from "react";
import "./ScheduleSelectArea.css";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import {
  FullSchedule,
  fullScheduleProps,
  TheaterInSchedule,
} from "../../types/scheduleRelatedType";
// import { getfullSchedule } from "../../utils/scheduleRelatedUtils";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes/AppRoutes";
import { EMPTY_PEOPLE_COUNT } from "../../utils/constant";
import { getGrade } from "../../utils/scheduleRelatedUtils";
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
  const setSelectedScreenId = useScheduleRelatedStore(
    (state) => state.setSelectedScreenId
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
    format: string,
    scheduleId: number
  ) {
    setSelectedScreenTime([startTime, endTime]);
    setSelectedTheater(theaterName);
    setSelectedMovie(movieName);
    setSelectedScreenId(scheduleId);
    setSelectedGrade(grade);
    setSelectedFormat(format);
    setSelectedPeople(EMPTY_PEOPLE_COUNT);
    setSelectedSeats([]);
    navigate(AppRoutes.SEAT_SELECTION_PAGE);
  }

  useEffect(() => {
    const fetchFullSchedule = async () => {
      if (!selectedDate) return;
      try {
        const response = await fetch(
          `http://54.180.117.246/api/schedules/${selectedDate}`
        );
        const result = await response.json();
        if (result?.result && result?.data?.schedules) {
          // 날짜를 selectedDate로 강제 세팅 (mock)
          const fullScheduleData: FullSchedule = {
            date: selectedDate, // <- 여기!
            schedules: result.data.schedules.map(
              (movie: fullScheduleProps) => ({
                movieId: movie.movieId,
                movieName: movie.movieName ?? "",
                durationMinutes: movie.durationMinutes ?? 0,
                grade: movie.grade ?? "",
                theaters: (movie.theaters ?? []).map(
                  (theater: TheaterInSchedule) => ({
                    theaterId: theater.theaterId,
                    theaterName: theater.theaterName,
                    format: theater.format,
                    subDub: theater.subDub ?? null,
                    availSeat: theater.availSeat ?? 0,
                    totalSeat: theater.totalSeat ?? 0,
                    startTimes: theater.startTimes ?? [],
                    endTimes: theater.endTimes ?? [],
                    scheduleIds: theater.scheduleIds ?? [], // Add this line to map scheduleIds if available
                  })
                ),
              })
            ),
          };
          setFullSchedule([fullScheduleData]);
          console.log(fullScheduleData);
        } else {
          setFullSchedule([]);
        }
      } catch (error) {
        setFullSchedule([]);
        console.log("Error: " + error);
      }
    };
    fetchFullSchedule();
  }, [selectedDate]);

  return (
    <div className="schedule-select-area">
      {filteredSchedules.map((groupTime, index1) => (
        <div className="group-time-select" key={index1}>
          <div className="movie-info-area">
            <img src={getGrade(groupTime.grade)} />
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
                              // scheduleId를 찾기 위해 theaters 배열에서 해당 startTime과 endTime이 일치하는 객체를 찾음
                              const scheduleId =
                                theater.scheduleIds &&
                                theater.scheduleIds[index3]
                                  ? theater.scheduleIds[index3]
                                  : undefined;
                              handleSelectSchedule(
                                theater.startTimes[index3],
                                theater.endTimes[index3],
                                theater.theaterName,
                                groupTime.movieName,
                                groupTime.grade,
                                theater.format,
                                scheduleId
                              );
                            }}
                          >
                            <div className="start-time">{time}</div>
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
