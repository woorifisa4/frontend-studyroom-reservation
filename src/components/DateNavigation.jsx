import React from 'react';

const DateNavigation = ({ selectedDate, setSelectedDate }) => {
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' };
    return date.toLocaleDateString('ko-KR', options).replace(/\./g, '.');
  };

  return (
    <header className="flex items-center justify-between w-full max-w-md">
      <button
        onClick={() => changeDate(-1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        &lt;
      </button>
      <h1 className="text-xl font-bold">{formatDate(selectedDate)}</h1>
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
