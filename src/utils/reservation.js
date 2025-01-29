import { BUSINESS_HOUR, INTERVAL } from "../constants/reservation";

/**
 * 예약 가능한 시간대 목록을 생성하는 함수
 * @returns {string[]} HH:mm:ss 형식의 시간대 목록
 */
export const generateReservationTimeSlots = () => {
  const timeSlots = [];
  const startHour = parseInt(BUSINESS_HOUR.START.split(":")[0]);
  const startMinute = parseInt(BUSINESS_HOUR.START.split(":")[1]);
  const endHour = parseInt(BUSINESS_HOUR.END.split(":")[0]);
  const endMinute = parseInt(BUSINESS_HOUR.END.split(":")[1]);

  for (let hour = startHour; hour <= endHour; hour++) {
    const startMin = hour === startHour ? startMinute : 0;
    const endMin = hour === endHour ? endMinute : 59;

    for (let minute = startMin; minute <= endMin; minute += INTERVAL) {
      timeSlots.push(
        `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}:00`
      );
    }
  }

  return timeSlots;
};

/**
 * 특정 시간이 예약 가능한 시간대인지 확인하는 함수
 * @param {string} time - HH:mm:ss 형식의 시간
 * @returns {boolean} 예약 가능 여부
 */
export const isValidReservationTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const today = new Date();
  const dateString = today.toISOString().split("T")[0];

  const startTime = new Date(`${dateString} ${BUSINESS_HOUR.START}`);
  const endTime = new Date(`${dateString} ${BUSINESS_HOUR.END}`);
  const currentTime = new Date(`${dateString} ${time}`);

  return (
    currentTime >= startTime &&
    currentTime < endTime &&
    minutes % INTERVAL === 0
  );
};
