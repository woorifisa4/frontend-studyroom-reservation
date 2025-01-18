import React from "react";
import Router from "./Router";
import { ReservationProvider } from "./context/ReservationContext";
import { UserProvider } from "./context/UserContext";

const App = () => {
  return (
    <UserProvider>
      <ReservationProvider>
        <Router />
      </ReservationProvider>
    </UserProvider>
  );
};

export default App;
