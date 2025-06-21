import React from "react";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  // const [theaters, setTheaters] = useState<TheaterInSchedule[]>([]);
  const revenue = 1000000;  //mock data
  const newUser = 300;  //mock data

  // useEffect(() => {
  //   const fetchTheaters = async () => {
  //     const data = await getTheatersInfo();
  //     if (data) {
  //       setTheaters(data);
  //     }
  //   };
  //   fetchTheaters();
  // }, []);

  return (
    <div className="dashboard-main">
      <div className="main-overview-top">
        <div className="monthly-sales-area">
          <div className="overview-sub-title">월 매출</div>
          <div className="sales-area">{revenue.toLocaleString()}원</div>
        </div>
        <div className="high-profit-movie-area">
          <div className="overview-sub-title">월 최고 매출 영화</div>
          <div className="sales-area">범죄도시</div>
        </div>
        <div className="high-profit-theater-area">
          <div className="overview-sub-title">월 최고 매출 상영관</div>
          <div className="sales-area">상영관1</div>
        </div>
        <div className="new-user-area">
          <div className="overview-sub-title">새 회원 수</div>
          <div className="sales-area">+{newUser.toLocaleString()}명</div>
        </div>
      </div>
      <div className="main-overview-bottom">
        <div className="left-chart">
          {/* column chart */}
          <div className="theater-sales-area chart">
            <table className="charts-css column show-labels show-heading show-primary-axis show-5-secondary-axes show-data-axes data-spacing-5">
              <caption> 영화관별 월 매출 </caption>
              <tbody>
                <tr>
                  {/* {theaters.map((theater, index) => (
                  <tr key={index}>
                    <th scope="row">{theater.theaterName}</th>
                    <td
                      style={
                        { "--size": "calc( 20 / 100 )" } as React.CSSProperties
                      }
                    >
                      <span className="data">20</span>
                      <span className="tooltip"> 100,000 </span>
                    </td>
                  </tr>
                ))} */}
                  <th scope="row"> 1관 </th>
                  <td
                    style={
                      { "--size": "calc( 20 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">20</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row"> 2관 </th>
                  <td
                    style={
                      { "--size": "calc( 40 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">40</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row"> 3관 </th>
                  <td
                    style={
                      { "--size": "calc( 60 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">60</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row"> 4관 </th>
                  <td
                    style={
                      { "--size": "calc( 80 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">80</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row"> 5관 </th>
                  <td
                    style={
                      { "--size": "calc( 100 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">100</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row"> 5관 </th>
                  <td
                    style={
                      { "--size": "calc( 100 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">100</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row"> 5관 </th>
                  <td
                    style={
                      { "--size": "calc( 100 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">100</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row"> 5관 </th>
                  <td
                    style={
                      { "--size": "calc( 100 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">100</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="data-axis-1"> 매출 </div>
          </div>

          {/* side bar chart */}
          <div className="movie-sales-area chart">
            <table className="charts-css bar movie-chart show-heading show-labels show-primary-axis show-data-axes data-spacing-2">
              <caption> 영화별 매출 </caption>

              <tbody>
                <tr>
                  <th scope="row"> 영화1 </th>
                  <td
                    style={
                      { "--size": "calc( 40 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">40</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row"> 영화2 </th>
                  <td
                    style={
                      { "--size": "calc( 40 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">40</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row"> 영화3 </th>
                  <td
                    style={
                      { "--size": "calc( 50 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">50</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row"> 영화4 </th>
                  <td
                    style={
                      { "--size": "calc( 40 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">40</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row"> 영화5 </th>
                  <td
                    style={
                      { "--size": "calc( 80 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">80</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row"> 영화6 </th>
                  <td
                    style={
                      { "--size": "calc( 40 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">40</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row"> 영화7 </th>
                  <td
                    style={
                      { "--size": "calc( 40 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">40</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row"> 영화8 </th>
                  <td
                    style={
                      { "--size": "calc( 40 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">40</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row"> 영화9 </th>
                  <td
                    style={
                      { "--size": "calc( 100 / 100 )" } as React.CSSProperties
                    }
                  >
                    <span className="data">100</span>
                    <span className="tooltip"> 100,000 </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="right-chart">
          {/* line chart */}
          <div className="weekly-sales-area chart">
            <table className="charts-css line show-heading show-labels show-primary-axis show-4-secondary-axes show-data-axes">
              <caption> 주별 매출 </caption>
              <tbody className="weekly-chart-body">
                <tr>
                  <th scope="row">1주</th>
                  <td
                    style={
                      {
                        "--start": "0.2",
                        "--end": "0.4",
                      } as React.CSSProperties
                    }
                  >
                    {/* <span className="data"> $ 40K </span> */}
                    <span className="tooltip"> $ 40K </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">2주</th>
                  <td
                    style={
                      {
                        "--start": "0.4",
                        "--end": "0.5",
                      } as React.CSSProperties
                    }
                  >
                    {/* <span className="data"> $ 50K </span> */}
                    <span className="tooltip"> $ 50K </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">3주</th>
                  <td
                    style={
                      {
                        "--start": "0.5",
                        "--end": "0.4",
                      } as React.CSSProperties
                    }
                  >
                    {/* <span className="data"> $ 40K </span> */}
                    <span className="tooltip"> $ 40K </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">4주</th>
                  <td
                    style={
                      {
                        "--start": "0.4",
                        "--end": "0.6",
                      } as React.CSSProperties
                    }
                  >
                    <span className="data"> $ 60K </span>
                    <span className="tooltip"> $ 60K </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
