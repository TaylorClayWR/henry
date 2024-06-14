import { useGlobalState } from "@/contexts/GlobalStateContext";

/*
 * This hook is used to get the reservations from the global state.
 */
export const useGetReservations = () => {
  const { state, setReservations } = useGlobalState();
  return { reservations: state.reservations, setReservations };
};
