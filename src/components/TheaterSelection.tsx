import React, { useEffect, useState } from "react";
import { useScheduleRelatedStore } from "../stores/ScheduleRelatedStore";
import "./TheaterSelection.css";
import { getTheatersInfo } from "../utils/scheduleRelatedUtils";
import { TheaterInSchedule } from "../types/ScheduleRelatedType";


const TheaterSelection: React.FC = () => {
  const [theaters, setTheaters] = useState<TheaterInSchedule[]>([]);
  const { setSelectedTheater, setSelectedMovie } = useScheduleRelatedStore();


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
            >
              {theater.theaterName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TheaterSelection;
