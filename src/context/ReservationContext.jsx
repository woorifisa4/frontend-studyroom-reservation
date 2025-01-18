import React, { createContext, useContext, useState, useCallback } from "react";
import { reservationApi } from "../api/reservationApi";
import { showToast } from "../ui/Toast";

const ReservationContext = createContext(null);

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }
  return context;
};

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [plannedReservation, setPlannedReservation] = useState(null);

  const loadReservations = useCallback(async (date) => {
    try {
      const response = await reservationApi.getByDate(date);
      setReservations(response.data);

    } catch (error) {
      showToast("예약 정보를 불러오는데 실패했습니다.", "error");
    }
  }, []);

  const createReservation = useCallback(async (reservationData) => {
    try {
      const response = await reservationApi.create(reservationData);
      setReservations((prev) => [...prev, response.data]);
      showToast("예약이 완료되었습니다.", "success");
      return true;

    } catch (error) {
      showToast("예약 생성에 실패했습니다.", "error");
      return false;
    }
  }, []);

  const deleteReservation = useCallback(async (reservationId) => {
    try {
      await reservationApi.delete(reservationId);
      setReservations((prev) => prev.filter((res) => res.id !== reservationId));
      showToast("예약이 삭제되었습니다.", "success");
      
    } catch (error) {
      showToast("예약 삭제에 실패했습니다.", "error");
    }
  }, []);

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        plannedReservation,
        setPlannedReservation,
        loadReservations,
        createReservation,
        deleteReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
