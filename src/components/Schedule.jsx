import React, { useState } from 'react';

const Schedule = ({ setReservation, reservations }) => {
  const INTERVAL = 15; // Interval in minutes
  const classes = ['A', 'B', 'C', 'D', 'E'];
  const times = [];
  for (let hour = 18; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += INTERVAL) {
      if (hour === 21 && minute > 15) {
        break; // Ensure 21:30 is the last time
      }
      times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }

  const [selection, setSelection] = useState(null);
  const [start, setStart] = useState(null);
  const [reserver, setReserver] = useState('');

  const calculateEndTime = (startIndex, blocksSelected) => {
    const endIndex = startIndex + blocksSelected;
    return endIndex < times.length ? times[endIndex] : '21:30';
  };

  const handleMouseDown = (time, cls) => {
    setStart({ time, cls });
  };

  const isOverlapping = (startTime, endTime, cls) => {
    return reservations.some(reservation => 
      reservation.class === cls &&
      ((startTime >= reservation.start && startTime < reservation.end) ||
      (endTime > reservation.start && endTime <= reservation.end) ||
      (startTime <= reservation.start && endTime >= reservation.end))
    );
  };

  const handleMouseUp = (time, cls) => {
    if (start) {
      const startTimeIndex = times.indexOf(start.time);
      const endTimeIndex = times.indexOf(time);
      const blocksSelected = Math.max(1, endTimeIndex - startTimeIndex + 1);
      const endTime = calculateEndTime(startTimeIndex, blocksSelected);
      if (isOverlapping(start.time, endTime, cls)) {
        alert('선택한 시간대는 이미 예약되어 있습니다.');
        setStart(null);
        setSelection(null);
        return;
      }
      setSelection({ start, end: { time: endTime, cls } });
      setReservation({ start, end: { time: endTime, cls }, reserver });
    }
  };

  const isSelected = (time, cls) => {
    if (!selection) return false;
    const { start, end } = selection;
    const startTime = times.indexOf(start.time);
    const endTime = times.indexOf(end.time);
    const currentTime = times.indexOf(time);

    if (end.time === '21:30') {
      return cls === start.cls && currentTime >= startTime;
    }

    return cls === start.cls && currentTime >= startTime && currentTime < endTime;
  };

  const isReserved = (time, cls) => {
    return reservations.find(reservation => 
      reservation.room == cls && reservation.start <= time && time < reservation.end
    );
  };

  const getRandomLightColor = () => {
    const letters = 'BCDEF'; // Use only light colors
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };

  const reservationColors = reservations.reduce((acc, reservation) => {
    acc[reservation.reserver.id] = getRandomLightColor();
    return acc;
  }, {});

  return (
    <div className="schedule select-none">
      <div className="grid grid-cols-6 gap-0">
        <div></div>
        {classes.map(cls => (
          <div key={cls} className="font-bold text-center">{cls}</div>
        ))}
        {times.map(time => (
          <React.Fragment key={time}>
            <div className="font-bold h-12 w-24">{time}</div>
            {classes.map(cls => {
              const reservation = isReserved(time, cls);
              return (
                <div
                  key={cls}
                  className={`border p-2 cursor-pointer ${isSelected(time, cls) ? 'bg-blue-200' : ''}`}
                  style={{ backgroundColor: reservation ? reservationColors[reservation.reserver.id] : '', textAlign: 'center' }}
                  onMouseDown={() => handleMouseDown(time, cls)}
                  onMouseUp={() => handleMouseUp(time, cls)}
                >
                  {reservation ? reservation.reserver.name : ''}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
