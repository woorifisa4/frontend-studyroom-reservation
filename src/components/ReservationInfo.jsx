import React, { useState } from 'react';

const ReservationInfo = ({ reservation, setReservation }) => {
  const [reserver, setReserver] = useState(reservation.reserver);
  const [startTime, setStartTime] = useState(reservation.start.time);
  const [endTime, setEndTime] = useState(reservation.end.time);
  const [className, setClassName] = useState(reservation.start.cls);

  const times = [];
  for (let hour = 18; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 21 && minute > 30) break;
      times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }

  const classes = ['A', 'B', 'C', 'D', 'E'];

  const handleReserve = () => {
    if (reserver) {
      alert(`Reservation made by ${reserver} from ${startTime} to ${endTime} in Class ${className}`);
      setReservation(null);
    }
  };

  return (
    <div className="reservation-info fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 border rounded bg-white shadow-lg w-144 h-144 text-lg flex flex-col items-center">
      <div className="w-full mb-4 text-center">예약자: <input type="text" value={reserver} onChange={(e) => setReserver(e.target.value)} className="w-full p-2 border rounded mt-2" /></div>
      <div className="w-full mb-4 text-center">시작 시간: 
        <select value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full p-2 border rounded mt-2">
          {times.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>
      <div className="w-full mb-4 text-center">종료 시간: 
        <select value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full p-2 border rounded mt-2">
          {times.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>
      <div className="w-full mb-4 text-center">강의실: 
        <select value={className} onChange={(e) => setClassName(e.target.value)} className="w-full p-2 border rounded mt-2">
          {classes.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>
      <button onClick={handleReserve} className="mt-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">예약</button>
    </div>
  );
};

export default ReservationInfo;
