import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateNavigation = ({ selectedDate, setSelectedDate }) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // days만큼 날짜를 변경하는 함수
  const changeDate = (days) => {
    // target Date 계산
    const targetDate = new Date(selectedDate);
    targetDate.setDate(targetDate.getDate() + days);

    setSelectedDate(targetDate); // 날짜 텍스트 변경
    updateURL(targetDate); // URL 변경
  };

  // 날짜 포맷 함수 (예: 2025.01.13(월)로 변환)
  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' };
    return date.toLocaleDateString('ko-KR', options).replace(/\./g, '.');
  };

  // URL을 변경하는 함수
  const updateURL = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    window.history.pushState(null, '', `/reservations?date=${formattedDate}`);
  };

  // Date Picker에서 날짜를 선택했을 때 실행되는 함수
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
    updateURL(date);
  };

  // Date Picker 외부를 클릭했을 때 실행되는 함수
  const handleClickOutside = (event) => {
    if (event.target.closest('.date-picker-container')) return;
    setIsDatePickerOpen(false);
  };

  return (
    <header className="flex items-center justify-between w-full max-w-md relative">
      {/* > 버튼 */}
      <button
        onClick={() => changeDate(-1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        &lt;
      </button>

      {/* 날짜 */}
      <div
        className="relative"
        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
      >
        {/* 날짜 텍스트 */}
        <h1 className="text-xl font-bold cursor-pointer">
          {formatDate(selectedDate)}
        </h1>

        {/* (날짜 텍스트를 클릭해서) Date Picker(캘린더)가 열려있을 때 */}
        {isDatePickerOpen && (
          <>
            <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={handleClickOutside}></div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 z-20 date-picker-container">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
              />
            </div>
          </>
        )}
      </div>

      {/* < 버튼 */}
      <button
        onClick={() => changeDate(1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        &gt;
      </button>
    </header>
  );
};

export default DateNavigation;
