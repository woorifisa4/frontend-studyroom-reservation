import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from "./pages/AuthPage";
import ReservationPage from "./pages/ReservationPage";

const Router = () => {
  const [user, setUser] = useState(null);
  const today = new Date().toISOString().split('T')[0];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to={`/reservations?date=${today}`} /> : <AuthPage setUser={setUser} />} />
        <Route path="/reservations" element={user ? <ReservationPage user={user} /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;