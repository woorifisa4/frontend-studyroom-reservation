import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const fetchReservations = async (date) => {
  try {
    const url = `${SERVER_URL}/reservations/${date}`;

    const response = await axios.get(url);
    return response.data;

  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
};
