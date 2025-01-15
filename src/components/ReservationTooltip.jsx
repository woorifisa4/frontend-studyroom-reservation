import React from 'react';
import { formatTime } from '../utils/date';
import { reservationApi } from '../api/reservationApi';

const ReservationTooltip = ({ reservation, currentUser }) => {
  if (!reservation) return null;

  const isOwner = currentUser?.id === reservation.reserver.id;

  const onDelete = async (e) => {
    e.stopPropagation(); // 이벤트 전파 방지
    if (window.confirm('예약을 삭제하시겠습니까?')) {
      await reservationApi.delete(reservation.id);

      // TODO: 상태 관리를 통한 리렌더링 방법으로 변경
      window.location.reload(); // 삭제 후 페이지 새로고침
    }
  }

  return (
    <div className="absolute z-[9999] bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72"
         style={{
           left: '100%',
           top: '0',
           marginLeft: '8px',
         }}
         onClick={e => e.stopPropagation()} // 이벤트 전파 방지
         onMouseEnter={e => e.stopPropagation()} // 이벤트 전파 방지
         onMouseLeave={e => e.stopPropagation()} // 이벤트 전파 방지
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">예약 정보</h3>
        {isOwner && (
          <button
            onClick={(e) => onDelete(e)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            삭제
          </button>
        )}
      </div>
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
