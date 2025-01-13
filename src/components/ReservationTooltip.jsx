import React from 'react';

const ReservationTooltip = ({ reservation }) => {
  if (!reservation) return null;

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  return (
    <div className="absolute z-[9999] pointer-events-none bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72"
         style={{
           left: '100%',
           top: '0',
           marginLeft: '8px',
         }}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">예약 정보</h3>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <span className="text-gray-500 w-20">• 예약자</span>
          <span className="font-medium text-gray-800">{reservation.reserver.name}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-gray-500 w-20">• 예약 시간</span>
          <span className="font-medium text-gray-800">
            {formatTime(reservation.start)} ~ {formatTime(reservation.end)}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-gray-500 w-20">• 예약 장소</span>
          <span className="font-medium text-gray-800">테이블 {reservation.room}</span>
        </div>
      </div>
    </div>
  );
};

export default ReservationTooltip;
