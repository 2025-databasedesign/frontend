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
            {cancelHistory.map((cancelation, index) => {
              const [posterPath, setPosterPath] = React.useState<string>("");

              React.useEffect(() => {
                if (cancelation.movie) {
                  fetch(
                    `http://54.180.117.246/api/movies/posterPath?title=${encodeURIComponent(
                      cancelation.movie
                    )}`
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.result && data.data) {
                        setPosterPath(
                          data.data
                            ? `http://54.180.117.246${data.data.replace(
                                /^\/images\/posters\//,
                                "/Images/"
                              )}`
                            : "/src/assets/movie1.jpg"
                        );
                        console.log("Poster Path:", data);
                      }
                    })
                    .catch(() => setPosterPath("/src/assets/movie1.jpg"));
                }
              }, [cancelation.movie]);

              return (
                <div className="history-main" key={index}>
                  <div className="top">
                    <div className="top-left">
                      <img
                        src={posterPath}
                        alt="영화포스터"
                        className="poster"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/src/assets/movie1.jpg";
                        }}
                      />
                    </div>
                    <div className="top-right">
                      <div className="schedule-info">
                        <div className="movie-title">
                          <img
                            src={
                              cancelation.grade === "15"
                                ? "/src/assets/grade_15.png"
                                : cancelation.grade === "19"
                                ? "/src/assets/grade_19.png"
                                : "/src/assets/grade_all.png"
                            }
                          />
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
                          취소날짜:{" "}
                          <span>
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
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentCancelHistory;
