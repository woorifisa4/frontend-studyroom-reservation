import React, { useState } from 'react';
import { createReservation } from '../api/createReservation';

const ReservationInfo = ({ user, selectedDate, plannedReservation, setPlannedReservation, reservations, setReservations }) => {
  const [description, setDescription] = useState(""); // 예약 설명

  const requestCreateReservation = async () => {
    if (user && plannedReservation) {
      try {
        console.log('Creating reservation:', plannedReservation);
        const newReservation = await createReservation(
          plannedReservation.room, // 예약 테이블
          selectedDate, // 예약 날짜
          plannedReservation.start, // 예약 시작 시간
          plannedReservation.end, // 예약 종료 시간
          description, // 예약 설명
          user.id, // 예약자 ID
          [] // 참여자 목록
        );

        setReservations([...reservations, newReservation]);
        setPlannedReservation(null);
        setDescription("");
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

  const formatDate = (date) => {
    if (!date) return '';
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate)
      ? parsedDate.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          weekday: 'short', // 요일을 축약형으로 표시 (예: (수))
        })
      : '';
  };

  const formatTime = (time) => {
    if (!time) return '';
    const parsedTime = new Date(time);
    return parsedTime instanceof Date && !isNaN(parsedTime) ? parsedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''; // 24시간 형식 (예: 20:00)
  };

  return (
    <div className="reservation-info fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 border rounded bg-white shadow-lg w-144 h-144 text-lg flex flex-col items-center">
      <div className="w-full flex mb-4">
        <div className="w-24">예약자:</div>
        <div className="w-36">{user.name}</div>
      </div>
      <div className="w-full flex mb-4">
        <div className="w-24">예약 날짜:</div>
        <div className="w-36">{formatDate(selectedDate)}</div>
      </div>
      <div className="w-full flex mb-4">
        <div className="w-24">예약 시간:</div>
        <div className="w-36">{formatTime(new Date(selectedDate.setHours(plannedReservation.start.split(':')[0], plannedReservation.start.split(':')[1])))} ~ {formatTime(new Date(selectedDate.setHours(plannedReservation.end.split(':')[0], plannedReservation.end.split(':')[1])))}</div>
      </div>
      <div className="w-full flex mb-4">
        <div className="w-24">테이블:</div>
        <div className="w-36">{plannedReservation.room}</div>
      </div>
      <div className="w-full mb-4">
        <label className="block mb-2">예약 사유</label>
        <textarea
          className="w-full p-2 border rounded resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="CS 스터디"
        />
      </div>
      <button onClick={handleReserve} className="mt-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">예약</button>
    </div>
  );
};

export default ReservationInfo;
