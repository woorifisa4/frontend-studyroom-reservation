import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react';
import WeekView from './components/WeekView';
import Schedule from './components/Schedule';
import ReservationInfo from './components/ReservationInfo';

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservation, setReservation] = useState(null);

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' };
    return date.toLocaleDateString('ko-KR', options).replace(/\./g, '.');
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <header className="flex items-center justify-between w-full max-w-md">
        <button
          onClick={handlePrevDay}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          &lt;
        </button>
        <h1 className="text-xl font-bold">{formatDate(selectedDate)}</h1>
        <button
          onClick={handleNextDay}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          &gt;
        </button>
      </header>
      <WeekView selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <Schedule setReservation={setReservation} />
      {reservation && <ReservationInfo reservation={reservation} setReservation={setReservation} />}
    </div>
  );
};

export default App;
