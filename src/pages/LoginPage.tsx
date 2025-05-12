import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("로그인 시도:", { username, password });
        navigate("/");
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
                        type="text"
                        className="login-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
