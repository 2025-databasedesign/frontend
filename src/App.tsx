import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import MyRoute from "./routes/MyRoute";
import { isTokenValid } from "./utils/authUtils";
import { useCinemaRelatedStore } from "./stores/CinemaRelatedStore";

const App: React.FC = () => {
  useEffect(() => {
    const valid  = isTokenValid();

    if (!valid ) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("expires_at");
    }
    useCinemaRelatedStore.getState().setIsLogin(valid);
  }, []);

  return (
    <BrowserRouter>
      <MyRoute />
    </BrowserRouter>
  );
};

export default App;
