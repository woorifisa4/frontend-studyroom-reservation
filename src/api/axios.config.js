import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
// S3 -> Load Balancer간 원활한 통신이 이루어지는지 확인하기 위해 임시로 추가
// 콘솔 로그
axiosInstance.interceptors.request.use((config) => {
  console.log("API Request:", config);
  return config;
});

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
