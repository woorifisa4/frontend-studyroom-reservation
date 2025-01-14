import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WEEK_DAYS, KOREA_TIME } from '../constants/calendar';

/**
 * 캘린더 컴포넌트
 * @param {Date} selectedDate - 선택된 날짜
 * @param {Function} setSelectedDate - 날짜 변경 함수
 */
const CustomCalendar = ({ selectedDate, setSelectedDate }) => {
  
  const [viewMonth, setViewMonth] = useState(new Date(selectedDate)); // 캘린더에서 현재 보여지는 년월을 관리
  const [calendarDays, setCalendarDays] = useState([]); // 달력에 표시될 날짜(화면)들을 관리

  /**
   * 해당 월의 총 일수 계산하는 함수
   */
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  /**
   * 해당 월의 시작 요일 계산하는 함수 (0: 일요일 ~ 6: 토요일)
   */
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  /**
   * 날짜를 클릭했을 때 처리하는 함수
   */
  const handleDateSelect = (dayNumber) => {
    const newDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), dayNumber);
    newDate.setHours(KOREA_TIME.HOURS, KOREA_TIME.MINUTES, KOREA_TIME.SECONDS, KOREA_TIME.MILLISECONDS);
    setSelectedDate(newDate); // selectedDate값을 사용자가 클릭한 날짜로 업데이트
  };

  /**
   * 월 이동을 처리하는 함수
   * @param {number} direction - 이동 방향 (-1: 이전 달, 1: 다음 달)
   */
  const navigateMonth = (direction) => {
    setViewMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth; 
    }); // 현재 보여지는 년월을 업데이트
  };

  // 컴포넌트가 처음 렌더링될 때와 viewMonth나 selectedDate가 변경될 때마다 실행
  // 캘린더에 표시될 화면을 계산하여 calendarDays 갱신
  useEffect(() => {
    const days = []; // 달력에 표시될 날짜들을 담을 배열
    const daysInMonth = getDaysInMonth(viewMonth.getFullYear(), viewMonth.getMonth()); // 현재 보여지는 달의 총 일수 (예: 30일 또는 31일)
    const firstDayOfMonth = getFirstDayOfMonth(viewMonth.getFullYear(), viewMonth.getMonth()); // 현재 보여지는 달의 1일이 무슨 요일인지 (0: 일요일 ~ 6: 토요일)
    
    // 오늘 날짜 (시스템 시간 기준)
    const today = new Date();
    today.setHours(9, 0, 0, 0); // 한국 시간 기준

    // 달력의 첫 주 빈칸 처리 (1일이 시작하는 요일까지 빈칸으로 채움)
    Array(firstDayOfMonth).fill(null).forEach((_, i) => {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    });

    // 달력에 날짜 버튼 생성
    Array.from({ length: daysInMonth }, (_, i) => i + 1).forEach(dayNumber => {
      // 체크할 날짜 생성 (한국 시간 9시로 설정)
      const dateToCheck = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), dayNumber);
      dateToCheck.setHours(9, 0, 0, 0);

      // 다르게 표시하는 조건인지 확인
      const isToday = dateToCheck.getTime() === today.getTime(); // 오늘 날짜인지 -> 배경색을 다르게 표시하기 위함
      const isSelected = dateToCheck.getTime() === selectedDate.getTime(); // 선택된 날짜인지 확인 -> 테두리 표시를 위함

      // 해당 날짜 버튼 생성
      days.push(
        <button
          key={`day-${dayNumber}`}
          onClick={() => handleDateSelect(dayNumber)}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm
            ${isToday ? 'bg-blue-500 text-white' : ''}
            ${isSelected ? 'border-2 border-blue-500' : ''}
            ${!isToday && !isSelected ? 'hover:bg-gray-100' : ''}`}
        >
          {dayNumber}
        </button>
      );
    });

    setCalendarDays(days); // 캘린더에 표시될 날짜 버튼들을 업데이트 -> 화면 갱신

  }, [viewMonth, selectedDate]); // viewMonth나 selectedDate가 변경될 때마다 실행

  return (
    <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg p-4 z-50">
      {/* 헤더 영역: 년월 표시 및 이동 버튼 */}
      <div className="flex items-center justify-between mb-4">
        {/* 이전 달 이동 버튼 */}
        <button
          onClick={() => navigateMonth(-1)}
          className="p-1 hover:bg-gray-100 rounded"
          aria-label="이전 달"
        >
          <ChevronLeft size={16} />
        </button>
        {/* // 이전 달 이동 버튼 */}

        {/* 년월 표시 */}
        <div className="font-medium">
          {viewMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
        </div>
        {/* // 년월 표시 */}

        {/* 다음 달 이동 버튼 */}
        <button
          onClick={() => navigateMonth(1)}
          className="p-1 hover:bg-gray-100 rounded"
          aria-label="다음 달"
        >
          <ChevronRight size={16} />
        </button>
        {/* // 다음 달 이동 버튼 */}

      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {/* 요일 헤더 */}
        {WEEK_DAYS.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {/* 날짜 그리드 */}
        {calendarDays}
      </div>
    </div>
  );
};

export default CustomCalendar;