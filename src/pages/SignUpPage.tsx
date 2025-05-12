import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './SignUpPage.css';

const SignUpPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
        const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add actual signup logic here
        console.log('Sign up:', { email, nickname, password });
    };

    return (
        <main className="signup-main">
            <div className="login-header">
                <img
                    src="/src/assets/logo-transparent-bg-resize.png"
                    alt="cinema logo"
                    onClick={() => navigate("/")}
                    className="login-logo"
                />
                <div className="login-title">Hello, Movie!</div>
            </div>
            <form className="signup-form-container" onSubmit={handleSubmit}>
                <input
                    type="email"
                    className="signup-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    className="signup-input"
                    placeholder="Nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="signup-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="signup-button">Create Account</button>
                <div className="signup-footer">
                    Already have an account?
                    <a href="/login-page"> Log in</a>
                </div>
            </form>
        </main>
    );
};

export default SignUpPage;
