import React from "react";
import "./TheaterSeatMap.css";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";

interface TheaterSeatMapProps {
  theaterNumber: number;
  layout: number[][];
  isSelectable: boolean;
}

const TheaterSeatMap: React.FC<TheaterSeatMapProps> = ({
  layout,
  isSelectable,
}) => {
  const { selectedPeople, selectedSeats, setSelectedSeats } =
    useScheduleRelatedStore();
  const totalPeople =
    selectedPeople.adult +
    selectedPeople.teen +
    selectedPeople.senior +
    selectedPeople.kid +
    selectedPeople.disabled;

  const getRowLabel = (index: number): string =>
    String.fromCharCode(65 + index);

  function toggleSeat(rowIndex: number, colIndex: number) {
    const seatPos: [number, number] = [rowIndex + 1, colIndex + 1];

    const exists = selectedSeats.some(
      ([r, c]) => r === seatPos[0] && c === seatPos[1]
    );

    if (exists) {
      setSelectedSeats(
        selectedSeats.filter(
          ([r, c]) => !(r === seatPos[0] && c === seatPos[1])
        )
      );
    } else {
      if (selectedSeats.length >= totalPeople) return;
      setSelectedSeats([...selectedSeats, seatPos]);
    }
  }

  return (
    <div className="theater-layout">
      <div className="seat-map">
        <div className="screen">SCREEN</div>
        <div className="seats">
          {layout.map((row, rowIndex) => (
            <div key={rowIndex} className="seat-row">
              <div className="row-label">{getRowLabel(rowIndex)}</div>
              {row.map((cell, colIndex) => {
                const isSeat = cell === 1;
                const seatPos: [number, number] = [rowIndex + 1, colIndex + 1];
                const isSelected = selectedSeats.some(
                  ([r, c]) => r === seatPos[0] && c === seatPos[1]
                );

                let className = "seat";
                let content = "";

                if (cell === 0) className += " aisle";
                else if (cell === 1) {
                  const isAtLimit =
                    totalPeople > 0 && selectedSeats.length >= totalPeople;
                  const isDisabled = isAtLimit && !isSelected;

                  className += " normal";
                  if (isSelectable && isSelected) {
                    className += " selected";
                  } else if (isSelectable && isDisabled) {
                    className += " disabled";
                  }
                  content = `${colIndex + 1}`;
                } else if (cell == 2) {
                  className += " aisle";
                  // className += " door";
                  // content = "🚪";
                } else if (cell == 3) {
                  className += " aisle";
                  // className += " extinguisher";
                  // content = "🧯";
                } else {
                  className += " unknown";
                }

                // switch (cell) {
                //   case 0:
                //     className += " aisle";
                //     break;
                //   case 1:
                //     className += " normal";
                //     content = `${colIndex + 1}`;
                //     break;
                //   case 2:
                //     className += " aisle";
                //     // className += " door";
                //     // content = "🚪";
                //     break;
                //   case 3:
                //     className += " aisle";
                //     // className += " extinguisher";
                //     // content = "🧯";
                //     break;
                //   default:
                //     className += " unknown";
                //     break;
                // }

                return (
                  <div
                    key={colIndex}
                    className={className}
                    style={isSelectable ? { cursor: "pointer" } : undefined}
                    onClick={() => {
                      if (
                        !isSelectable ||
                        (totalPeople > 0 &&
                          selectedSeats.length >= totalPeople &&
                          !isSelected)
                      )
                        return;

                      if (isSeat) toggleSeat(rowIndex, colIndex);
                    }}
                  >
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
