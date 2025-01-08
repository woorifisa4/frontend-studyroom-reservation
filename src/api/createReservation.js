import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const createReservation = async (room, date, start, end, description, reserverId, participants) => {
  try {
    // 서버가 요구하는 형식으로 요청 데이터 변환
    const requestDTO = {
      room: room, // 예약 테이블
      date: date, // 예약 날짜
      start: start, // 예약 시작 시간
      end: end, // 예약 종료 시간
      description: description, // 예약 설명
      reserver: reserverId, // 예약자 ID
      participants: participants // 참여자 목록
    };

    const response = await axios.post(`${SERVER_URL}/reservations`, requestDTO); // JSON.stringify 생략
    return response.data.data;

  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};
