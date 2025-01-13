import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Schedule from '../components/Schedule';
import ReservationInfo from '../components/ReservationInfo';
import DateNavigation from '../components/DateNavigation';
import FloatingActionButton from '../components/FloatingActionButton';
import { fetchReservations } from '../api/fetchReservations';

const ReservationPage = ({user}) => {
  const [searchParams] = useSearchParams();
  const urlDate = searchParams.get('date');
  
  const [selectedDate, setSelectedDate] = useState(() => {
    if (urlDate) {
      return new Date(urlDate);
    }
    return new Date();
  });

  const [plannedReservation, setPlannedReservation] = useState(null); // 사용자가 현재 예약하고자 하는 일정
  const [reservations, setReservations] = useState([]); // 특정 날짜에 예약된 일정 목록
  const [isFabActivated, setIsFabActivated] = useState(false); // FAB 버튼 활성화 여부
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // 달력 모달 오픈 여부

  // 선택한 날짜에 해당하는 예약 목록을 불러오는 함수
  useEffect(() => {
    const loadReservations = async () => {
      const response = await fetchReservations(selectedDate.toISOString().split('T')[0]);
      setReservations(response.data);
    };

    loadReservations();
  }, [selectedDate]);

  // URL이 변경될 때마다 selectedDate 업데이트
  useEffect(() => {
    if (urlDate) {
      setSelectedDate(new Date(urlDate));
    }
  }, [urlDate]);

  // 각각의 backdrop에 대한 클릭 핸들러를 분리
  const handleReservationBackdropClick = (e) => {
    if (e.target.classList.contains('reservation-backdrop')) {
      setPlannedReservation(null);
    }
  };

  const handleCalendarBackdropClick = (e) => {
    if (e.target.classList.contains('calendar-backdrop')) {
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen relative">
      <div className={`${isCalendarOpen ? 'z-30' : 'z-10'}`}>
        <DateNavigation 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
        />
      </div>
      <div className="my-4"></div>
      <Schedule
        reservations={reservations}
        selectedDate={selectedDate}
        setPlannedReservation={setPlannedReservation}
      />

      {/* Calendar backdrop */}
      {isCalendarOpen && (
        <div className="calendar-backdrop fixed inset-0 bg-black bg-opacity-50 z-20" 
          onClick={handleCalendarBackdropClick}>
        </div>
      )}

      {/* Reservation backdrop */}
      {plannedReservation && (
        <div className="reservation-backdrop fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20" 
          onClick={handleReservationBackdropClick}>
          <div className="z-30 w-full max-w-md">
            <ReservationInfo
              user={user}
              selectedDate={selectedDate}
              plannedReservation={plannedReservation}
              setPlannedReservation={setPlannedReservation}
              setReservations={setReservations}
            />
          </div>
        </div>
      )}
      <div className={`${isFabActivated ? 'z-30' : 'z-10'}`}>
        <FloatingActionButton isFabActivated={isFabActivated} setIsFabActivated={setIsFabActivated} />
      </div>
    </div>
  );
};

export default ReservationPage;