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
import {
  useScheduleRelatedStore,
  PeopleCount,
} from "../../stores/ScheduleRelatedStore";
import { usePaymentRelatedStore } from "../../stores/PaymentRelatedStore";
import { useEffect } from "react";
import { useState } from "react";
import { useUserStore } from "../../stores/UserRelatedStore";

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

  // const [reservationHistory, setReservationHistory] = useState<ReservationType[]>([]);

  // useEffect(() => {
  //   const fetchReservationHistory = async () => {
  //     const token = localStorage.getItem("access_token");
  //     try {
  //       const response = await fetch("http://54.180.117.246/api/reservations/mine", {
  //         headers: {
  //           Authorization: token ? `Bearer ${token}` : "",
  //         },
  //       });
  //       if (!response.ok) throw new Error("Failed to fetch reservation history");
  //       const data = await response.json();
  //       setReservationHistory(data.data);
  //     } catch (error) {
  //       console.error(error);
  //       setReservationHistory([]);
  //     }
  //   };

  //   fetchReservationHistory();
  // }, []);

  function handleCancel(reservation: ReservationType) {
    if (isTokenValid()) {
      const cancelReservation = {
        id: reservation.id,
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
          fetch(`http://54.180.117.246/api/reservations/${reservation.id}`, {
            method: "DELETE",
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error(`예약 취소 실패 (status: ${res.status})`);
              }
              return res.json();
            })
            .then((data) => {
              fetch(
                `http://54.180.117.246/api/users/${encodeURIComponent(
                  useUserStore.getState().userEmail
                )}/charge?amount=${reservation.paymentAmount}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                      "access_token"
                    )}`,
                  },
                }
              )
                .then((res) => res.json())
                .then((data) => {
                  useUserStore
                    .getState()
                    .setBalance(
                      useUserStore.getState().balance +
                        reservation.paymentAmount
                    );
                  if (!data.result) {
                    alert(
                      `포인트 충전 실패: ${data.message || "알 수 없는 오류"}`
                    );
                  }
                })
                .catch((err) => {
                  console.error(err);
                  alert("포인트 충전 중 오류가 발생했습니다.");
                });

              if (data.result) {
                // 상태 수정
                useReservationHistoryStore
                  .getState()
                  .addCancelHistory(cancelReservation);
                useReservationHistoryStore
                  .getState()
                  .deleteReservation(reservation.id);
                usePaymentRelatedStore.getState().resetState();
                useScheduleRelatedStore.getState().resetState();

                alert("취소 되었습니다.");

                navigate(AppRoutes.HOME);
              } else {
                alert(`취소 실패: ${data.message}`);
              }
            })
            .catch((error) => {
              console.error(error);
              alert(`취소 중 오류가 발생했습니다.`);
            });
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
            {reservationHistory.map((reservation, index) => {
              const [posterPath, setPosterPath] = useState<string>("");

              useEffect(() => {
                if (reservation.movie) {
                  fetch(
                    `http://54.180.117.246/api/movies/posterPath?title=${encodeURIComponent(
                      reservation.movie
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
                            : ""
                        );
                      }
                    })
                    .catch(() => setPosterPath("/src/assets/movie1.jpg"));
                }
              }, [reservation.movie]);

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
                        <div
                          className="movie-title"
                          onClick={() => {
                            if (reservation.movie != null) {
                              handleNavigateReview(reservation.movie);
                            }
                          }}
                        >
                          <img
                            src={
                              reservation.grade === "15"
                                ? "/src/assets/grade_15.png"
                                : reservation.grade === "19"
                                ? "/src/assets/grade_19.png"
                                : "/src/assets/grade_all.png"
                            }
                          />
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
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
