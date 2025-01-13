import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import CustomCalendar from './CustomCalendar';

const DateNavigation = ({ selectedDate, setSelectedDate }) => {
  const [isOpen, setIsOpen] = useState(false); // isDatePickerOpen을 isOpen으로 변경

  const changeDate = useCallback((days) => {
    const targetDate = new Date(selectedDate);
    targetDate.setDate(targetDate.getDate() + days);
    setSelectedDate(targetDate);
    updateURL(targetDate);
  }, [selectedDate, setSelectedDate]);

  const formatDate = useCallback((date) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short'
    };
    return date.toLocaleDateString('ko-KR', options)
      .replace(/\./g, '.')
      .replace(/ /g, '');
  }, []);

  const updateURL = useCallback((date) => {
    const formattedDate = date.toISOString().split('T')[0];
    window.history.pushState(null, '', `/reservations?date=${formattedDate}`);
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
        >
          <Calendar size={16} className="text-gray-500" />
          <span>{formatDate(selectedDate)}</span>
        </button>

        <button
          onClick={() => changeDate(1)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {isOpen && (
        <CustomCalendar
          selectedDate={selectedDate}
          setSelectedDate={(date) => {
            setSelectedDate(date);
            setIsOpen(false);
            updateURL(date);
          }}
        />
      )}
    </div>
  );
};

export default DateNavigation;