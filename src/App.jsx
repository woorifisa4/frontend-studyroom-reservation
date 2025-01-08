import './App.css';

import React, { useState, useEffect } from 'react';
import Schedule from './components/Schedule';
import ReservationInfo from './components/ReservationInfo';
import DateNavigation from './components/DateNavigation';
import FloatingActionButton from './components/FloatingActionButton';
import { fetchReservations } from './api/fetchReservations';

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // 사용자가 예약을 조회하고자 하는 날짜
  const [plannedReservation, setPlannedReservation] = useState(null); // 사용자가 현재 예약하고자 하는 일정
  const [reservations, setReservations] = useState([]); // 특정 날짜에 예약된 일정 목록
  const [isFabActivated, setIsFabActivated] = useState(false); // FAB 버튼 활성화 여부
  const [user, setUser] = useState({ id: 1, name: '남승현', email: 'namsh1125@naver.com' })

  useEffect(() => {
    const loadReservations = async () => {
      const data = await fetchReservations(selectedDate.toISOString().split('T')[0]);
      setReservations(data);
    };

    loadReservations();
  }, [selectedDate]);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('backdrop')) {
      setPlannedReservation(null);
      setIsFabActivated(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen relative">
      <DateNavigation selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <div className="my-4"></div>
      <Schedule
        reservations={reservations}
        selectedDate={selectedDate}
        setPlannedReservation={setPlannedReservation}
      />
      {plannedReservation && (
        <div className="backdrop fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20" onClick={handleBackdropClick}>
          <ReservationInfo
            user={user}
            selectedDate={selectedDate}
            plannedReservation={plannedReservation}
            setPlannedReservation={setPlannedReservation}
            reservations={reservations}
            setReservations={setReservations}
          />
        </div>
      )}
      <FloatingActionButton isFabActivated={isFabActivated} setIsFabActivated={setIsFabActivated} />
    </div>
  );
};

export default App;
