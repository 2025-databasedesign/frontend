import React from "react";
import { BrowserRouter } from "react-router-dom";
import MyRoute from "./routes/MyRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MyRoute />
    </BrowserRouter>
  );
};

export default App;