import React, { useState, useEffect, useMemo } from 'react';

const Schedule = ({ reservations, selectedDate, setPlannedReservation }) => {
  const INTERVAL = 15; // 예약 시간 간격
  const classes = ['A', 'B', 'C', 'D', 'E'];
  const times = []; // 가능한 예약 시간대 목록

  // 18:00부터 21:30까지 15분 간격으로 예약 가능한 시간대 생성
  for (let hour = 18; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += INTERVAL) {
      if (hour === 21 && minute > 15) break;  // 21:30 이후는 예약 불가능
      times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`);
    }
  }

  const [selection, setSelection] = useState(null); // 선택한 예약 정보 (시작 시간, 종료 시간, 강의실)
  const [isDragging, setIsDragging] = useState(false); // 드래그 중인지 여부
  const [dragEndTime, setDragEndTime] = useState(null); // 드래그 종료 시간

  // 예약이 완료되면 선택한 예약 정보 초기화
  useEffect(() => {
    if (!setPlannedReservation) {
      setSelection(null);
      setIsDragging(false);
      setDragEndTime(null);
    }
  }, [setPlannedReservation]);

  // 랜덤 색상 생성하는 함수 (밝은 색상)
  const getRandomLightColor = () => {
    const letters = 'BCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  };

  // 사용자별 색상을 메모이제이션하여 재렌더링시에도 유지
  const reservationColors = useMemo(() => {
    const colors = {};
    reservations.forEach(reservation => {
      if (!colors[reservation.reserver.id]) {
        colors[reservation.reserver.id] = getRandomLightColor();
      }
    });

    return colors;
  }, [reservations.map(r => r.reserver.id).join(',')]); // 예약자 ID 목록이 변경될 때만 색상 재생성

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
    if (!selection || !isDragging) return false;

    const { start, room } = selection;
    const end = dragEndTime || start;
    const startIdx = times.indexOf(start);
    const endIdx = times.indexOf(end);
    const timeIdx = times.indexOf(time);

    if (room !== classRoom) return false;
    return timeIdx >= Math.min(startIdx, endIdx) && timeIdx <= Math.max(startIdx, endIdx);
  };

  // 마우스 이벤트 핸들러 (마우스를 누를 때의 동작)
  const handleMouseDown = (time, classRoom) => {
    if (isReserved(time, classRoom)) return;
    
    setSelection({ start: time, room: classRoom });
    setIsDragging(true);
    setDragEndTime(time);
  };

  // 마우스 이벤트 핸들러 (마우스를 움직일 때의 동작)
  const handleMouseEnter = (time, classRoom) => {
    if (!isDragging || selection?.room !== classRoom) return;
    setDragEndTime(time);
  };

  // 마우스 이벤트 핸들러 (마우스를 뗄 때의 동작)
  const handleMouseUp = (time, classRoom) => {
    if (!isDragging || selection?.room !== classRoom) {
      setIsDragging(false);
      setSelection(null);
      setDragEndTime(null);
      return;
    }

    const startIdx = times.indexOf(selection.start); // 시작 시간 인덱스
    const endIdx = times.indexOf(time); // 종료 시간 인덱스
    const startTime = times[Math.min(startIdx, endIdx)]; // 시작 시간
    const endTimeIdx = Math.max(startIdx, endIdx) + 1; // 종료 시간 인덱스
    const endTime = endTimeIdx < times.length ? times[endTimeIdx] : '21:30:00'; // 종료 시간

    // 이미 예약된 시간인 경우 예약 불가
    if (isConflict(startTime, endTime, classRoom)) {
      alert('선택한 시간대는 이미 예약되어 있습니다.');
      setSelection(null);
      setIsDragging(false);
      setDragEndTime(null);
      return;
    }

    // 예약 정보 설정
    const finalizedSelection = { start: startTime, end: endTime, room: classRoom };
    setPlannedReservation({ ...finalizedSelection, selectedDate });
    setIsDragging(false);
    setDragEndTime(null);
  };

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
                  style={{ 
                    backgroundColor: reservation ? reservationColors[reservation.reserver.id] : '',
                    textAlign: 'center'
                  }}
                  onMouseDown={() => handleMouseDown(time, cls)}
                  onMouseEnter={() => handleMouseEnter(time, cls)}
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