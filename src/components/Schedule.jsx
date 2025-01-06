import React, { useState } from 'react';

const Schedule = ({ setReservation }) => {
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
  const [end, setEnd] = useState(null);
  const [reserver, setReserver] = useState('');

  const calculateEndTime = (startIndex, blocksSelected) => {
    const endIndex = startIndex + blocksSelected;
    return endIndex < times.length ? times[endIndex] : '21:30';
  };

  const handleMouseDown = (time, cls) => {
    setStart({ time, cls });
    setEnd(null);
  };

  const handleMouseUp = (time, cls) => {
    if (start) {
      const startTimeIndex = times.indexOf(start.time);
      const endTimeIndex = times.indexOf(time);
      const blocksSelected = Math.max(1, endTimeIndex - startTimeIndex + 1);
      const endTime = calculateEndTime(startTimeIndex, blocksSelected);
      setEnd({ time: endTime, cls });
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
            {classes.map(cls => (
              <div
                key={cls}
                className={`border p-2 cursor-pointer ${isSelected(time, cls) ? 'bg-blue-200' : ''}`}
                onMouseDown={() => handleMouseDown(time, cls)}
                onMouseUp={() => handleMouseUp(time, cls)}
              ></div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
