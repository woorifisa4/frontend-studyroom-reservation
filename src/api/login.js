import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const login = async (name, email) => {
  try {
    const requestDTO = {
      name: name, // 이름
      email: email // 이메일
    };

    const response = await axios.post(`${SERVER_URL}/users/login`, requestDTO);
    return response.data;

  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};
