import React, { useEffect, useState } from "react";
import "./SeatSelectionPage.css";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import TheaterSeatMap from "../../components/TheaterList/TheaterSeatMap";
// import theaters from "../../assets/theater_info/mock_seat.json";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes/AppRoutes";
import minusIcon from "../../assets/image/minus-icon.png";
import plusIcon from "../../assets/image/plus-icon.png";
import { getTotalPrice } from "../../utils/paymentUtils";
import { extractGradeValue } from "../../utils/scheduleRelatedUtils";

const SeatSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [target, setTarget] = useState("");
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
  const selectedScreenId = useScheduleRelatedStore((state) => state.selectedScreenId);
  const selectedSeats = useScheduleRelatedStore((state) => state.selectedSeats);
  const setSelectedSeats = useScheduleRelatedStore(
    (state) => state.setSelectedSeats
  );

  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  } 
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

  async function handleNavigatePayment() {
    if (selectedSeats.length === 0) {
      alert("좌석을 골라주세요.");
      return;
    }
    if (
      selectedDate &&
      selectedTheater &&
      selectedMovie &&
      selectedScreenId && // 반드시 scheduleId가 있어야 함
      selectedPeople &&
      selectedSeats.length === totalPeople
    ) {
      try {
        const scheduleId = selectedScreenId;
        // selectedSeats: [[rowIndex, colIndex], ...] -> ["C12", "C13", ...]로 변환
        const seatNumbers = selectedSeats.map(([rowIdx, colIdx]) => {
          // rowIdx: 1 -> 'A', 2 -> 'B', ...
          const rowLetter = String.fromCharCode("A".charCodeAt(0) + (rowIdx - 1));
          const colNumber = colIdx.toString();
          return `${rowLetter}${colNumber}`;
        });

        console.log(scheduleId, seatNumbers);

        const response = await fetch("http://54.180.117.246/api/reservations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            scheduleId,
            seatNumbers,
            // 필요하다면 추가 정보도 함께 전달 (예: paymentMethod 등)
          }),
        });
        const data = await response.json();

        if (data?.result) {
          navigate(AppRoutes.PAYMENT_PAGE);
        } else {
          alert("예매에 실패했습니다: " + data?.message);
          return;
        }
      } catch (error: any) {
        alert("예매 중 오류가 발생했습니다.");
        return;
      }
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

  function handleMessage() {
    if (target == "teen") {
      return "청소년 요금은 4세 이상 ~ 19세 미만의 청소년에 한해 적용됩니다.";
    } else if (target == "senior") {
      return "반드시 본인의 신분증(65세 이상)을 소지하신 후 입장해주세요. 미지참 시 입장이 제한됩니다.";
    } else if (target == "disabled"){
      return "반드시 복지카드를 소지하신 후 입장해주세요. 미지참 시 입장이 제한됩니다. (장애의 정도가 심한 장애인: 동반 1인 포함 할인 가능/ 장애 정도가 심하지 않은 장애인: 본인에 한하여 할인 적용)";
    } else {
      return "";
    }
  }

  useEffect(() => {
    if (!selectedMovie || !selectedScreenTime) {
      alert("스케쥴 먼저 선택해주세요");
      navigate(AppRoutes.RESERVATION_PAGE, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="seat-select-page">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <div className="seat-select-main">
        <div className="top" style={{ textAlign: "center" }}>
          인원/좌석 선택
          <span className="max-people" style={{ display: "flex" }}>
            인원은 최대 8명까지 선택 가능합니다
          </span>
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
                <div
                  className={className}
                  onClick={() => {
                    setTarget(key);
                  }}
                  key={key}
                >
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
          <div className="message">
            <span>
              인원을 선택하고 좌석 선택 후 하단에 결제하기 버튼을 클릭하세요
            </span>
            <span className="target-message">
              {handleMessage()}
            </span>
          </div>
            <div className="seat-view">
              {/* 실제 상영일정에 맞는 좌석 정보를 fetch해서 전달 */}
              {/* seatInfo fetch 및 상태 관리 */}
              {(() => {
                const [seatInfo, setSeatInfo] = React.useState<any>(null);
                const [loading, setLoading] = React.useState(false);
                const [error, setError] = React.useState<string | null>(null);

                React.useEffect(() => {
                  if (!selectedScreenId) return;
                  setLoading(true);
                  setError(null);
                  const fetchSeatInfo = async () => {
                    try {
                      const response = await fetch(
                        `http://54.180.117.246/seats/schedules/${selectedScreenId}/seats/status`
                      );
                      const result = await response.json();
                      if (result?.result) {
                        setSeatInfo(result.data); // API 구조에 맞게 가공 필요
                      } else {
                        setSeatInfo(null);
                        setError("좌석 정보를 불러오지 못했습니다.");
                      }
                    } catch (e) {
                      setSeatInfo(null);
                      setError("좌석 정보를 불러오지 못했습니다.");
                    } finally {
                      setLoading(false);
                    }
                  };
                  fetchSeatInfo();
                }, [selectedScreenId]);

                if (loading) return <div>좌석 정보를 불러오는 중...</div>;
                if (error) return <div>{error}</div>;
                if (!seatInfo) return <div>좌석 정보가 없습니다.</div>;

                // seatInfo.seatStatus를 [[1,1,1,...],[1,1,1,...],...] 형태로 변환
                // 예시: seatStatus가 {A1: 1, A2: 1, ..., B1: 1, ...} 형태라면
                // row 기준으로 그룹핑 필요
                function convertSeatStatusToLayout(seatStatus: Record<string, number>) {
                  // 예: A1, A2, ..., B1, B2, ...
                  const rows: Record<string, number[]> = {};
                  Object.entries(seatStatus).forEach(([seat, value]) => {
                    const row = seat.match(/^[A-Z]+/g)?.[0] ?? "";
                    const col = parseInt(seat.replace(/^[A-Z]+/g, ""), 10);
                    if (!rows[row]) rows[row] = [];
                    rows[row][col - 1] = value;
                  });
                  // row 이름 순서대로 정렬
                  const sortedRows = Object.keys(rows).sort();
                  return sortedRows.map((row) => rows[row]);
                }

                const layout = convertSeatStatusToLayout(seatInfo);

                return (
                  <TheaterSeatMap
                  theaterNumber={Number(selectedScreenId)}
                  layout={layout}
                  isSelectable={true}
                  />
                );
              })()}
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
