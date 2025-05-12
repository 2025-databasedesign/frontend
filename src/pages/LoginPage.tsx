import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://54.180.117.246/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("로그인 성공:", data);
                alert("로그인 성공!");
                navigate("/");
            } else {
                const errorData = await response.json();
                alert("로그인 실패: " + (errorData.message || response.statusText));
            }
        } catch (error) {
            console.error("로그인 중 오류:", error);
            alert("서버 오류로 로그인에 실패했습니다.");
        }
    };

    return (
        <main className="login-main">
            <div className="login-header">
                <img
                    src="/src/assets/logo-transparent-bg-resize.png"
                    alt="cinema logo"
                    onClick={() => navigate("/")}
                    className="login-logo"
                />
                <div className="login-title">Hello, Movie!</div>
            </div>
            <section className="login-form-container">
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        className="login-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="login-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button">
                        Log In
                    </button>
                </form>
                <div className="login-footer">
                    Don’t have an account?
                    <a href="/sign-up-page"> Sign up</a>
                </div>
            </section>
        </main>
    );
};

export default LoginPage;
