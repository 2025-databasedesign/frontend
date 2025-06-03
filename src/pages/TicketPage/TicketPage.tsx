import React, { useEffect } from "react";
import "./TicketPage.css";
import { usePaymentRelatedStore } from "../../stores/PaymentRelatedStore";
import Navbar from "../../components/Navbar";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import {
  extractGradeValue,
  getMonthAndDay,
  getWeekday,
} from "../../utils/scheduleRelatedUtils";
import {
  getPaymentMethod,
  getPeoplePrices,
  getSeatSeparately,
} from "../../utils/paymentUtils";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes/AppRoutes";

const TicketPage: React.FC = () => {
  const navigate = useNavigate();
  // ------------------------- Access store
  const paymentAmount = usePaymentRelatedStore((state) => state.paymentAmount);
  const payMethod = usePaymentRelatedStore((state) => state.payMethod);
  const hasPaid = usePaymentRelatedStore((state) => state.hasPaid);

  const selectedMovie = useScheduleRelatedStore((state) => state.selectedMovie);
  const selectedFormat = useScheduleRelatedStore(
    (state) => state.selectedFormat
  );
  const selectedGrade = useScheduleRelatedStore((state) => state.selectedGrade);
  const selectedTheater = useScheduleRelatedStore(
    (state) => state.selectedTheater
  );
  const selectedDate = useScheduleRelatedStore((state) => state.selectedDate);
  const selectedScreenTime = useScheduleRelatedStore(
    (state) => state.selectedScreenTime
  );
  const selectedSeats = useScheduleRelatedStore((state) => state.selectedSeats);
  const selectedPeople = useScheduleRelatedStore(
    (state) => state.selectedPeople
  );
  // ------------------------- Access store

  const seatLabels = getSeatSeparately(selectedSeats);
  const peopleTypes = getPeoplePrices(selectedPeople);

  function handleCancel() {
    if (confirm("취소하시겠습니까?")) {
      if (confirm("되돌이킬 수 없습니다.")) {
        usePaymentRelatedStore.getState().resetState();
        useScheduleRelatedStore.getState().resetState();
        alert("취소 되었습니다.");
        navigate(AppRoutes.HOME);
      }
    }
  }

  useEffect(() => {
    if(!selectedScreenTime) {
      alert("스케쥴 먼저 선택하세요.");
      navigate(AppRoutes.RESERVATION_PAGE, { replace: true });
    } else if (selectedSeats.length === 0) {
      alert("좌석 먼저 선택하세요.");
      navigate(AppRoutes.SEAT_SELECTION_PAGE, { replace: true });
    } else if (!hasPaid) {
      alert("결제 먼저 하세요.");
      navigate(AppRoutes.PAYMENT_PAGE, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ticket-page">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <div className="ticket-page-main">
        <div className="ticket-wrapper">
          <div className="ticket-main-info">
            <div className="ticket-top">
              <div className="ticket-title">TICKET</div>
              <div className="movie-title">
                {selectedMovie} ({selectedFormat})
              </div>
              <div className="grade">
                {extractGradeValue(selectedGrade)}세이상관람가
              </div>
              <div className="theater">{selectedTheater}</div>
            </div>
            <div className="ticket-middle">
              <div className="middle-left">
                <div className="label-area">상영일</div>
                <div className="date-area">
                  {getMonthAndDay(selectedDate)}{" "}
                  <span>({getWeekday(selectedDate)})</span>
                </div>
              </div>
              <div className="middle-right">
                <div className="label-area">상영시간</div>
                <div className="time-area">
                  {selectedScreenTime?.[0]}
                  <span>~{selectedScreenTime?.[1]}</span>
                </div>
              </div>
            </div>
            <div className="ticket-bottom">
              <div className="label-area">좌석</div>
              {/* <div className="seat-area">{getSeatDisplay(selectedSeats)}</div> */}
              <div className="seat-area">
                {seatLabels.map((seat, index) => (
                  <span key={index} className="seat-tag">
                    {seat}
                  </span>
                ))}
              </div>
              <div className="people">
                {peopleTypes.map((people, index) => (
                  <span className="person" key={index}>
                    {people.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="payment-info-area">
            <div className="payment-amount">
              <div className="label-area">결제금액</div>
              <span>{paymentAmount.toLocaleString()}원</span>
            </div>
            <div className="payment-method">
              <div className="label-area">결제수단</div>
              <span>{getPaymentMethod(payMethod)}</span>
            </div>
          </div>
          <button className="cancel" onClick={() => handleCancel()}>
            예매취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
