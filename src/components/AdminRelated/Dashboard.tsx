import React from "react";
import "./Dashboard.css";
import { useEffect, useState } from "react";

const Dashboard: React.FC = () => {
  // const [theaters, setTheaters] = useState<TheaterInSchedule[]>([]);
  // const revenue = 1000000;  //mock data
  // const newUser = 300;  //mock data

  // useEffect(() => {
  //   const fetchTheaters = async () => {
  //     const data = await getTheatersInfo();
  //     if (data) {
  //       setTheaters(data);
  //     }
  //   };
  //   fetchTheaters();
  // }, []);

  type TheaterRevenue = {
    [key: string]: number;
  };

  const [theaterRevenue, setTheaterRevenue] = useState<TheaterRevenue>({});
  const [revenue, setRevenue] = useState<number>(0);

  useEffect(() => {
    const fetchTheaterRevenue = async () => {
      try {
        const res = await fetch("http://54.180.117.246/api/revenue/theater");
        const json = await res.json();
        if (json.result && json.data) {
          setTheaterRevenue(json.data);
          // 매출 합계 계산
          const totalRevenue = Object.values(json.data).reduce(
            (sum: number, v: number) => sum + v,
            0
          );
          setRevenue(totalRevenue);
        }
      } catch (e) {
        // handle error if needed
      }
    };
    fetchTheaterRevenue();
  }, []);

  type MovieRevenue = {
    [key: string]: number;
  };

  const [movieRevenue, setMovieRevenue] = useState<MovieRevenue>({});

  useEffect(() => {
    const fetchMovieRevenue = async () => {
      try {
        const res = await fetch("http://54.180.117.246/api/revenue/movie");
        const json = await res.json();
        if (json.result && json.data) {
          setMovieRevenue(json.data);
        }
      } catch (e) {
        // handle error if needed
      }
    };
    fetchMovieRevenue();
  }, []);

  type DateRevenue = {
    [date: string]: number;
  };

  const [dateRevenue, setDateRevenue] = useState<DateRevenue>({});

  useEffect(() => {
    const fetchDateRevenue = async () => {
      try {
        const res = await fetch("http://54.180.117.246/api/revenue/date");
        const json = await res.json();
        if (json.result && json.data) {
          setDateRevenue(json.data);
        }
      } catch (e) {
        // handle error if needed
      }
    };
    fetchDateRevenue();
  }, []);

  return (
    <div className="dashboard-main">
      <div className="main-overview-top">
        <div className="monthly-sales-area">
          <div className="overview-sub-title">총 매출</div>
          <div className="sales-area">{revenue.toLocaleString()}원</div>
        </div>
        <div className="high-profit-movie-area">
          <div className="overview-sub-title">월 최고 매출 영화</div>
          <div className="sales-area">
            {Object.entries(movieRevenue).length > 0
              ? Object.entries(movieRevenue).reduce((max, curr) =>
                  curr[1] > max[1] ? curr : max
                )[0]
              : "영화 없음"}
          </div>
        </div>
        <div className="high-profit-theater-area">
          <div className="overview-sub-title">월 최고 매출 상영관</div>
          <div className="sales-area">
            {Object.entries(theaterRevenue).length > 0
              ? Object.entries(theaterRevenue).reduce((max, curr) =>
                  curr[1] > max[1] ? curr : max
                )[0]
              : "상영관 없음"}
          </div>
        </div>
        {/* <div className="new-user-area">
          <div className="overview-sub-title">새 회원 수</div>
          <div className="sales-area">+{newUser.toLocaleString()}명</div>
        </div> */}
      </div>
      <div className="main-overview-bottom">
        <div className="left-chart">
          {/* column chart */}
          <div className="theater-sales-area chart">
            <table className="charts-css column show-labels show-heading show-primary-axis show-5-secondary-axes show-data-axes data-spacing-5">
              <caption> 영화관별 월 매출 </caption>
              <tbody>
                {Object.entries(theaterRevenue)
                  .reverse()
                  .map(([theaterName, revenue], idx) => {
                    const maxRevenue = Math.max(
                      ...Object.values(theaterRevenue),
                      1
                    );
                    const size = revenue / maxRevenue;
                    return (
                      <tr key={theaterName}>
                        <th scope="row">{theaterName}</th>
                        <td
                          style={
                            { "--size": size.toFixed(2) } as React.CSSProperties
                          }
                        >
                          <span className="data">{revenue}</span>
                          <span className="tooltip">{revenue} 원</span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <div className="data-axis-1"> 매출 </div>
          </div>

          {/* side bar chart */}
          <div
            className="movie-sales-area chart"
            style={{
              maxHeight: 300,
              overflowY: "auto",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px #0001",
              padding: 16,
            }}
          >
            <table
              className="charts-css bar movie-chart show-heading show-labels show-primary-axis show-data-axes data-spacing-2"
              style={{ width: "100%", minWidth: 320 }}
            >
              <caption
                style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}
              >
                영화별 매출
              </caption>
              <tbody>
                {Object.entries(movieRevenue)
                  .sort((a, b) => b[1] - a[1])
                  .map(([movieName, revenue], idx) => {
                    const maxRevenue = Math.max(
                      ...Object.values(movieRevenue),
                      1
                    );
                    const size = revenue / maxRevenue;
                    // 색상 팔레트 (상위 3개 강조)
                    const barColors = [
                      "#ff6b6b", // 1위
                      "#ffa94d", // 2위
                      "#ffd43b", // 3위
                      "#69db7c", // 나머지
                    ];
                    const color =
                      idx === 0
                        ? barColors[0]
                        : idx === 1
                        ? barColors[1]
                        : idx === 2
                        ? barColors[2]
                        : barColors[3];
                    return (
                      <tr key={movieName}>
                        <th
                          scope="row"
                          style={{
                            fontWeight: 500,
                            fontSize: 15,
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            maxWidth: 90,
                          }}
                          title={movieName}
                        >
                          {movieName}
                        </th>
                        <td
                          style={
                            {
                              "--size": size.toFixed(2),
                              background: color,
                              borderRadius: 6,
                              position: "relative",
                            } as React.CSSProperties
                          }
                        >
                          <span
                            className="data"
                            style={{
                              fontWeight: 600,
                              color: "#222",
                              position: "absolute",
                              right: 8,
                              top: "50%",
                              transform: "translateY(-50%)",
                              fontSize: 15,
                              textShadow: "0 1px 2px #fff8",
                            }}
                          >
                            {revenue.toLocaleString()}
                          </span>
                          <span className="tooltip">
                            {revenue.toLocaleString()} 원
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="right-chart">
          {/* bar chart */}
          <div className="weekly-sales-area chart">
            <table className="charts-css bar show-heading show-labels show-primary-axis show-4-secondary-axes show-data-axes">
              <caption> 6월 주별 매출 </caption>
              <tbody className="weekly-chart-body">
                {(() => {
                  // 6월 날짜만 추출 (2024-06-01 ~ 2024-06-30)
                  const juneDates = Object.entries(dateRevenue).sort(
                    ([a], [b]) => a.localeCompare(b)
                  );
                  // 1~4주로 나누기 (1~7, 8~14, 15~21, 22~30)
                  const weeks = [0, 0, 0, 0];
                  juneDates.forEach(([date, value]) => {
                    const day = parseInt(date.split("-")[2], 10);
                    if (day >= 1 && day <= 7) weeks[0] += value;
                    else if (day >= 8 && day <= 14) weeks[1] += value;
                    else if (day >= 15 && day <= 21) weeks[2] += value;
                    else if (day >= 22 && day <= 30) weeks[3] += value;
                  });
                  const max = Math.max(...weeks, 1);
                  return weeks.map((sum, idx) => {
                    const size = sum / max;
                    return (
                      <tr key={idx}>
                        <th scope="row">{idx + 1}주</th>
                        <td
                          style={
                            {
                              "--size": size.toFixed(2),
                              background: "#4dabf7",
                              borderRadius: 6,
                              position: "relative",
                            } as React.CSSProperties
                          }
                        >
                          <span
                            className="data"
                            style={{
                              fontWeight: 600,
                              color: "#222",
                              position: "absolute",
                              right: 8,
                              top: "50%",
                              transform: "translateY(-50%)",
                              fontSize: 15,
                              textShadow: "0 1px 2px #fff8",
                            }}
                          >
                            {sum.toLocaleString()}원
                          </span>
                          <span className="tooltip">
                            {sum.toLocaleString()} 원
                          </span>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
