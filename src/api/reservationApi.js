import axiosInstance from "./axios.config";
import { ENDPOINTS } from "./endpoints";

export const reservationApi = {
  create: async (reservationData) => {
    const { table, date, start, end, description, reserverId, participants } =
      reservationData;

    return axiosInstance.post(ENDPOINTS.RESERVATION.CREATE, {
      table,
      date,
      start,
      end,
      description,
      reserver: reserverId,
      participants: participants.map((participant) => participant.id),
    });
  },

  getByDate: async (date) => {
    return axiosInstance.get(ENDPOINTS.RESERVATION.GET(date));
  },

  delete: async (id) => {
    return axiosInstance.delete(ENDPOINTS.RESERVATION.DELETE(id));
  },
};
