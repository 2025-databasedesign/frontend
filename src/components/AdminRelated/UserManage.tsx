import React, { useState } from "react";
import "./UserManage.css";
import { BannedListType } from "../../types/AdminPageRelatedType";

const UserManage: React.FC = () => {
  const [banId, setBanId] = useState(0);
  const [bannedList, setBannedList] = useState<BannedListType[]>([]);

  const handleBan = async (userId: number) => {
    try {
      const response = await fetch(
        `http://54.180.117.246/api/admin/users/${banId}/ban`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Ban success:", data);
        alert("사용자 밴 성공!");
        getBanList();
      } else {
        const errorData = await response.json();
        console.error("Ban failed:", errorData);
        alert(`사용자 밴 실패: ${errorData.message || response.statusText}`);
      }
      setBanId(0);
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("서버 오류로 사용자 밴이 실패했습니다.");
    }
  };

  const handleUnban = async (userId: number) => {
    try {
      console.log(userId);
      console.log(typeof(userId));
      const response = await fetch(`http://54.180.117.246/api/admin/users/${userId}/unban`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });

      
      if (response.ok) {
        const data = await response.json();
        console.log("Ban success:", data);
        alert("사용자 밴 성공!");
        getBanList();
      } else {
        const errorData = await response.json();
        console.error("Ban failed:", errorData);
        alert(`사용자 밴 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("서버 오류로 사용자 밴이 실패했습니다.");
    }
  };

  const getBanList = async () => {
    try {
      const res = await fetch(`http://54.180.117.246/api/admin/users/banned`);
      const resData = await res.json();
      console.log(resData);
      setBannedList(resData.data);
    } catch (err) {
      console.log("Error fetching schedule: ", err);
    }
  };

  return (
    <div className="user-manage-main">
      <div className="admin-user-ban-left">
        <div className="user-ban-area">
          <div className="label">사용자 밴하기</div>
          <div className="admin-user-input-area">
            <input
              type="text"
              name="ban"
              placeholder="사용자 ID"
              value={banId}
              onChange={(e) => setBanId(Number(e.target.value))}
              required
            />
            <button
              className="user-ban-button"
              onClick={() => handleBan(banId)}
            >
              밴
            </button>
          </div>
        </div>
      </div>
      <div className="admin-user-ban-right">
        <div className="view-ban-list-area">
          <button className="label" onClick={() => getBanList()}>
            밴된 사용자 목록 조회
          </button>
          <div className="ban-list">
            {bannedList.map((user, index) => (
              <div className="banned-user-area" key={index}>
                <div className="banned-user-main-info">
                  <div className="banned-user-id">
                    <span>ID: </span>
                    {user.id}
                  </div>
                  <div className="banned-user-email">
                    <span>메일: </span>
                    {user.email}
                  </div>
                  <div className="banned-user-name">
                    <span>이름: </span>
                    {user.name}
                  </div>
                </div>
                <div className="banned-user-sub-info">
                  <div className="banned-user-birthDate">
                    <span>생년월일: </span>
                    {user.birthDate}
                  </div>
                  <div className="banned-user-gender">
                    <span>성별: </span>
                    {user.gender}
                  </div>
                  <div className="banned-user-phone">
                    <span>전화번호: </span>
                    {user.phone}
                  </div>
                </div>
                <div className="banned-user-movey-status">
                  <div className="banned-user-money">
                    <span>잔여금액: </span>
                    {user.money.toLocaleString()} 원
                  </div>
                  <div className="banned-user-status">
                    <span>상태: </span>
                    {user.status}
                  </div>
                  <button
                    className="user-ban-button"
                    onClick={() => handleUnban(user.id)}
                  >
                    밴 해제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManage;
