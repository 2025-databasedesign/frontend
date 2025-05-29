import React, { useEffect, useState } from "react";
import "./TheaterSelection.css";
import { TheaterInSchedule } from "../../types/ScheduleRelatedType";
import { getTheatersInfo } from "../../utils/scheduleRelatedUtils";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import checkIcon from "../../assets/image/check.png";

const TheaterSelection: React.FC = () => {
  const [theaters, setTheaters] = useState<TheaterInSchedule[]>([]);
  const { selectedTheater, setSelectedTheater, setSelectedMovie } =
    useScheduleRelatedStore();

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

  return (
    <div className="location-selection">
      <ul>
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
