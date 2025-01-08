import React from 'react';
import { createReservation } from '../api/createReservation';

const ReservationInfo = ({ user, selectedDate, plannedReservation, setPlannedReservation, reservations, setReservations }) => {

  const requestCreateReservation = async () => {
    if (user && plannedReservation) {
      try {
        console.log('Creating reservation:', plannedReservation);
        const newReservation = await createReservation(
          plannedReservation.room, // 예약 테이블
          selectedDate, // 예약 날짜
          plannedReservation.start, // 예약 시작 시간
          plannedReservation.end, // 예약 종료 시간
          "test", // 예약 설명 (TODO: 사용자 입력 받기)
          user.id, // 예약자 ID
          [] // 참여자 목록
        );
        
        setReservations([...reservations, newReservation]);
        setPlannedReservation(null);
        alert("강의실 예약에 성공했습니다.");
        
      } catch (error) {
        console.error('Error creating reservation:', error);
      }
    }
  };

  const handleReserve = () => {
    if (user && plannedReservation) {
      requestCreateReservation();
    }
  };

  return (
    <div className="reservation-info fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 border rounded bg-white shadow-lg w-144 h-144 text-lg flex flex-col items-center">
      <div className="w-full mb-4">예약자: {user.name}</div>
      <div className="w-full mb-5">예약 시간: {plannedReservation.start} ~ {plannedReservation.end}</div>
      <div className="w-full mb-4">강의실: {plannedReservation.room}</div>
      <button onClick={handleReserve} className="mt-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">예약</button>
    </div>
  );
};

export default ReservationInfo;
