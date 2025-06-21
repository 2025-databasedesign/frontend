import React, { useEffect, useState } from "react";
import "./ScheduleManage.css";
import { getMovieInfo } from "../../utils/scheduleRelatedUtils";
import {
  PosterInfoProps,
  RegisterSchedule,
} from "../../types/scheduleRelatedType";

const ScheduleManage: React.FC = () => {
  const [lookupDate, setLookupDate] = useState("");
  const [movieList, setMovieList] = useState<PosterInfoProps[]>([]);
  const [registerSchedule, setRegisterSchedule] = useState<RegisterSchedule>({
    date: "",
    schedules: [
      {
        movieId: 0,
        theaters: [
          {
            theaterId: "",
            theaterName: "",
            format: "",
            subDub: "",
            availSeat: 0,
            totalSeat: 0,
            startTimes: [""],
            endTimes: [""],
          },
        ],
      },
    ],
  });

  // ------------------------ 특정 영화 상영일정 삭제
  //찐 handleDeleteMovieSchedule API, 주소 확인
  // const handleDeleteMovieSchedule = async (movieId: number) => {
  //   if (!window.confirm("영화 스케쥴을 정말로 삭제하시겠습니까?")) return;

  //   try {
  //     const response = await fetch(
  //       `http:/api/schedules/movie/${movieId}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log("Deleted movie:", data);
  //       alert("영화 스케쥴이 완료되었습니다.");
  //     } else {
  //       const errorData = await response.json();
  //       alert(`영화 스케쥴 삭제 실패: ${errorData.message || response.statusText}`);
  //     }
  //   } catch (error) {
  //     console.error("Delete failed:", error);
  //     alert("서버 오류로 인해 삭제에 실패했습니다.");
  //   }
  // };

  //mock data
  //영화 리스트 조회
  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getMovieInfo();
      if (data) {
        setMovieList(data);
      }
    };
    fetchMovies();
  }, []);

  // ------------------------ 특정 영화 상영일정 조회
  // 찐 handleLookupMovieSchedule API, 주소 확인
  // const handleLookupMovieSchedule = async (movieId: number) => {
  //   try {
  //     const res = await fetch(`/api/schedules/movie/${movieId}`);
  //     const resData = await res.json();
  //     setMovieList(resData);
  //   } catch (err) {
  //     console.log("Error fetching schedule: ", err);
  //   }
  // }

  // ------------------------ 상영일정 등록
  // 찐 handleRegisterSchedule API, 주소 확인
  const handleRegisterSchedule = async () => {
    try {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerSchedule),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Schedule registered:", data);
        alert("상영 일정 등록 성공!");
      } else {
        const errorData = await response.json();
        alert(`등록 실패: ${errorData.message || response.statusText}`);
      }
    } catch (err) {
      console.error("Error registering:", err);
      alert("서버 오류");
    }
  };

  return (
    <div className="schedule-main">
      <div className="admin-schedule-top">
        <div className="admin-schedule-left">
          <div className="schedule-lookup">
            <div className="schedule-label-admin">상영 일정 조회</div>
            <div className="schedule-date-input">
              <input
                type="date"
                name="date"
                className="date-input"
                value={lookupDate}
                onChange={(e) => setLookupDate(e.target.value)}
                required
              />
              <button
                className="lookup-button"
                // onClick={handleLookupMovieSchedule}
              >
                <span className="lookup">
                  <img src="/src/assets/image/search-icon.png" alt="조회" />
                </span>
              </button>
            </div>
          </div>
          <div className="schedule-movie-lookup-delete">
            <div className="schedule-label-admin">
              특정 영화의 모든 상영일정 조회 / 삭제
            </div>
            <div className="movie-list-main-wrapper">
              <div className="movie-list-main">
                {movieList.map((movie, index) => (
                  <div className="movie-area-admin" key={index}>
                    <div className="movie-title-admin">{movie.movieName}</div>
                    <div className="schedule-button-area">
                      <span
                        className="delete"
                        // onClick={handleDeleteMovieSchedule()}
                      >
                        <img
                          src="/src/assets/image/delete-icon.png"
                          alt="삭제"
                        />
                      </span>
                      <span
                        className="lookup"
                        // onClick={handleLookupMovieSchedule}
                      >
                        <img
                          src="/src/assets/image/search-icon.png"
                          alt="조회"
                        />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="admin-schedule-right">
          <div className="schedule-area">
            조회할 때 보이는 상영일정 공간
          </div>
        </div>
      </div>
      <div className="admin-schedule-bottom">
        <div className="schedule-register">
          <div className="schedule-label-admin">상영 일정 등록</div>
          <div className="schedule-register-input">
            <form
              className="schedule-register-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleRegisterSchedule();
              }}
            >
              <label>
                <span className="label">상영 날짜</span>
                <input
                  type="date"
                  value={registerSchedule.date}
                  onChange={(e) =>
                    setRegisterSchedule((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label>
                <span className="label">영화 ID</span>
                <input
                  type="number"
                  value={registerSchedule.schedules[0].movieId}
                  onChange={(e) =>
                    setRegisterSchedule((prev) => {
                      const schedules = [...prev.schedules];
                      schedules[0].movieId = Number(e.target.value);
                      return { ...prev, schedules };
                    })
                  }
                  required
                />
              </label>

              <label>
                <span className="label">상영관 ID</span>
                <input
                  type="text"
                  placeholder="0"
                  value={registerSchedule.schedules[0].theaters[0].theaterId}
                  onChange={(e) =>
                    setRegisterSchedule((prev) => {
                      const schedules = [...prev.schedules];
                      schedules[0].theaters[0].theaterId = e.target.value;
                      return { ...prev, schedules };
                    })
                  }
                  required
                />
              </label>

              <label>
                <span className="label">상영관 이름</span>
                <input
                  type="text"
                  placeholder="1관"
                  value={registerSchedule.schedules[0].theaters[0].theaterName}
                  onChange={(e) =>
                    setRegisterSchedule((prev) => {
                      const schedules = [...prev.schedules];
                      schedules[0].theaters[0].theaterName = e.target.value;
                      return { ...prev, schedules };
                    })
                  }
                  required
                />
              </label>

              <label>
                <span className="label">포맷</span>
                <input
                  type="text"
                  placeholder="2D"
                  value={registerSchedule.schedules[0].theaters[0].format}
                  onChange={(e) =>
                    setRegisterSchedule((prev) => {
                      const schedules = [...prev.schedules];
                      schedules[0].theaters[0].format = e.target.value;
                      return { ...prev, schedules };
                    })
                  }
                  required
                />
              </label>

              <label>
                <span className="label">자막/더빙</span>
                <input
                  type="text"
                  placeholder="자막"
                  value={registerSchedule.schedules[0].theaters[0].subDub}
                  onChange={(e) =>
                    setRegisterSchedule((prev) => {
                      const schedules = [...prev.schedules];
                      schedules[0].theaters[0].subDub = e.target.value;
                      return { ...prev, schedules };
                    })
                  }
                  required
                />
              </label>

              <label>
                <span className="label">좌석 수</span>
                <input
                  type="number"
                  placeholder="전체 좌석 수"
                  value={registerSchedule.schedules[0].theaters[0].totalSeat}
                  onChange={(e) =>
                    setRegisterSchedule((prev) => {
                      const seat = Number(e.target.value);
                      const schedules = [...prev.schedules];
                      schedules[0].theaters[0].totalSeat = seat;
                      schedules[0].theaters[0].availSeat = seat;
                      return { ...prev, schedules };
                    })
                  }
                  required
                />
              </label>

              <label>
                <span className="label">시작 시간 (HH:mm)</span>
                <input
                  type="time"
                  value={
                    registerSchedule.schedules[0].theaters[0].startTimes[0]
                  }
                  onChange={(e) =>
                    setRegisterSchedule((prev) => {
                      const schedules = [...prev.schedules];
                      schedules[0].theaters[0].startTimes = [e.target.value];
                      return { ...prev, schedules };
                    })
                  }
                  required
                />
              </label>

              <label>
                <span className="label">종료 시간 (HH:mm)</span>
                <input
                  type="time"
                  value={registerSchedule.schedules[0].theaters[0].endTimes[0]}
                  onChange={(e) => {
                    setRegisterSchedule((prev) => {
                      const schedules = [...prev.schedules];
                      schedules[0].theaters[0].endTimes = [e.target.value];
                      return { ...prev, schedules };
                    });
                    console.log(e.target.value);
                    console.log(typeof e.target.value);
                  }}
                  required
                />
              </label>

              <button type="submit" className="register-button">
                등록하기
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManage;
