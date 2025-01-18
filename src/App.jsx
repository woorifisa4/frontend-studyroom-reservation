import React from "react";
import Router from "./Router";
import { ReservationProvider } from "./context/ReservationContext";

const App = () => {
  return (
    <ReservationProvider>
      <Router />
    </ReservationProvider>
  );
};

export default App;
