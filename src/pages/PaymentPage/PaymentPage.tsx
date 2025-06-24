import React, { useEffect, useState } from "react";
import "./PaymentPage.css";
import Navbar from "../../components/Navbar";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import { getGrade, getWeekday } from "../../utils/scheduleRelatedUtils";
import {
  getPeopleDisplay,
  getPeoplePrices,
  getSeatDisplay,
  getTotalPrice,
} from "../../utils/paymentUtils";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes/AppRoutes";
import { usePaymentRelatedStore } from "../../stores/PaymentRelatedStore";
import { isTokenValid } from "../../utils/authUtils";
import { useReservationHistoryStore } from "../../stores/ReservationHistoryStore";
import { useUserStore } from "../../stores/UserRelatedStore";

const PaymentPage: React.FC = () => {
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
  const selectedSeats = useScheduleRelatedStore((state) => state.selectedSeats);
  const setReservationTime = useScheduleRelatedStore(
    (state) => state.setReservationTime
  );
  const selectedScreenId = useScheduleRelatedStore(
    (state) => state.selectedScreenId
  );

  const payMethod = usePaymentRelatedStore((state) => state.payMethod);
  const setPayMethod = usePaymentRelatedStore((state) => state.setPayMethod);

  const setPaymentAmount = usePaymentRelatedStore(
    (state) => state.setPaymentAmount
  );
  const setHasPaid = usePaymentRelatedStore((state) => state.setHasPaid);

  // ------------------------- Access store

  const [discount, setDiscount] = useState("");
  const discountPrice = 0;

  const peopleDisplay = getPeopleDisplay(selectedPeople);
  const seatDisplay = getSeatDisplay(selectedSeats);
  const peoplePrices = getPeoplePrices(selectedPeople);
  const totalPrice = getTotalPrice(selectedPeople);
  const finalAmount = totalPrice - discountPrice;

  function handlePayment() {
    if (!payMethod) {
      alert("결제 먼저 해주세요.");
    }
    if (isTokenValid() && payMethod) {
      const seatNumbers = selectedSeats.map(([rowIdx, colIdx]) => {
        const rowLetter = String.fromCharCode("A".charCodeAt(0) + (rowIdx - 1));
        const colNumber = colIdx.toString();
        return `${rowLetter}${colNumber}`;
      });

      let reservationId = "";

      fetch("http://54.180.117.246/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
        body: JSON.stringify({
          scheduleId: selectedScreenId || 0,
          seatNumbers,
          totalPrice: finalAmount,
          seatCount: seatNumbers.length,
          reserveAt: new Date().toISOString(),
          movieTitle: selectedMovie,
          theaterName: selectedTheater,
          paymentMethod: payMethod,
          // newShowTime: selectedScreenTime?.[3] || "",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.result) {
            alert("예매 실패: " + (data.message || "알 수 없는 오류"));
            throw new Error(data.message);
          }
          console.log(data.data.reservationId);
          reservationId = data.data.reservationId;

          const dateTime = new Date().toISOString();
          setPaymentAmount(finalAmount);
          setHasPaid(true);
          setReservationTime(dateTime);
          useUserStore
            .getState()
            .setBalance(useUserStore.getState().balance - finalAmount);

          const newReservation = {
            id: reservationId,
            date: selectedDate,
            theater: selectedTheater,
            movie: selectedMovie,
            grade: selectedGrade,
            format: selectedFormat,
            screenTime: selectedScreenTime,
            selectedPeople: selectedPeople,
            seats: selectedSeats,
            payMethod: payMethod,
            paymentAmount: finalAmount,
            reservationDate: dateTime,
          };
          console.log("New Reservation:", newReservation);
          useReservationHistoryStore.getState().addReservation(newReservation);
          navigate(AppRoutes.TICKET_PAGE);
        })
        .catch((err) => {
          alert("예매 요청 중 오류가 발생했습니다.");
          throw err;
        });
    } else {
      localStorage.removeItem("schedule-storage");
    }
  }

  useEffect(() => {
    usePaymentRelatedStore.getState().resetState();
    if (!selectedScreenTime) {
      alert("스케쥴 먼저 선택하세요.");
      navigate(AppRoutes.RESERVATION_PAGE, { replace: true });
    } else if (selectedSeats.length === 0) {
      alert("좌석 먼저 선택하세요.");
      navigate(AppRoutes.SEAT_SELECTION_PAGE, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="payment-page">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <div className="payment-page-main">
        <div className="left">
          <div className="area-title">예매정보</div>
          <div className="bottom-left">
            <div className="poster-area">
              <img
                src={
                  useScheduleRelatedStore((state) => state.posterPath) ||
                  "/src/assets/image/no-poster.png"
                }
                alt=""
                className="poster-img"
              />
            </div>
            <div className="schedule-info-area">
              <div className="title-format-grade-area">
                <span>
                  <img src={getGrade(selectedGrade)} alt={`${selectedGrade}`} />
                </span>
                <span>{selectedMovie}</span>
                <span>({selectedFormat})</span>
              </div>
              <div className="date-and-time">
                <span className="date-span">
                  {selectedDate}({getWeekday(selectedDate)})
                </span>
                <span>
                  {selectedScreenTime?.[0]} ~ {selectedScreenTime?.[1]}
                </span>
              </div>
              <div className="theater-info-area">{selectedTheater}</div>
              <div className="people-area">{peopleDisplay}</div>
              <div className="seat-info-area">{seatDisplay}</div>
            </div>
          </div>
        </div>
        <div className="middle">
          <div className="area-title">결제수단</div>
          <div className="bottom-middle">
            <div className="discount-area">
              <div className="area-label">할인/포인트</div>
              <div className="discount-method-selection">
                <div onClick={() => setDiscount("coupon")}>할인권</div>
                <div onClick={() => setDiscount("point")}>포인트 조회</div>
              </div>
              {discount && (
                <div className="discount-input-area">
                  <label htmlFor="coupon">
                    {discount == "coupon"
                      ? "할인권코드"
                      : discount == "point"
                      ? "포인트"
                      : ""}
                  </label>
                  <input type="text" id="coupon" name="coupon" />
                  <button onClick={() => setDiscount("")}>사용</button>
                </div>
              )}
            </div>
            <div className="payment-method-area">
              <div className="area-label">최종 결제수단</div>
              <div className="payment-method-selection">
                <div
                  onClick={() => setPayMethod("card")}
                  className={`card ${
                    payMethod == "card" ? "selected-method" : ""
                  }`}
                >
                  신용/체크카드
                </div>
                <div
                  onClick={() => setPayMethod("easy")}
                  className={`easy ${
                    payMethod == "easy" ? "selected-method" : ""
                  }`}
                >
                  간편결제
                </div>
                <div
                  onClick={() => setPayMethod("phone")}
                  className={`phone ${
                    payMethod == "phone" ? "selected-method" : ""
                  }`}
                >
                  휴대폰 결제
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="area-title">결제하기</div>
          <div className="bottom-right">
            <div className="payment-details-area">
              <div className="people-money-area">
                <div className="attendies-total-area">
                  {peoplePrices.map((item, idex) => (
                    <div className="attendies-money-wrap" key={idex}>
                      <span>{item.label}</span>
                      <span>{item.price.toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
                <div className="ticket-money-area">
                  <span>상품금액</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="discount-money-area">
                  <span>할인금액</span>
                  <span>-{discountPrice.toLocaleString()}원</span>
                </div>
                <div className="total-payment-area">
                  <span>최종 결제 금액</span>
                  <span>{finalAmount.toLocaleString()}원</span>
                </div>
              </div>
              <button
                className="payment-button"
                onClick={() => handlePayment()}
              >
                결제하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
