import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import type { Provider, Schedule } from "@/types/provider";
import type { Client } from "@/types/client";
import type { Reservation } from "@/types/reservation";

type GlobalState = {
  providers: Provider[];
  schedules: Schedule[];
  reservations: Reservation[];
  clients: Client[];
};

type GlobalStateContextType = {
  state: GlobalState;
  setProviders: (providers: Provider[]) => void;
  setSchedules: (schedules: Schedule[]) => void;
  setReservations: (reservations: Reservation[]) => void;
  setClients: (clients: Client[]) => void;
};

const initialState: GlobalState = {
  providers: [],
  schedules: [],
  reservations: [],
  clients: [],
};

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GlobalState>(initialState);

  useEffect(() => {
    const storedProviders = localStorage.getItem("providers");
    const storedSchedules = localStorage.getItem("schedules");
    const storedReservations = localStorage.getItem("reservations");
    const storedClients = localStorage.getItem("clients");

    if (storedProviders) {
      setState((prev) => ({ ...prev, providers: JSON.parse(storedProviders) }));
    }
    if (storedSchedules) {
      setState((prev) => ({ ...prev, schedules: JSON.parse(storedSchedules) }));
    }
    if (storedReservations) {
      setState((prev) => ({
        ...prev,
        reservations: JSON.parse(storedReservations),
      }));
    }
    if (storedClients) {
      setState((prev) => ({ ...prev, clients: JSON.parse(storedClients) }));
    }
  }, []);

  const setProviders = (providers: Provider[]) => {
    localStorage.setItem("providers", JSON.stringify(providers));
    setState((prev) => ({ ...prev, providers }));
  };

  const setSchedules = (schedules: Schedule[]) => {
    localStorage.setItem("schedules", JSON.stringify(schedules));
    setState((prev) => ({ ...prev, schedules }));
  };

  const setReservations = (reservations: Reservation[]) => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
    setState((prev) => ({ ...prev, reservations }));
  };

  const setClients = (clients: Client[]) => {
    localStorage.setItem("clients", JSON.stringify(clients));
    setState((prev) => ({ ...prev, clients }));
  };

  return (
    <GlobalStateContext.Provider
      value={{ state, setProviders, setSchedules, setReservations, setClients }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
