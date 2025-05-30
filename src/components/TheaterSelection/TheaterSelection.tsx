import React, { useEffect } from "react";
import { useState } from "react";
import "./TheaterSelection.css";
import { TheaterInSchedule } from "../../types/ScheduleRelatedType";
import { getTheatersInfo } from "../../utils/scheduleRelatedUtils";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
// import { useCinemaRelatedStore } from "../../stores/CinemaRelatedStore";
import checkIcon from "../../assets/image/check.png";

const TheaterSelection: React.FC = () => {
  const [theaters, setTheaters] = useState<TheaterInSchedule[]>([]);
  const selectedTheater = useScheduleRelatedStore(
    (state) => state.selectedTheater
  );
  const setSelectedTheater = useScheduleRelatedStore(
    (state) => state.setSelectedTheater
  );
  const setSelectedMovie = useScheduleRelatedStore(
    (state) => state.setSelectedMovie
  );

  // const {theaterList, setMovieList} = useCinemaRelatedStore();

  //mock data
  useEffect(() => {
    const fetchTheaters = async () => {
      const data = await getTheatersInfo();
      if (data) {
        setTheaters(data);
      }
    };
    fetchTheaters();
    setSelectedMovie(null);
  }, [setSelectedMovie]);

  //찐 api
  // useEffect(() => {
  //   const fetchTheaters = async () => {
  //     try {
  //       const res = await fetch("http://54.180.117.246/api/theaters");
  //       const resData = await res.json();
  //       setTheaterList(resData.data);
  //     } catch (err) {
  //       console.log("Error fetching theaters: ", err);
  //     }
  //   };
  //   fetchTheaters();
  //   setSelectedMovie(null);
  // }, [setTheaterList]);

  return (
    <div className="location-selection">
      <ul>
        {/* {theaterList.map((theater, id) => ( */}
        {theaters.map((theater, id) => (
          <li key={id}>
            <a
              href="#none"
              onClick={() => setSelectedTheater(theater.theaterName)}
              className={
                selectedTheater === theater.theaterName ? "selected" : ""
              }
            >
              <span>{theater.theaterName}</span>
              <img
                src={checkIcon}
                className={`check ${
                  selectedTheater === theater.theaterName ? "selected" : ""
                }`}
                alt={theater.theaterName}
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TheaterSelection;
