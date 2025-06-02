import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isTokenValid } from "../utils/authUtils";
import { AppRoutes } from "./AppRoutes";

type Props = {
  children: React.ReactElement;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const isValid = isTokenValid();
  const location = useLocation();

  if(!isValid) {
    alert("Please login first.");
  }

  return !isValid ? (
    <Navigate to={AppRoutes.LOGIN_PAGE} state={{ from: location.pathname }} />
  ) : (
    children
  );
};

export default ProtectedRoute;
