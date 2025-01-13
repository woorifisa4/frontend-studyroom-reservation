import React, { useState, useEffect } from 'react';
import Schedule from '../components/Schedule';
import ReservationInfo from '../components/ReservationInfo';
import DateNavigation from '../components/DateNavigation';
import FloatingActionButton from '../components/FloatingActionButton';
import { fetchReservations } from '../api/fetchReservations';

const ReservationPage = ({user}) => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // 사용자가 예약을 조회하고자 하는 날짜
  const [plannedReservation, setPlannedReservation] = useState(null); // 사용자가 현재 예약하고자 하는 일정
  const [reservations, setReservations] = useState([]); // 특정 날짜에 예약된 일정 목록
  const [isFabActivated, setIsFabActivated] = useState(false); // FAB 버튼 활성화 여부

  // 선택한 날짜에 해당하는 예약 목록을 불러오는 함수
  useEffect(() => {
    const loadReservations = async () => {
      const response = await fetchReservations(selectedDate.toISOString().split('T')[0]);
      setReservations(response.data);
    };

    loadReservations();
  }, [selectedDate]);

  // FAB 버튼 외부를 클릭했을 때 실행되는 함수
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

      {/* 사용자가 예약하고자 하는 일정이 있을 때 (Schedule에 드래그 해서 예약 일정을 생성했을 때) */}
      {plannedReservation && (
        <div className="backdrop fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20" onClick={handleBackdropClick}>
          <ReservationInfo
            user={user}
            selectedDate={selectedDate}
            plannedReservation={plannedReservation}
            setPlannedReservation={setPlannedReservation}
            setReservations={setReservations}
          />
        </div>
      )}
      <FloatingActionButton isFabActivated={isFabActivated} setIsFabActivated={setIsFabActivated} />
    </div>
  );
};

export default ReservationPage;