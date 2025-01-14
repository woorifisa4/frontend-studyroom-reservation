import React, { useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import CustomCalendar from './CustomCalendar';
import { formatDateToKorean } from '../utils/date';

/**
 * 날짜 네비게이션 컴포넌트
 * @param {Date} currentDate - 현재 선택된 날짜
 * @param {Function} setCurrentDate - 날짜 변경 함수
 * @param {boolean} isCalendarVisible - 달력 표시 여부
 * @param {Function} setCalendarVisible - 달력 표시 상태 변경 함수
 */
const DateNavigation = ({ 
  selectedDate: currentDate, 
  setSelectedDate: setCurrentDate, 
  isCalendarOpen: isCalendarVisible, 
  setIsCalendarOpen: setCalendarVisible 
}) => {
  // 날짜 이동 처리 함수 (이전/다음)
  const navigateDate = useCallback((daysToMove) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + daysToMove);
    setCurrentDate(newDate);
    updateURLWithDate(newDate);
  }, [currentDate, setCurrentDate]);

  // URL에 선택된 날짜 반영
  const updateURLWithDate = useCallback((date) => {
    const dateString = date.toISOString().split('T')[0];
    window.history.pushState(null, '', `/reservations?date=${dateString}`);
  }, []);

  // 달력 토글 핸들러
  const toggleCalendar = () => {
    setCalendarVisible(!isCalendarVisible);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        {/* 이전 날짜 버튼 */}
        <button
          onClick={() => navigateDate(-1)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
          aria-label="이전 날짜"
        >
          <ChevronLeft size={16} />
        </button>

        {/* 현재 날짜 표시 및 달력 토글 버튼 */}
        <button
          onClick={toggleCalendar}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
        >
          <Calendar size={16} className="text-gray-500" />
          <span>{formatDateToKorean(currentDate)}</span>
        </button>

        {/* 다음 날짜 버튼 */}
        <button
          onClick={() => navigateDate(1)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
          aria-label="다음 날짜"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 달력 컴포넌트 */}
      {isCalendarVisible && (
        <CustomCalendar
          selectedDate={currentDate}
          setSelectedDate={(newDate) => {
            setCurrentDate(newDate);
            setCalendarVisible(false);
            updateURLWithDate(newDate);
          }}
        />
      )}
    </div>
  );
};

export default DateNavigation;