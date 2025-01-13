import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const searchUsers = async (keyword) => {
  try {
    console.log('Searching for:', keyword);  // 검색 키워드 로깅
    const response = await axios.get(`${SERVER_URL}/users/search?keyword=${keyword}`);
    console.log('Search results:', response.data);  // 응답 데이터 로깅
    return response.data;
  } catch (error) {
    console.error('User search error:', error);  // 에러 로깅
    throw error;
  }
};
