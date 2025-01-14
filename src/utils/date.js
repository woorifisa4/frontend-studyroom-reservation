/**
 * 날짜를 한국어 형식으로 포맷팅하는 함수
 * 
 * @param {Date} date - 포맷팅할 날짜
 * @param {Object} options - 포맷팅 옵션 (optional)
 * @returns {string} 포맷팅된 날짜 문자열
 */
export function formatDateToKorean(date, options = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  weekday: 'short'
}) {
  if (!date || !(date instanceof Date) || isNaN(date)) return '';

  return date.toLocaleDateString('ko-KR', options)
    .replace(/\./g, '.')  // 마침표 정규화
    .replace(/ /g, '');   // 공백 제거
}

/**
 * 시:분:초 형식의 문자열을 시:분 형식의 시간 문자열로 변환하는 함수
 * 
 * @param {string} timeString - HH:mm:ss 형식의 시간 문자열
 * @returns {string} 포맷팅된 시간 문자열 (HH:mm)
 */
export function formatTime(timeString) {
  if (!timeString) return '';

  const [hours, minutes] = timeString.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}
