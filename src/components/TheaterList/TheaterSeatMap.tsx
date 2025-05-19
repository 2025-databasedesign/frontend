import React from "react";
import "./TheaterSeatMap.css";

interface TheaterSeatMapProps {
  theaterNumber: number;
  layout: number[][];
}

const TheaterSeatMap: React.FC<TheaterSeatMapProps> = ({ layout }) => {
  const getRowLabel = (index: number): string =>
    String.fromCharCode(65 + index);

  return (
    <div className="theater-layout">
      <div className="seat-map">
        <div className="screen">SCREEN</div>
        <div className="seats">
          {layout.map((row, rowIndex) => (
            <div key={rowIndex} className="seat-row">
              <div className="row-label">{getRowLabel(rowIndex)}</div>
              {row.map((cell, colIndex) => {
                let className = "seat";
                let content = "";

                switch (cell) {
                  case 0:
                    className += " aisle";
                    break;
                  case 1:
                    className += " normal";
                    content = `${colIndex + 1}`;
                    break;
                  case 2:
                    className += " aisle";
                    // className += " door";
                    // content = "🚪";
                    break;
                  case 3:
                    className += " aisle";
                    // className += " extinguisher";
                    // content = "🧯";
                    break;
                  default:
                    className += " unknown";
                    break;
                }

                return (
                  <div key={colIndex} className={className}>
                    {content}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheaterSeatMap;
