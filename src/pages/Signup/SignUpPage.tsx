import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";
import Navbar from "../../components/Navbar";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://54.180.117.246/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nickname,
          email: email,
          password: password,
          gender: gender,
          birthDate: birthDate,
          phone: phone,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Register success:", data);
        alert("회원가입 성공!");
        navigate("/login-page");
      } else {
        const errorData = await response.json();
        console.error("Register failed:", errorData);
        alert(`회원가입 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("서버 오류로 회원가입에 실패했습니다.");
    }
  };

  return (
    <div>
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <div className="signup-main">
        <div className="signup-header">
          <img
            src="/src/assets/logo-transparent-bg-resize.png"
            alt="cinema logo"
            onClick={() => navigate("/")}
            className="signup-logo"
          />
          <div className="signup-title">Hello, Movie!</div>
        </div>
        <form className="signup-form-container" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            className="signup-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            className="signup-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            name="nickname"
            className="signup-input"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          <select
            name="gender"
            className="signup-input"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="" disabled>
              성별
            </option>
            <option value="남">남</option>
            <option value="여">여</option>
            <option value="기타">기타</option>
          </select>
          <input
            type="date"
            name="birthday"
            className="signup-input"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
          <input
            type="tel"
            name="phone"
            className="signup-input"
            placeholder="전화번호"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button type="submit" className="signup-button">
            회원가입
          </button>
          <div className="signup-footer">
            이미 계정이 있으신가요?
            <a href="/login-page"> Log in</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
