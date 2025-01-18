import { BUSINESS_HOURS, INTERVAL } from '../constants/reservation';

/**
 * 예약 가능한 시간대 목록을 생성하는 함수
 * @returns {string[]} HH:mm:ss 형식의 시간대 목록
 */
export const generateReservationTimeSlots = () => {
  const { START, END } = BUSINESS_HOURS;
  const timeSlots = [];

  for (let hour = START.HOUR; hour <= END.HOUR; hour++) {
    // 시작 분과 종료 분 계산
    const startMinute = hour === START.HOUR ? START.MINUTE : 0;
    const endMinute = hour === END.HOUR ? END.MINUTE : 59;

    // INTERVAL 간격으로 시간대 생성
    for (let minute = startMinute; minute <= endMinute; minute += INTERVAL) {
      timeSlots.push(
        `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`
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
  const [hours, minutes] = time.split(':').map(Number);
  const { START, END } = BUSINESS_HOURS;

  // 운영 시간 외 체크
  if (hours < START.HOUR || hours > END.HOUR) return false;
  
  // 시작 시간 체크
  if (hours === START.HOUR && minutes < START.MINUTE) return false;
  
  // 종료 시간 체크
  if (hours === END.HOUR && minutes > END.MINUTE) return false;
  
  // 시간 간격 체크
  return minutes % INTERVAL === 0;
};
