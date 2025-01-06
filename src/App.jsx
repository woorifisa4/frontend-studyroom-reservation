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

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <DateNavigation selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <WeekView selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <Schedule setReservation={setReservation} />
      {reservation && <ReservationInfo reservation={reservation} setReservation={setReservation} />}
    </div>
  );
};

export default App;
