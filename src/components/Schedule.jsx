import React, { useState, useEffect, useMemo } from "react";
import ReservationTooltip from "./ReservationTooltip";
import { CLASSES, TIME_FORMAT, BUSINESS_HOUR } from "../constants/reservation";
import { getRandomLightColor } from "../utils/color";
import { generateReservationTimeSlots } from "../utils/reservation";
import { formatTime } from "../utils/date";
import { showToast } from "../ui/Toast";

const Schedule = ({
  reservations = [], // 기본값 추가
  selectedDate,
  setPlannedReservation,
  currentUser,
}) => {
  const times = useMemo(() => generateReservationTimeSlots(), []); // 시간 슬롯을 메모이제이션

  const [selection, setSelection] = useState(null); // 선택한 예약 정보 (시작 시간, 종료 시간, 강의실)
  const [isDragging, setIsDragging] = useState(false); // 드래그 중인지 여부
  const [dragEndTime, setDragEndTime] = useState(null); // 드래그 종료 시간
  const [tooltipInfo, setTooltipInfo] = useState(null); // 현재 보여지는 툴팁의 정보를 저장
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // 예약이 완료되면 선택한 예약 정보 초기화
  useEffect(() => {
    if (!setPlannedReservation) {
      setSelection(null);
      setIsDragging(false);
      setDragEndTime(null);
    }
  }, [setPlannedReservation]);

  // 사용자별 색상을 메모이제이션하여 재렌더링시에도 유지
  const reservationColors = useMemo(() => {
    if (!Array.isArray(reservations)) return {}; // reservations가 배열이 아닐 경우 빈 객체 반환

    const colors = {};
    reservations.forEach((reservation) => {
      if (reservation?.reserver?.id && !colors[reservation.reserver.id]) {
        colors[reservation.reserver.id] = getRandomLightColor();
      }
    });

    return colors;
  }, [reservations]); // reservations가 배열이 아닐 경우 빈 문자열을 디펜던시에 포함

  // 이미 예약된 시간인지 반환하는 함수 수정
  const isReserved = (time, classRoom) => {
    if (!Array.isArray(reservations)) return false;

    // 예약 정보 찾기
    const foundReservation = reservations.find(
      (reservation) =>
        reservation.table === classRoom &&
        time >= reservation.start &&
        time < reservation.end
    );

    // 예약 정보가 있고 시작 시간과 일치하면 전체 예약 정보를 반환, 아니면 true/false만 반환
    return foundReservation || false;
  };

  // 예약된 일정과 사용자가 예약하고자 하는 일정이 출돌이 나는지 반환하는 함수
  const isConflict = (startTime, endTime, classRoom) => {
    if (!Array.isArray(reservations)) return false;
    return reservations.some(
      (reservation) =>
        reservation.table === classRoom &&
        !(endTime <= reservation.start || startTime >= reservation.end)
    );
  };

  // 사용자가 해당 시간대(time)와 강의실을 예약했는지 반환하는 함수
  const isSelected = (time, classRoom) => {
    if (!selection || !isDragging) return false;

    const { start, table } = selection;
    const end = dragEndTime || start;
    const startIdx = times.indexOf(start);
    const endIdx = times.indexOf(end);
    const timeIdx = times.indexOf(time);

    if (table !== classRoom) return false;
    return (
      timeIdx >= Math.min(startIdx, endIdx) &&
      timeIdx <= Math.max(startIdx, endIdx)
    );
  };

  // 종료 시간을 계산하는 헬퍼 함수 수정
  const getEndTime = (time) => {
    const timeIndex = times.indexOf(time);
    if (timeIndex === times.length - 1) return BUSINESS_HOUR.END;
    return times[timeIndex + 1];
  };

  // 마우스 이벤트 핸들러 (마우스를 누를 때의 동작)
  const handleMouseDown = (time, classRoom) => {
    if (isReserved(time, classRoom)) return;

    setSelection({ start: time, table: classRoom });
    setIsDragging(true);
    setDragEndTime(time);
  };

  // 마우스 이벤트 핸들러 (마우스를 움직일 때의 동작)
  const handleMouseEnter = (time, classRoom) => {
    if (!isDragging || selection?.table !== classRoom) return;
    setDragEndTime(time);
  };

  // 마우스 이벤트 핸들러 (마우스를 뗄 때의 동작)
  const handleMouseUp = (time, classRoom) => {
    if (!isDragging || selection?.table !== classRoom) {
      setIsDragging(false);
      setSelection(null);
      setDragEndTime(null);
      return;
    }

    const startIdx = times.indexOf(selection.start);
    const endIdx = times.indexOf(time);
    const startTime = times[Math.min(startIdx, endIdx)];
    const endTimeIdx = Math.max(startIdx, endIdx) + 1;
    const endTime = endTimeIdx < times.length ? times[endTimeIdx] : "21:30:00";

    // 2시간 초과 예약 체크
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diffHours = (end - start) / (1000 * 60 * 60);

    if (diffHours > 2) {
      showToast("최대 2시간까지만 예약할 수 있습니다.", "error");
      setSelection(null);
      setIsDragging(false);
      setDragEndTime(null);
      return;
    }

    // 이미 예약된 시간인 경우 예약 불가
    if (isConflict(startTime, endTime, classRoom)) {
      showToast("선택한 시간대는 이미 예약되어 있습니다.", "error");
      setSelection(null);
      setIsDragging(false);
      setDragEndTime(null);
      return;
    }

    // 예약 정보 설정
    const finalizedSelection = {
      start: startTime,
      end: endTime,
      table: classRoom,
    };
    setPlannedReservation({ ...finalizedSelection, selectedDate });
    setIsDragging(false);
    setDragEndTime(null);
  };

  return (
    <div className="schedule select-none p-4 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-6 gap-0 border border-gray-200 rounded-lg overflow-visible relative">
        {/* Header */}
        <div className="bg-gray-50 p-3 border-b border-gray-200 w-40"></div>
        {CLASSES.map((cls) => (
          <div
            key={cls}
            className="bg-gray-50 p-3 font-semibold text-center border-b border-l border-gray-200"
          >
            테이블 {cls}
          </div>
        ))}

        {times.slice(0, -1).map((time) => (
          <React.Fragment key={time}>
            {/* Time column */}
            <div className="font-medium text-sm p-3 border-b border-gray-200 bg-gray-50 w-40 whitespace-nowrap text-center">
              {`${formatTime(time)} ~ ${formatTime(getEndTime(time))}`}
            </div>

            {/* Reservation slots */}
            {CLASSES.map((cls) => {
              const reservation = isReserved(time, cls);
              return (
                <div
                  key={cls}
                  className={`relative border-b border-l border-gray-200 transition-all duration-200
                    ${
                      isSelected(time, cls)
                        ? "bg-blue-100 hover:bg-blue-200"
                        : "hover:bg-gray-50"
                    }
                    ${isDragging ? "cursor-pointer" : "cursor-default"}
                  `}
                  style={{
                    backgroundColor: reservation
                      ? reservationColors[reservation.reserver?.id]
                      : undefined,
                  }}
                  onMouseDown={() => handleMouseDown(time, cls)}
                  onMouseEnter={(e) => {
                    handleMouseEnter(time, cls);
                    if (reservation) {
                      setTooltipInfo(reservation);
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltipPosition({
                        x: rect.right,
                        y: rect.top,
                      });
                    }
                  }}
                  onMouseLeave={() => {
                    setTooltipInfo(null);
                  }}
                  onMouseUp={() => handleMouseUp(time, cls)}
                >
                  {reservation && reservation.reserver?.name && (
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700 truncate px-2">
                          {reservation.reserver.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      {tooltipInfo && (
        <div
          style={{
            position: "fixed",
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setTooltipInfo(tooltipInfo); // tooltip 정보 유지
          }}
          onMouseLeave={(e) => {
            const tooltipRect = e.currentTarget.getBoundingClientRect();
            const isMouseInTooltip =
              e.clientX >= tooltipRect.left &&
              e.clientX <= tooltipRect.right &&
              e.clientY >= tooltipRect.top &&
              e.clientY <= tooltipRect.bottom;

            if (!isMouseInTooltip) {
              setTooltipInfo(null);
            }
          }}
        >
          <ReservationTooltip
            reservation={tooltipInfo}
            currentUser={currentUser}
          />
        </div>
      )}
      {/* Legend - 중앙 정렬 및 스타일 개선 */}
      <div className="mt-4 flex items-center justify-center text-sm text-gray-600 space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded mr-2"></div>
          <span>선택된 시간</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded mr-2"></div>
          <span>예약 가능</span>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
