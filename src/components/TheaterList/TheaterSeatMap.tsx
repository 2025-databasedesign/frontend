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
                const seatPos: [number, number] = [rowIndex + 1, colIndex + 1];
                const isSelected = selectedSeats.some(
                  ([r, c]) => r === seatPos[0] && c === seatPos[1]
                );

                let className = "seat";
                let content = "";
                let style: React.CSSProperties = {};

                if (cell === 0) {
                  className += " aisle";
                  style.background = "#e0e0e0";
                } else if (cell === 1) {
                  className += " normal";
                  style.background = "#cccccc";
                  const isAtLimit =
                    totalPeople > 0 && selectedSeats.length >= totalPeople;
                  const isDisabled = isAtLimit && !isSelected;

                  if (isSelectable && isSelected) {
                    className += " selected";
                  } else if (isSelectable && isDisabled) {
                    className += " disabled";
                  }
                  content = `${colIndex + 1}`;
                } else if (cell === 2 || cell === 3) {
                  className += " aisle";
                  style.background = "#333333";
                } else {
                  className += " unknown";
                }

                return (
                    <div
                    key={colIndex}
                    className={className}
                    style={{
                      ...style,
                      ...(isSelectable && cell === 1 ? { cursor: "pointer" } : {}),
                      ...(isSelectable && isSelected ? { background: "#4caf50", color: "#fff" } : {}),
                    }}
                    onClick={() => {
                      if (
                      !isSelectable ||
                      cell !== 1 ||
                      (totalPeople > 0 &&
                        selectedSeats.length >= totalPeople &&
                        !isSelected)
                      )
                      return;

                      toggleSeat(rowIndex, colIndex);
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
