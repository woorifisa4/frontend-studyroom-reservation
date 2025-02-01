import React from "react";
import { Calendar } from "@heroui/calendar";
import { parseDate } from "@internationalized/date";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

// 날짜 포맷팅 유틸리티 함수
const formatDateToDisplay = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
};

const DateNavigation = ({
  selectedDate,
  setSelectedDate,
  isCalendarOpen,
  setIsCalendarOpen,
}) => {
  const navigate = useNavigate();

  // 날짜 이동 핸들러 수정
  const navigateDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    newDate.setHours(9, 0, 0, 0);

    const dateStr = newDate.toISOString().split("T")[0];
    navigate(`/reservations?date=${dateStr}`);
  };

  // 날짜 변경 핸들러 수정
  const handleDateChange = (date) => {
    setIsCalendarOpen(false);
    navigate(`/reservations?date=${date}`);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm">
        {/* 이전 날짜 버튼 */}
        <button
          onClick={() => navigateDate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="이전 날짜"
        >
          <ChevronLeft size={20} />
        </button>

        {/* 날짜 표시 및 캘린더 토글 버튼 */}
        <button
          onClick={() => setIsCalendarOpen((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="날짜 선택"
        >
          <CalendarIcon size={20} />
          <span className="font-medium">
            {formatDateToDisplay(selectedDate)}
          </span>
        </button>

        {/* 다음 날짜 버튼 */}
        <button
          onClick={() => navigateDate(1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="다음 날짜"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 캘린더 팝업 */}
      {isCalendarOpen && (
        <>
          {/* 배경 클릭 시 닫기 */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsCalendarOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 z-50 min-w-[fit-content]">
            <Calendar
              aria-label="Date picker"
              value={parseDate(selectedDate.toISOString().split("T")[0])}
              onChange={handleDateChange}
              className="bg-white rounded-lg shadow-lg"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DateNavigation;
