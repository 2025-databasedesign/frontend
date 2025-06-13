import React, { useState } from "react";
import "./MyInfoManage.css";
import { useUserStore } from "../../stores/UserRelatedStore";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes/AppRoutes";
import { logout } from "../../utils/authUtils";

const MyInfoManage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");

  const userEmail = useUserStore((state) => state.userEmail);
  const setName = useUserStore((state) => state.setName);

  const handleChange = async (
    field: "password" | "name" | "birthDate" | "phone"
  ) => {
    try {
      const body: {
        name?: string;
        password?: string;
        birthDate?: string;
        phone?: string;
      } = {};
      if (field === "password") body.password = password;
      if (field === "name") body.name = nickname;
      if (field === "birthDate") body.birthDate = birthDate;
      if (field === "phone") body.phone = phone;

      const response = await fetch(
        `http://54.180.117.246/api/users/${userEmail}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Update success:", data);
        alert(`${field} 변경 완료`);

        if (field === "name") {
        setName(nickname);
      }
      } else {
        const errorData = await response.json();
        alert(`변경 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("서버 오류로 인해 변경 실패");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 회원 탈퇴하시겠습니까?")) return;

    try {
      const response = await fetch(`http://54.180.117.246/api/users/${userEmail}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User deleted:", data);
        alert("회원 탈퇴가 완료되었습니다.");
        logout();
        navigate(AppRoutes.HOME);
      } else {
        const errorData = await response.json();
        alert(`회원 탈퇴 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("서버 오류로 인해 탈퇴에 실패했습니다.");
    }
  };

  return (
    <div className="my-info-main">
      <div className="my-info-title">내 정보</div>
      <div className="info-change-area">
        <div className="nickname-change-area">
          <div className="left-my">
            <label className="change-title" htmlFor="new-nickname-input">
              별명 변경
            </label>
            <input
              type="text"
              id="new-nickname-input"
              name="new-nickname"
              className="my-info-input"
              placeholder="새 별명"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <button className="right-my" onClick={() => handleChange("name")}>
            변경
          </button>
        </div>
        <div className="password-change-area">
          <div className="left-my">
            <label className="change-title" htmlFor="new-password-input">
              비밀번호 변경
            </label>
            <input
              type="text"
              id="new-password-input"
              name="new-password"
              className="my-info-input"
              placeholder="새 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="right-my" onClick={() => handleChange("password")}>
            변경
          </button>
        </div>
        <div className="birthday-change-area">
          <div className="left-my">
            <label className="change-title" htmlFor="new-birthday-input">
              생년월일 변경
            </label>
            <input
              type="date"
              id="new-birthday-input"
              name="new-birthday"
              className="my-info-input"
              placeholder="생년월일"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <button
            className="right-my"
            onClick={() => handleChange("birthDate")}
          >
            변경
          </button>
        </div>
        <div className="phone-change-area">
          <div className="left-my">
            <label className="change-title" htmlFor="new-birthday-input">
              전화번호 변경
            </label>
            <input
              type="tel"
              id="new-phone-input"
              name="new-phone"
              className="my-info-input"
              placeholder="전화번호"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button className="right-my" onClick={() => handleChange("phone")}>
            변경
          </button>
        </div>
        <button className="delete-account" onClick={() => handleDelete()}>
          회원 탈퇴
        </button>
      </div>
    </div>
  );
};

export default MyInfoManage;
