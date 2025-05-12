import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './SignUpPage.css';

const SignUpPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://54.180.117.246/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: 3785,
                    username: nickname,
                    email: email,
                    password: password
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Register success:', data);
                alert('회원가입 성공!');
                navigate('/login-page');
            } else {
                const errorData = await response.json();
                console.error('Register failed:', errorData);
                alert(`회원가입 실패: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            alert('서버 오류로 회원가입에 실패했습니다.');
        }
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
