import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const deleteReservation = async (id) => {
  try {
    await axios.delete(`${SERVER_URL}/reservations/${id}`);
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
};
