import React, { useState } from 'react';

const ReservationInfo = ({ reservation, setReservation, reservations }) => {
  const [reserver, setReserver] = useState(reservation.reserver.name);

  const handleReserve = () => {
    if (reserver) {
      alert(`${reservation.start.time}부터 ${reservation.end.time}까지 ${reservation.start.cls} 강의실을 예약했습니다.`);
      setReservation(null);
    }
  };

  return (
    <div className="reservation-info fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 border rounded bg-white shadow-lg w-144 h-144 text-lg flex flex-col items-center">
      <div className="w-full mb-4 text-center">예약자: <input type="text" value={reserver} onChange={(e) => setReserver(e.target.value)} className="ml-2 p-2 border rounded" /></div>
      <div className="w-full mb-5">예약 시간: {reservation.start.time} ~ {reservation.end.time}</div>
      <div className="w-full mb-4">강의실: {reservation.start.cls}</div>
      <button onClick={handleReserve} className="mt-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">예약</button>
    </div>
  );
};

export default ReservationInfo;
