import React, { useState } from "react";
import "./TheaterManage.css";
import { TheaterForRegister } from "../../types/scheduleRelatedType";

const TheaterManage: React.FC = () => {
  const [theater, setTheaters] = useState<TheaterForRegister[]>([]);
  const [theaterInfoForRegister, setTheaterInfoForRegister] =
    useState<TheaterForRegister>({
      theaterId: "",
      theaterName: "",
      totalSeats: 0,
      format: "",
      price: 0,
      seats: [],
    });
  const [theaterInfoForUpdate, setTheaterInfoForUpdate] =
    useState<TheaterForRegister>({
      theaterId: "",
      theaterName: "",
      totalSeats: 0,
      format: "",
      price: 0,
      seats: [],
    });

  const handleChangeRegister = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTheaterInfoForRegister((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTheaterInfoForRegister((prev) => ({ ...prev, [name]: value }));
  };

  //찐 handleTheaterRegister API, 주소 확인
  const handleTheaterRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://54.180.117.246/api/theater", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(theaterInfoForRegister),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Register success:", data);
        setTheaterInfoForRegister({
          theaterId: "",
          theaterName: "",
          totalSeats: 0,
          format: "",
          price: 0,
          seats: [],
        });
        alert("상영관 등록 성공!");
      } else {
        const errorData = await response.json();
        console.error("Register failed:", errorData);
        alert(`상영관 등록 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("서버 오류로 상영관 등록이 실패했습니다.");
    }
  };

  const handleDeleteTheater = async (theaterId: string) => {
    if (!window.confirm("정말로 상영관 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(
        `http://54.180.117.246/api/theater/${theaterId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Theater deleted:", data);
        alert("상영관 삭제가 완료되었습니다.");
        fetchTheaters();
      } else {
        const errorData = await response.json();
        alert(`상영관 삭제 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("서버 오류로 인해 상영관 삭제 실패했습니다.");
    }
  };

  const handleTheaterUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://54.180.117.246/api/theater/${theaterInfoForUpdate.theaterId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(theaterInfoForUpdate),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Update success:", data);
        setTheaterInfoForUpdate({
          theaterId: "",
          theaterName: "",
          totalSeats: 0,
          format: "",
          price: 0,
          seats: [],
        });
        alert("상영관 업데이트 성공!");
      } else {
        const errorData = await response.json();
        console.error("Update failed:", errorData);
        alert(`상영관 업데이트 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("서버 오류로 상영관 업데이트가 실패했습니다.");
    }
  };

  const fetchTheaters = async () => {
    try {
      const res = await fetch("http://54.180.117.246/api/theaters");
      const resData = await res.json();
      if (resData.result && Array.isArray(resData.data)) {
        setTheaters(resData.data);
      }
      console.log("Theaters: ", resData.data);
    } catch (err) {
      console.log("Error fetching theater: ", err);
    }
  };

  return (
    <div className="theater-manage-main">
      <div className="theater-view">
        <div className="theater-manage-title">상영관 조회 및 삭제</div>
        <div className="theater-list-wrapper">
          <button className="fetch-button" onClick={() => fetchTheaters()}>
            상영관 정보 조회
          </button>
          <div className="theater-list">
            {theater.map((theater, index) => (
              <div className="theater-list-area" key={index}>
                <div className="theater-main-info">
                  <div>
                    <span>ID: </span>
                    {theater.theaterId}
                  </div>
                  <div>
                    <span>이름: </span>
                    {theater.theaterName}
                  </div>
                  <div>
                    <span>총 좌석 수: </span>
                    {theater.totalSeats}
                  </div>
                </div>
                <div className="theater-sub-info">
                  <div>
                    <span>종류(타입): </span>
                    {theater.format}
                  </div>
                  <div>
                    <span>기본 가격: </span>
                    {theater.price}
                  </div>
                  <button
                    className="user-ban-button"
                    onClick={() => handleDeleteTheater(theater.theaterId)}
                  >
                    상영관 삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="theater-register">
        <div className="theater-manage-title">상영관 등록</div>
        <form
          className="theater-register-main"
          onSubmit={handleTheaterRegister}
        >
          <label>
            <span className="label">상영관 이름</span>
            <input
              type="text"
              name="theaterName"
              placeholder="1관"
              value={theaterInfoForRegister.theaterName}
              onChange={handleChangeRegister}
              required
            />
          </label>
          <label>
            <span className="label">상영관 종류</span>
            <input
              type="text"
              name="format"
              placeholder="2D"
              value={theaterInfoForRegister.format}
              onChange={handleChangeRegister}
              required
            />
          </label>
          <label>
            <span className="label">상영관 기본 가격</span>
            <input
              type="number"
              name="price"
              placeholder="15000"
              value={theaterInfoForRegister.price}
              onChange={handleChangeRegister}
              required
            />
          </label>
          <label>
            <span className="label">상영관 총 좌석 수</span>
            <input
              type="number"
              name="totalSeats"
              placeholder="60"
              value={theaterInfoForRegister.totalSeats}
              onChange={handleChangeRegister}
              required
            />
          </label>
          <button type="submit" className="theater-register-button">
            상영관 등록
          </button>
        </form>
      </div>
      <div className="theater-update">
        <div className="theater-manage-title">상영관 정보 업데이트</div>
        <form className="theater-update-main" onSubmit={handleTheaterUpdate}>
          <label>
            <span className="label">상영관 ID</span>
            <input
              type="text"
              name="theaterId"
              placeholder="21"
              value={theaterInfoForUpdate.theaterId}
              onChange={handleChangeUpdate}
              required
            />
          </label>
          <label>
            <span className="label">상영관 이름</span>
            <input
              type="text"
              name="theaterName"
              placeholder="1관"
              value={theaterInfoForUpdate.theaterName}
              onChange={handleChangeUpdate}
              required
            />
          </label>
          <label>
            <span className="label">상영관 종류</span>
            <input
              type="text"
              name="format"
              placeholder="2D"
              value={theaterInfoForUpdate.format}
              onChange={handleChangeUpdate}
              required
            />
          </label>
          <label>
            <span className="label">상영관 기본 가격</span>
            <input
              type="number"
              name="price"
              placeholder="15000"
              value={theaterInfoForUpdate.price}
              onChange={handleChangeUpdate}
              required
            />
          </label>
          <label>
            <span className="label">상영관 총 좌석 수</span>
            <input
              type="number"
              name="totalSeats"
              placeholder="60"
              value={theaterInfoForUpdate.totalSeats}
              onChange={handleChangeUpdate}
              required
            />
          </label>
        </form>
        <button type="submit" className="theater-update-button">
          상영관 업데이트
        </button>
      </div>
    </div>
  );
};

export default TheaterManage;
