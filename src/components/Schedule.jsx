import React, { useState } from 'react';

const Schedule = () => {
  const classes = ['A', 'B', 'C', 'D', 'E'];
  const times = [];
  for (let hour = 18; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 21 && minute > 30) break;
      times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }

  const [selection, setSelection] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [reserver, setReserver] = useState('');

  const handleMouseDown = (time, cls) => {
    setStart({ time, cls });
    setEnd(null);
  };

  const handleMouseUp = (time, cls) => {
    if (start) {
      setEnd({ time, cls });
      setSelection({ start, end: { time, cls } });
    }
  };

  const handleReserve = () => {
    if (selection && reserver) {
      alert(`Reservation made by ${reserver} from ${selection.start.time} to ${selection.end.time} in Class ${selection.start.cls}`);
      setSelection(null);
      setReserver('');
    }
  };

  const isSelected = (time, cls) => {
    if (!selection) return false;
    const { start, end } = selection;
    const startTime = times.indexOf(start.time);
    const endTime = times.indexOf(end.time);
    const currentTime = times.indexOf(time);
    return cls === start.cls && currentTime >= startTime && currentTime <= endTime;
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
            <div className="font-bold h-8 w-16">{time}</div>
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
      {selection && (
        <div className="reservation-info mt-4 p-4 border rounded">
          <div>Reserver: <input type="text" value={reserver} onChange={(e) => setReserver(e.target.value)} /></div>
          <div>Start: {selection.start.time}</div>
          <div>End: {selection.end.time}</div>
          <div>Class: {selection.start.cls}</div>
          <button onClick={handleReserve} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Reserve</button>
        </div>
      )}
    </div>
  );
};

export default Schedule;
