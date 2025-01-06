import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react';
import WeekView from './components/WeekView';
import Schedule from './components/Schedule';
import ReservationInfo from './components/ReservationInfo';
import DateNavigation from './components/DateNavigation';

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservation, setReservation] = useState(null);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('backdrop')) {
      setReservation(null);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen relative">
      <DateNavigation selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <WeekView selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <div className="my-4"></div>
      <Schedule setReservation={setReservation} />
      {reservation && (
        <div className="backdrop fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={handleBackdropClick}>
          <ReservationInfo reservation={reservation} setReservation={setReservation} />
        </div>
      )}
    </div>
  );
};

export default App;
