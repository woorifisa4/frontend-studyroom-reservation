import axios from "axios";
import { ENDPOINTS } from "./endpoints";

// 토큰 관련 상수
const ACCESS_TOKEN_KEY = "woorifisa-studyroom-reservation-access-token";
const REFRESH_TOKEN_KEY = "woorifisa-studyroom-reservation-refresh-token";

// 인증이 필요없는 엔드포인트 목록
const PUBLIC_ENDPOINTS = [
  ENDPOINTS.USER.LOGIN,
  ENDPOINTS.USER.SIGNUP,
  ENDPOINTS.USER.REFRESH_TOKEN,
];

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 관련 유틸리티 함수들
const tokenUtils = {
  // 액세스 토큰 가져오기
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),

  // 리프레시 토큰 가져오기
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),

  // 새로운 토큰 저장
  saveTokens: (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  // 토큰 삭제
  removeTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// 요청 인터셉터: 토큰이 필요한 요청에 헤더 추가
axiosInstance.interceptors.request.use((config) => {
  // 인증이 필요없는 엔드포인트는 토큰 추가하지 않음
  if (PUBLIC_ENDPOINTS.includes(config.url)) {
    return config;
  }

  const token = tokenUtils.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 토큰 만료시 자동 갱신 처리
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러(토큰 만료)이고 첫 번째 재시도인 경우에만 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 리프레시 토큰으로 새로운 토큰 발급 요청
        const refreshToken = tokenUtils.getRefreshToken();
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}${ENDPOINTS.USER.REFRESH_TOKEN}`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        // 새로운 토큰 저장
        tokenUtils.saveTokens(accessToken, newRefreshToken);

        // 실패했던 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패시 로그아웃 처리
        tokenUtils.removeTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
