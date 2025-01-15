import axiosInstance from './axios.config';
import { ENDPOINTS } from './endpoints';

export const userApi = {
  signup: async (name, email) => {
    return axiosInstance.post(ENDPOINTS.USER.SIGNUP, { name, email });
  },

  login: async (name, email) => {
    return axiosInstance.post(ENDPOINTS.USER.LOGIN, { name, email });
  },

  search: async (keyword) => {
    return axiosInstance.get(ENDPOINTS.USER.SEARCH, { 
      params: { keyword } 
    });
  }
};