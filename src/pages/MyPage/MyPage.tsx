import React, { useState } from "react";
import "./MyPage.css";
import Navbar from "../../components/Navbar";
import PaymentCancelHistory from "../../components/PaymentCanlcelHistory/PaymentCancelHistory";
import PaymentHistory from "../../components/PaymentHistory/PaymentHistory";
import MyReview from "../../components/MyReview/MyReview";
import MyInfoManage from "../../components/MyInfoManage/MyInfoManage";
import { useUserStore } from "../../stores/UserRelatedStore";

const MyPage: React.FC = () => {
  const [feature, setFeature] = useState("payment-history");
  const name = useUserStore((state) => state.name);

  function renderFeatureContent() {
    switch (feature) {
      case "payment-history":
        return <PaymentHistory />;
      case "payment-cancel-history":
        return <PaymentCancelHistory />;
      case "my-review":
        return <MyReview />;
      case "my-info-manage":
        return <MyInfoManage />;
      default:
        return <div>기능을 선택해 주세요.</div>;
    }
  }

  return (
    <div>
      <div className="my-page">
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <div className="my-page-main">
          <div className="my-page-wrapper">
            <div className="hello">{name}{name && "님"} 반가워요!</div>
            <div className="feature-area">
              <div className="feature-wrapper">
                <button
                  className={`payment-history ${
                    feature == "payment-history" ? "selected-ft" : ""
                  }`}
                  onClick={() => setFeature("payment-history")}
                >
                  예매내역
                </button>
                <button
                  className={`payment-cancel-history ${
                    feature == "payment-cancel-history" ? "selected-ft" : ""
                  }`}
                  onClick={() => setFeature("payment-cancel-history")}
                >
                  취소내역
                </button>
                {/* <button
                  className={`my-review ${
                    feature == "my-review" ? "selected-ft" : ""
                  }`}
                  onClick={() => setFeature("my-review")}
                >
                  리뷰관리
                </button> */}
                <button
                  className={`my-info-manage ${
                    feature == "my-info-manage" ? "selected-ft" : ""
                  }`}
                  onClick={() => setFeature("my-info-manage")}
                >
                  내 정보 관리
                </button>
              </div>
              <div className="feature-content">{renderFeatureContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
