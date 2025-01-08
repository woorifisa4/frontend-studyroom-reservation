import React, { useState } from 'react';

const Schedule = ({ reservations, setPlannedReservation }) => {
  const INTERVAL = 15; // 예약 시간 간격
  const classes = ['A', 'B', 'C', 'D', 'E'];
  const times = []; // 가능한 예약 시간대 목록

  // 18:00부터 21:30까지 15분 간격으로 예약 가능한 시간대 생성
  for (let hour = 18; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += INTERVAL) {
      if (hour === 21 && minute > 15) {
        break; // 21:30 이후는 예약 불가능
      }
      times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`); // 시간 형식 맞추기 (hh:mm)
    }
  }

  const [selection, setSelection] = useState(null); // 선택한 예약 정보 (시작 시간, 종료 시간, 강의실)

  // 이미 예약된 시간인지 반환하는 함수
  const isReserved = (startTime, classRoom) => {
    return reservations.find(reservation =>
      reservation.room === classRoom && reservation.start <= startTime && startTime < reservation.end
    );
  };

  // 예약된 일정과 사용자가 예약하고자 하는 일정이 출돌이 나는지 반환하는 함수
  const isConflict = (startTime, endTime, classRoom) => {
    return reservations.some(reservation =>
      reservation.room === classRoom &&
      ((startTime >= reservation.start && startTime < reservation.end) ||
        (endTime > reservation.start && endTime <= reservation.end) ||
        (startTime <= reservation.start && endTime >= reservation.end))
    );
  };

  // 사용자가 해당 시간대(time)와 강의실을 예약했는지 반환하는 함수
  const isSelected = (time, classRoom) => {
    if (!selection) return false;

    const { start, end, room } = selection;
    return classRoom === room && time >= start && time < end;
  };

  // 마우스 이벤트 핸들러 (마우스 다운)
  const handleMouseDown = (time, classRoom) => {
    setSelection({ start: time, end: time, room: classRoom });
  };

  // 마우스 이벤트 핸들러 (마우스 업)
  const handleMouseUp = (time, classRoom) => {
    if (selection) {
      const selectedBlocksCount = Math.max(1, times.indexOf(time) - times.indexOf(selection.start) + 1);
      const endTimeIndex = times.indexOf(selection.start) + selectedBlocksCount;

      const startTime = selection.start;
      const endTime = endTimeIndex < times.length ? times[endTimeIndex] : '21:30:00'

      if (isConflict(startTime, endTime, classRoom)) {
        alert('선택한 시간대는 이미 예약되어 있습니다.');
        setSelection(null);
        return;
      }

      const finalizedSelection = { start: startTime, end: endTime, room: classRoom };
      setSelection(finalizedSelection);
      setPlannedReservation({ ...finalizedSelection });
    }
  };

  // 랜덤 색상 생성하는 함수 (밝은 색상)
  const getRandomLightColor = () => {
    const letters = 'BCDEF'; // 밝은 색상 조합 
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };

  // 예약자별 랜덤 색상을 반환하는 함수
  const reservationColors = reservations.reduce((acc, reservation) => {
    acc[reservation.reserver.id] = getRandomLightColor();
    return acc;
  }, {});

  return (
    <div className="schedule select-none">
      <div className="grid grid-cols-6 gap-0">
        <div></div>
        {/* Class 정보 출력 */}
        {classes.map(cls => (
          <div key={cls} className="font-bold text-center">{cls}</div>
        ))}

        {/* 시간 및 예약 정보 출력 */}
        {times.map(time => (
          <React.Fragment key={time}>
            {/* 시간 출력 (hh:mm까지만 출력) */}
            <div className="font-bold h-12 w-24">{time.slice(0, 5)}</div>

            {/* 예약 정보 출력 */}
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
