import React, { useState } from "react";
import "./PaymentPage.css";
import Navbar from "../../components/Navbar";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import { getWeekday } from "../../utils/scheduleRelatedUtils";

const PaymentPage: React.FC = () => {
  const {
    selectedDate,
    selectedTheater,
    selectedMovie,
    selectedGrade,
    selectedFormat,
    selectedScreenTime,
    selectedPeople,
    selectedSeats,
  } = useScheduleRelatedStore();
  const [discount, setDiscount] = useState("");
  const discountPrice = 1000;

  const PEOPLE_LABELS: Record<keyof typeof selectedPeople, string> = {
    adult: "성인",
    teen: "청소년",
    senior: "경로",
    kid: "어린이",
    disabled: "장애인",
  };
  //display "성인 1, 청소년 1"
  const peopleDisplay = Object.entries(selectedPeople)
    .filter(([, count]) => count > 0)
    .map(
      ([key, count]) =>
        `${PEOPLE_LABELS[key as keyof typeof selectedPeople]} ${count}`
    )
    .join(", ");

  //display [1,2] -> A2
  const getRowLabel = (row: number) => String.fromCharCode(64 + row);
  const seatDisplay = selectedSeats
    .map(([row, col]) => `${getRowLabel(row)}${col}`)
    .join(", ");

  const TICKET_PRICES: Record<keyof typeof selectedPeople, number> = {
    adult: 15000,
    teen: 10000,
    senior: 8000,
    kid: 7000,
    disabled: 6000,
  };
  const peoplePrices = Object.entries(selectedPeople)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => ({
      label: `${PEOPLE_LABELS[key as keyof typeof selectedPeople]} ${count}`,
      price: TICKET_PRICES[key as keyof typeof selectedPeople] * count,
    }));
  const totalPrice = peoplePrices.reduce((sum, p) => sum + p.price, 0);

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
                <div>신용/체크카드</div>
                <div>간편결제</div>
                <div>휴대폰 결제</div>
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
              <button className="payment-button">결제하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
