// export const login = async ({ name, email }) => {
//   // Mock API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ id: 1, name, email });
//     }, 1000);
//   });
// };

import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const signUp = async (name, email) => {
  try {
    const requestDTO = {
      name: name, // 이름
      email: email // 이메일
    };

    const response = await axios.post(`${SERVER_URL}/users/signup`, requestDTO);
    return response.data;

  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};
