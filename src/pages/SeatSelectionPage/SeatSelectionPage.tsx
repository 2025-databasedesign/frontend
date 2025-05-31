import React from "react";
import "./SeatSelectionPage.css";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import TheaterSeatMap from "../../components/TheaterList/TheaterSeatMap";
import theaters from "../../assets/theater_info/mock_seat.json";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes/AppRoutes";
import minusIcon from "../../assets/image/minus-icon.png";
import plusIcon from "../../assets/image/plus-icon.png";
import { getTotalPrice } from "../../utils/paymentUtils";
import { extractGradeValue } from "../../utils/scheduleRelatedUtils";

const SeatSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  // ------------------------- Access store
  const selectedDate = useScheduleRelatedStore((state) => state.selectedDate);
  const selectedTheater = useScheduleRelatedStore(
    (state) => state.selectedTheater
  );
  const selectedMovie = useScheduleRelatedStore((state) => state.selectedMovie);
  const selectedGrade = useScheduleRelatedStore((state) => state.selectedGrade);
  const selectedFormat = useScheduleRelatedStore(
    (state) => state.selectedFormat
  );
  const selectedScreenTime = useScheduleRelatedStore(
    (state) => state.selectedScreenTime
  );
  const selectedPeople = useScheduleRelatedStore(
    (state) => state.selectedPeople
  );
  const setSelectedPeople = useScheduleRelatedStore(
    (state) => state.setSelectedPeople
  );
  const selectedSeats = useScheduleRelatedStore((state) => state.selectedSeats);
  const setSelectedSeats = useScheduleRelatedStore(
    (state) => state.setSelectedSeats
  );
  // ------------------------- Access store

  const totalPeople =
    selectedPeople.adult +
    selectedPeople.teen +
    selectedPeople.senior +
    selectedPeople.kid +
    selectedPeople.disabled;

  //delta 1: plus, -1: minus
  function handleCount(target: keyof typeof selectedPeople, delta: 1 | -1) {
    const current = selectedPeople[target];

    if (delta === 1 && totalPeople >= 8) return;
    if (delta === -1 && current === 0) return;

    const newPeople = {
      ...selectedPeople,
      [target]: current + delta,
    };

    const newTotal =
      newPeople.adult +
      newPeople.teen +
      newPeople.senior +
      newPeople.kid +
      newPeople.disabled;

    setSelectedPeople(newPeople);

    // If total seats selected > allowed, trim them from the end
    if (selectedSeats.length > newTotal) {
      setSelectedSeats([]);
    }
  }

  function handleNavigatePayment() {
    if (
      selectedDate &&
      selectedTheater &&
      selectedMovie &&
      selectedScreenTime &&
      selectedPeople &&
      selectedSeats.length == totalPeople
    ) {
      navigate(AppRoutes.PAYMENT_PAGE);
    }
  }

  const totalPrice = getTotalPrice(selectedPeople).toLocaleString();

  const PEOPLE_OPTIONS: {
    key: keyof typeof selectedPeople;
    label: string;
    className: string;
  }[] = [
    { key: "adult", label: "성인", className: "adult" },
    { key: "teen", label: "청소년", className: "teen" },
    { key: "senior", label: "경로인", className: "senior" },
    { key: "kid", label: "어린이", className: "kid" },
    { key: "disabled", label: "장애인", className: "disabled" },
  ];

  const filteredOptions = PEOPLE_OPTIONS.filter(({ key }) => {
    const gradeValue = extractGradeValue(selectedGrade ?? undefined);
    // If movie is 19+, remove teen and kid
    if (gradeValue === "19" && (key === "teen" || key === "kid")) return false;
    if (gradeValue === "15" && key === "kid") return false;
    return true;
  });

  return (
    <div className="seat-select-page">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <div className="seat-select-main">
        <div className="top" style={{ textAlign: "center" }}>
          인원/좌석 선택
        </div>
        <div className="bottom">
          <div className="select-people-wrap">
            <div className="seat-page-movie-info">
              <span className="poster">
                <img
                  src="/src/assets/movie1.jpg"
                  alt=""
                  className="poster-img"
                />
              </span>
              <div className="group-info">
                <div className="title-grade-wrap">
                  <span className="grade">
                    <img
                      src={`${selectedGrade}`}
                      alt=""
                      className="grade-image"
                    />
                  </span>
                  <p className="seat-page-movie-title">
                    {selectedMovie} ({selectedFormat})
                  </p>
                </div>
                <div className="schedule-info">
                  <div className="date-and-time-area">
                    <span className="screen-date">{selectedDate}</span>
                    <span className="time">
                      {selectedScreenTime?.[0]} ~ {selectedScreenTime?.[1]}
                    </span>
                  </div>
                  <div className="theater">
                    <span>{selectedTheater}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="count-wrap">
              {filteredOptions.map(({ key, label, className }) => (
                <div className={className}>
                  <span className="title">{label}</span>
                  <div className="count-area">
                    <button
                      className="minus"
                      onClick={() => handleCount(key, -1)}
                    >
                      <img
                        src={minusIcon}
                        alt="decrease count"
                        className="minus"
                      />
                    </button>
                    <div className="count">{selectedPeople[key]}</div>
                    <button
                      className="plus"
                      onClick={() => handleCount(key, 1)}
                    >
                      <img
                        src={plusIcon}
                        alt="increase count"
                        className="plus"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="seat-view">
            <TheaterSeatMap
              theaterNumber={theaters[0].id}
              layout={theaters[0].layout}
              isSelectable={true}
            />
          </div>
          <div className="money-and-pay-button-area">
            <div className="left-money-area">
              <span className="total-text">
                총 합계{" "}
                <span className="total-money">
                  <span className="total-number">
                    {selectedSeats.length == totalPeople ? totalPrice : 0}
                  </span>
                  원
                </span>
              </span>
            </div>
            <button
              className="right-pay-button"
              onClick={() => handleNavigatePayment()}
            >
              결제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
