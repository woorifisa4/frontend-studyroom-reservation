import React from 'react';

const ReservationInfo = ({ user, plannedReservation, setPlannedReservation }) => {
  const handleReserve = () => {
    if (user && plannedReservation) {
      // Todo: 예약 생성 API 호출

      alert(`${plannedReservation.start}부터 ${plannedReservation.end}까지 ${plannedReservation.room} 강의실을 예약했습니다.`);
      setPlannedReservation(null);
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
