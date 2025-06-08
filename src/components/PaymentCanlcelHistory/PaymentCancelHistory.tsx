import React from "react";
import "./PaymentCancelHistory.css";
import { useReservationHistoryStore } from "../../stores/ReservationHistoryStore";
import {
  getPaymentMethod,
  getPeopleDisplay,
  getSeatDisplay,
} from "../../utils/paymentUtils";
import { getWeekday } from "../../utils/scheduleRelatedUtils";

const PaymentCancelHistory: React.FC = () => {
  const cancelHistory = useReservationHistoryStore(
    (state) => state.cancelHistory
  );
  const deleteCancelHistory = useReservationHistoryStore(
    (state) => state.deleteCancelHistory
  );
  return (
    <div className="payment-cancel-history-main">
      <div className="title">My 취소내역</div>
      {cancelHistory.length == 0 ? (
        <p>취소 내역이 없습니다.</p>
      ) : (
        <div className="history-wrapper">
          <div className="total">
            총 <span>{cancelHistory.length}</span> 건
          </div>
          <div className="history-main-wrapper">
            {cancelHistory.map((cancelation, index) => (
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
                      <div className="movie-title">
                        <img src={`${cancelation.grade}`} />
                        {cancelation.movie}
                      </div>
                      <div className="theater-format">
                        {cancelation.theater} ({cancelation.format})
                      </div>
                      <div className="date-and-time">
                        {cancelation.date}({getWeekday(cancelation.date)}){" "}
                        {cancelation.screenTime?.[0]}
                      </div>
                      <div className="people-info">
                        <div className="seat-info">
                          {getSeatDisplay(cancelation.seats)}
                        </div>
                        <div className="people-type">
                          {getPeopleDisplay(cancelation.selectedPeople)}
                        </div>
                      </div>
                    </div>
                    <div className="cancel-money-area">
                      <div className="cancel-date">
                        취소날짜: <span>
                          {cancelation.cancelDate}(
                          {getWeekday(cancelation.cancelDate)})
                        </span>
                      </div>
                      <div className="money-info">
                        <div className="payment-amount">
                          -{cancelation.cancelPayAmount.toLocaleString()}원
                        </div>
                        <div className="payment-method">
                          {getPaymentMethod(cancelation.cancelPayMethod)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bottom">
                  <button
                    className="cancel-history-delete"
                    onClick={() => deleteCancelHistory(cancelation.id)}
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

export default PaymentCancelHistory;
