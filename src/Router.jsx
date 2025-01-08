import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from "./pages/AuthPage";
import ReservationPage from "./pages/ReservationPage";

const Router = () => {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/reservations" /> : <AuthPage setUser={setUser} />} />
        <Route path="/reservations" element={user ? <ReservationPage user={user} /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;