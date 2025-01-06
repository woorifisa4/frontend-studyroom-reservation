import React from 'react';

const WeekView = ({ selectedDate, setSelectedDate }) => {
  const renderWeekDays = () => {
    const days = [];
    const startDate = new Date(selectedDate);
    startDate.setDate(selectedDate.getDate() - 3); // Start from 3 days before the selected date
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const isSelected = date.toDateString() === selectedDate.toDateString();
      days.push(
        <div
          key={i}
          className={`flex justify-center items-center w-16 h-16 border rounded-lg cursor-pointer ${isSelected ? 'bg-blue-500 text-white' : 'bg-white'
            } hover:bg-gray-200`}
          onClick={() => setSelectedDate(date)}
        >
          {date.getDate()}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      {renderWeekDays()}
    </div>
  );
};

export default WeekView;
