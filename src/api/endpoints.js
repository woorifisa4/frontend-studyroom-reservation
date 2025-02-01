export const ENDPOINTS = {
  USER: {
    SIGNUP: "/users/signup",
    LOGIN: "/users/login",
    SEARCH: "/users/search",
    REFRESH_TOKEN: "/users/token/refresh",
  },
  RESERVATION: {
    CREATE: "/reservations",
    GET: (date) => `/reservations/${date}`,
    DELETE: (id) => `/reservations/${id}`,
  },
};