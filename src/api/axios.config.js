import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;