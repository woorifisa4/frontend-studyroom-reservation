import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const createReservation = async (reservation) => {
  try {
    const response = await axios.post(`${SERVER_URL}/reservations`, reservation);
    return response.data.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};
