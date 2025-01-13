import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ReservationPage from "./pages/ReservationPage";

const Router = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const getDateParam = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('date') || new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to={`/reservations?date=${getDateParam()}`} /> : <LoginPage setUser={setUser} />} />
        <Route path="/signup" element={user ? <Navigate to={`/reservations?date=${getDateParam()}`} /> : <SignUpPage />} />
        <Route path="/reservations" element={user ? <ReservationPage user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;