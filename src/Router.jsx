import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ReservationPage from "./pages/ReservationPage";
import { useUser } from "./context/UserContext";

const Router = () => {
  const { user } = useUser();

  const getDateParam = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("date") || new Date().toISOString().split("T")[0];
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={`/reservations?date=${getDateParam()}`} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={`/reservations?date=${getDateParam()}`} />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to={`/reservations?date=${getDateParam()}`} />
            ) : (
              <SignUpPage />
            )
          }
        />
        <Route
          path="/reservations"
          element={
            user ? <ReservationPage user={user} /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
