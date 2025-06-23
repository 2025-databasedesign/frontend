import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../routes/AppRoutes";
import "./Navbar.css";
import logoImage from "../assets/image/logo-transparent-bg1.png";
import { isTokenValid, logout } from "../utils/authUtils";
import { useScheduleRelatedStore } from "../stores/ScheduleRelatedStore";
import { useAdminStore } from "../stores/AdminStore";
import { useUserStore } from "../stores/UserRelatedStore";



type PaymentPopupProps = {
  onClose: () => void;
  onSuccess: (amount: number) => void;
};

const PaymentPopup: React.FC<PaymentPopupProps> = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState<number>(0);
  const [cardNumber, setCardNumber] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0 && cardNumber.length >= 12) {
      onSuccess(amount);
      onClose();
    } else {
      alert("카드번호와 금액을 올바르게 입력하세요.");
    }
  };

  return (
    <div className="payment-popup-overlay">
      <div className="payment-popup">
        <h3>충전하기</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>카드번호</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234-5678-9012-3456"
              maxLength={19}
              required
            />
          </div>
          <div>
            <label>금액</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1000}
              step={1000}
              required
            />
          </div>
          <div className="popup-buttons">
            <button type="submit">결제</button>
            <button type="button" onClick={onClose}>
              취소
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .payment-popup-overlay {
          position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .payment-popup {
          background: #fff; padding: 2rem; border-radius: 8px; min-width: 300px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.2);
        }
        .payment-popup input { width: 100%; margin-bottom: 1rem; }
        .popup-buttons { display: flex; gap: 1rem; justify-content: flex-end; }
      `}</style>
    </div>
  );
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const balance = useUserStore((state) => state.balance);
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const setIsAdmin = useAdminStore((state) => state.setIsAdmin);

  function handleLogout() {
    setIsAdmin(false);
    // Clear token from localStorage
    logout();
    // Reset Zustand booking state (in memory)
    useScheduleRelatedStore.getState().resetState();

    alert("로그아웃되었습니다.");
    navigate(AppRoutes.HOME);
  }

  function handleCharge() {
    setShowPayment(true);
  }

  async function handlePaymentSuccess(amount: number) {
    try {
      const userEmail = useUserStore.getState().userEmail;
      const res = await fetch(`http://54.180.117.246/api/users/${encodeURIComponent(userEmail)}/charge?amount=${amount}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data?.result) {
        useUserStore.getState().setBalance(balance + amount);
        alert(`${amount}원이 충전되었습니다.`);
      } else {
        alert("충전에 실패했습니다.");
      }
    } catch {
      alert("충전 중 오류가 발생했습니다.");
    }
  }

  return (
    <nav className="nav-bar container">
      <span className="logo-wrapper">
        <img
          src={logoImage}
          alt="cinema logo"
          onClick={() => navigate(AppRoutes.HOME)}
          className="logo"
        />
      </span>
      <ul className="center-menu">
        <li className="li-center-menu">
          <div
            className="middle-navigation"
            onClick={() => navigate(AppRoutes.MOVIELIST_PAGE)}
          >
            <span className="span-nav-content">영화</span>
          </div>
        </li>
        <li className="li-center-menu">
          <div className="middle-navigation">
            <span className="span-nav-content">예매</span>
            <ul className="sub-tab">
              <li className="li-sub-tab">
                <a
                  className="sub-tab-navigation"
                  onClick={() => navigate(AppRoutes.RESERVATION_PAGE)}
                >
                  빠른예매
                </a>
              </li>
              <li className="li-sub-tab">
                <a
                  className="sub-tab-navigation"
                  onClick={() => navigate(AppRoutes.SCHEDULE_PAGE)}
                >
                  상영일정
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li className="li-center-menu">
          <div
            className="middle-navigation"
            onClick={() => navigate(AppRoutes.THEATERLIST_PAGE)}
          >
            {/* <span className="span-nav-content">상영관</span> */}
          </div>
        </li>
        {isTokenValid() && isAdmin && (
          <li className="li-center-menu">
            <div
              className="middle-navigation"
              onClick={() => navigate(AppRoutes.ADMIN_PAGE)}
            >
              <span className="span-nav-content">매출</span>
            </div>
          </li>
        )}
      </ul>
      <ul>
        {isTokenValid() ? (
          <>
            <li>
              <button onClick={handleLogout}>로그아웃</button>
            </li>
            {!isAdmin && (
              <>
                <li>
                  <button
                    onClick={() => navigate(AppRoutes.MY_PAGE)}
                    className="my-button"
                  >
                    {/* 마이 */}
                    <img
                      src="/src/assets/image/my-icon.png"
                      alt="my page"
                      className="my-icon"
                    />
                  </button>
                </li>
                <li className="balance-li">
                  <span className="balance-text">
                    {balance.toLocaleString()}원
                  </span>
                  <button className="charge-btn" onClick={handleCharge}>
                    충전
                  </button>
                </li>
              </>
            )}
          </>
        ) : (
          <li>
            <button onClick={() => navigate(AppRoutes.LOGIN_PAGE)}>
              로그인
            </button>
          </li>
        )}
      </ul>
      {showPayment && (
        <PaymentPopup
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </nav>
  );
};

export default Navbar;
