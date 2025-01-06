import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateNavigation = ({ selectedDate, setSelectedDate }) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' };
    return date.toLocaleDateString('ko-KR', options).replace(/\./g, '.');
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
  };

  const handleClickOutside = (event) => {
    if (event.target.closest('.date-picker-container')) return;
    setIsDatePickerOpen(false);
  };

  return (
    <header className="flex items-center justify-between w-full max-w-md relative">
      <button
        onClick={() => changeDate(-1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        &lt;
      </button>
      <div
        className="relative"
        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
      >
        <h1 className="text-xl font-bold cursor-pointer">
          {formatDate(selectedDate)}
        </h1>
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
