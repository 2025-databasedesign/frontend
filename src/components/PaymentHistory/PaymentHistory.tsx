import React from "react";
import "./PaymentHistory.css";
import {
  ReservationType,
  useReservationHistoryStore,
} from "../../stores/ReservationHistoryStore";
import { getTodayDay, getWeekday } from "../../utils/scheduleRelatedUtils";
import {
  getPaymentMethod,
  getPeopleDisplay,
  getSeatDisplay,
} from "../../utils/paymentUtils";
import { isTokenValid } from "../../utils/authUtils";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes/AppRoutes";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import { usePaymentRelatedStore } from "../../stores/PaymentRelatedStore";

const PaymentHistory: React.FC = () => {
  const navigate = useNavigate();
  // ------------------------- Access store
  const reservationHistory = useReservationHistoryStore(
    (state) => state.reservationHistory
  );
  const deleteReservation = useReservationHistoryStore(
    (state) => state.deleteReservation
  );
  // ------------------------- Access store

  function handleCancel(reservation: ReservationType) {
    if (isTokenValid()) {
      const cancelReservation = {
        id:
          reservation.date +
          reservation.screenTime +
          reservation.seats +
          getTodayDay(),
        date: reservation.date,
        theater: reservation.theater,
        movie: reservation.movie,
        grade: reservation.grade,
        format: reservation.format,
        screenTime: reservation.screenTime,
        selectedPeople: reservation.selectedPeople,
        seats: reservation.seats,
        cancelDate: getTodayDay(),
        reservationDate: reservation.reservationDate,
        cancelPayMethod: reservation.payMethod,
        cancelPayAmount: reservation.paymentAmount,
      };

      if (confirm("취소하시겠습니까?")) {
        if (confirm("되돌이킬 수 없습니다.")) {
          useReservationHistoryStore
            .getState()
            .addCancelHistory(cancelReservation);
          useReservationHistoryStore
            .getState()
            .deleteReservation(reservation.id);
          usePaymentRelatedStore.getState().resetState();
          useScheduleRelatedStore.getState().resetState();
          alert("취소 되었습니다.");
        }
      }
    } else {
      alert("다시 로그인한 후 진행해주세요.");
      navigate(AppRoutes.LOGIN_PAGE);
    }
  }

  function handleNavigateReview(movie: string) {
    const encodedName = encodeURIComponent(movie); // URL에 안전하게 포함되도록 인코딩
    navigate(`/movies/${encodedName}`);
  }

  return (
    <div className="payment-history-main">
      <div className="title">My 예매내역</div>

      {reservationHistory.length == 0 ? (
        <p>예매 내역이 없습니다.</p>
      ) : (
        <div className="history-wrapper">
          <div className="total">
            총 <span>{reservationHistory.length}</span> 건
          </div>
          <div className="history-main-wrapper">
            {reservationHistory.map((reservation, index) => (
              <div className="history-main" key={index}>
                <div className="top">
                  <div className="top-left">
                    <img
                      src="/src/assets/movie1.jpg"
                      alt="영화포스터"
                      className="poster"
                    />
                  </div>
                  <div className="top-right">
                    <div className="schedule-info">
                      <div
                        className="movie-title"
                        onClick={() => {
                          if (reservation.movie != null) {
                            handleNavigateReview(reservation.movie);
                          }
                        }}
                      >
                        <img src={`${reservation.grade}`} />
                        {reservation.movie}
                      </div>
                      <div className="theater-format">
                        {reservation.theater} ({reservation.format})
                      </div>
                      <div className="date-and-time">
                        {reservation.date}({getWeekday(reservation.date)}){" "}
                        {reservation.screenTime?.[0]}
                      </div>
                    </div>
                    <div className="people-money-area">
                      <div className="people-info">
                        <div className="seat-info">
                          {getSeatDisplay(reservation.seats)}
                        </div>
                        <div className="people-type">
                          {getPeopleDisplay(reservation.selectedPeople)}
                        </div>
                      </div>
                      <div className="money-info">
                        <div className="payment-amount">
                          {reservation.paymentAmount.toLocaleString()}원
                        </div>
                        <div className="payment-method">
                          {getPaymentMethod(reservation.payMethod)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bottom">
                  <button
                    className="bottom-left"
                    onClick={() => {
                      if (reservation.movie != null) {
                        handleNavigateReview(reservation.movie);
                      }
                    }}
                  >
                    관람평쓰기
                  </button>
                  <button
                    className="bottom-middle-cancel"
                    onClick={() => handleCancel(reservation)}
                  >
                    예매취소
                  </button>
                  <button
                    className="bottom-right-delete"
                    onClick={() => deleteReservation(reservation.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
