import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Schedule from "../components/Schedule";
import ReservationInfo from "../components/ReservationInfo";
import DateNavigation from "../components/DateNavigation";
import FloatingActionButton from "../components/FloatingActionButton";
import { useReservation } from "../context/ReservationContext";

const ReservationPage = ({ user }) => {
  const [searchParams] = useSearchParams();
  const urlDate = searchParams.get("date");
  const {
    reservations,
    plannedReservation,
    setPlannedReservation,
    loadReservations,
  } = useReservation();

  const [selectedDate, setSelectedDate] = useState(() => {
    if (urlDate) {
      return new Date(urlDate);
    }
    return new Date();
  });

  const [isFabActivated, setIsFabActivated] = useState(false); // FAB 버튼 활성화 여부
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // 달력 모달 오픈 여부

  // URL 변경과 예약 조회를 하나의 useEffect로 통합
  useEffect(() => {
    if (urlDate) {
      const newDate = new Date(urlDate);
      setSelectedDate(newDate);
      loadReservations(urlDate);
      
    } else {
      const today = new Date();
      const dateStr = today.toISOString().split("T")[0];
      loadReservations(dateStr);
    }
  }, [urlDate, loadReservations]);

  // 각각의 backdrop에 대한 클릭 핸들러를 분리
  const handleReservationBackdropClick = (e) => {
    if (e.target.classList.contains("reservation-backdrop")) {
      setPlannedReservation(null);
    }
  };

  const handleCalendarBackdropClick = (e) => {
    if (e.target.classList.contains("calendar-backdrop")) {
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen relative">
      <div className={`${isCalendarOpen ? "z-30" : "z-10"}`}>
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
        currentUser={user}
      />

      {/* Calendar backdrop */}
      {isCalendarOpen && (
        <div
          className="calendar-backdrop fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={handleCalendarBackdropClick}
        ></div>
      )}

      {/* Reservation backdrop */}
      {plannedReservation && (
        <div
          className="reservation-backdrop fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20"
          onClick={handleReservationBackdropClick}
        >
          <div className="z-30 w-full max-w-md">
            <ReservationInfo
              user={user}
              selectedDate={selectedDate}
              plannedReservation={plannedReservation}
              setPlannedReservation={setPlannedReservation}
            />
          </div>
        </div>
      )}
      <div className={`${isFabActivated ? "z-30" : "z-10"}`}>
        <FloatingActionButton
          isMenuOpen={isFabActivated}
          setIsMenuOpen={setIsFabActivated}
        />
      </div>
    </div>
  );
};

export default ReservationPage;
