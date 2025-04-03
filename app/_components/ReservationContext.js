"use client";

import { createContext, use, useState } from "react";

const ReservationContext = createContext();

const initialState = { from: undefined, to: undefined };
function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);
  
  function resetRange() {
    setRange(initialState);
  }
  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = use(ReservationContext);
  if (context === undefined)
    throw new Error("Context was used outside the provider");
  return context;
}

export { ReservationProvider, useReservation };
