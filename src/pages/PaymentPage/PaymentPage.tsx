import React, { useEffect, useState } from "react";
import "./PaymentPage.css";
import Navbar from "../../components/Navbar";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import { getWeekday } from "../../utils/scheduleRelatedUtils";
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

  const payMethod = usePaymentRelatedStore((state) => state.payMethod);
  const setPayMethod = usePaymentRelatedStore((state) => state.setPayMethod);
  
  const setPaymentAmount = usePaymentRelatedStore((state) => state.setPaymentAmount);
  const setHasPaid = usePaymentRelatedStore((state) => state.setHasPaid);

  // ------------------------- Access store

  const [discount, setDiscount] = useState("");
  const discountPrice = 1000;

  const peopleDisplay = getPeopleDisplay(selectedPeople);
  const seatDisplay = getSeatDisplay(selectedSeats);
  const peoplePrices = getPeoplePrices(selectedPeople);
  const totalPrice = getTotalPrice(selectedPeople);

  function handlePayment() {
    if (isTokenValid()) {
      setPaymentAmount((totalPrice - discountPrice));
      setHasPaid(true);
    } else {
      localStorage.removeItem("schedule-storage");
    }
    navigate(AppRoutes.TICKET_PAGE);
  }

  useEffect(() => {
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
                src="/src/assets/movie1.jpg"
                alt=""
                className="poster-image"
              />
            </div>
            <div className="schedule-info-area">
              <div className="title-format-grade-area">
                <span>
                  <img src={`${selectedGrade}`} alt="15" />
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
                  <span>{(totalPrice - discountPrice).toLocaleString()}원</span>
                </div>
              </div>
              <button className="payment-button" onClick={() => handlePayment()}>결제하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
