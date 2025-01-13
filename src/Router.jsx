import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ReservationPage from "./pages/ReservationPage";

const Router = () => {
  const [user, setUser] = useState(null);
  const today = new Date().toISOString().split('T')[0];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to={`/reservations?date=${today}`} /> : <LoginPage setUser={setUser} />} />
        <Route path="/signup" element={user ? <Navigate to={`/reservations?date=${today}`} /> : <SignUpPage />} />
        <Route path="/reservations" element={user ? <ReservationPage user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;