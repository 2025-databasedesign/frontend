import React from "react";
import "./SeatSelectionPage.css";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import TheaterSeatMap from "../../components/TheaterList/TheaterSeatMap";
import theaters from "../../assets/theater_info/mock_seat.json";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes/AppRoutes";
import minusIcon from '../../assets/image/minus-icon.png'
import plusIcon from '../../assets/image/plus-icon.png'

const SeatSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    selectedDate,
    selectedTheater,
    selectedMovie,
    selectedGrade,
    selectedFormat,
    selectedScreenTime,
    selectedPeople,
    setSelectedPeople,
    selectedSeats,
    setSelectedSeats,
  } = useScheduleRelatedStore();

  //delta 1: plus, -1: minus
  function handleCount(target: keyof typeof selectedPeople, delta: 1 | -1) {
    const current = selectedPeople[target];
    const total =
      selectedPeople.adult +
      selectedPeople.teen +
      selectedPeople.senior +
      selectedPeople.kid +
      selectedPeople.disabled;

    if (delta === 1 && total >= 8) return;
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
    const totalPeople =
      selectedPeople.adult +
      selectedPeople.teen +
      selectedPeople.senior +
      selectedPeople.kid +
      selectedPeople.disabled;
    
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
              <div className="adult">
                <span className="title">성인</span>
                <div className="count-area">
                  <button
                    className="minus"
                    onClick={() => handleCount("adult", -1)}
                  >
                    <img src={minusIcon} alt="" className="minus" />
                  </button>
                  <div className="count">{selectedPeople.adult}</div>
                  <button
                    className="plus"
                    onClick={() => handleCount("adult", 1)}
                  >
                    <img src={plusIcon} alt="" className="plus" />
                  </button>
                </div>
              </div>
              <div className="teen">
                <span className="title">청소년</span>
                <div className="count-area">
                  <button
                    className="minus"
                    onClick={() => handleCount("teen", -1)}
                  >
                    <img src={minusIcon} alt="" className="minus" />
                  </button>
                  <div className="count">{selectedPeople.teen}</div>
                  <button
                    className="plus"
                    onClick={() => handleCount("teen", 1)}
                  >
                    <img src={plusIcon} alt="" className="plus" />
                  </button>
                </div>
              </div>
              <div className="senior">
                <span className="title">경로인</span>
                <div className="count-area">
                  <button
                    className="minus"
                    onClick={() => handleCount("senior", -1)}
                  >
                    <img src={minusIcon} alt="" className="minus" />
                  </button>
                  <div className="count">{selectedPeople.senior}</div>
                  <button
                    className="plus"
                    onClick={() => handleCount("senior", 1)}
                  >
                    <img src={plusIcon} alt="" className="plus" />
                  </button>
                </div>
              </div>
              <div className="kid">
                <span className="title">어린이</span>
                <div className="count-area">
                  <button
                    className="minus"
                    onClick={() => handleCount("kid", -1)}
                  >
                    <img src={minusIcon} alt="" className="minus" />
                  </button>
                  <div className="count">{selectedPeople.kid}</div>
                  <button
                    className="plus"
                    onClick={() => handleCount("kid", 1)}
                  >
                    <img src={plusIcon} alt="" className="plus" />
                  </button>
                </div>
              </div>
              <div className="disabled">
                <span className="title">장애인</span>
                <div className="count-area">
                  <button
                    className="minus"
                    onClick={() => handleCount("disabled", -1)}
                  >
                    <img src={minusIcon} alt="" className="minus" />
                  </button>
                  <div className="count">{selectedPeople.disabled}</div>
                  <button
                    className="plus"
                    onClick={() => handleCount("disabled", 1)}
                  >
                    <img src={plusIcon} alt="" className="plus" />
                  </button>
                </div>
              </div>
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
                  <span className="total-number">0</span>원
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
