import { useGlobalState } from "@/contexts/GlobalStateContext";

/*
 * This hook is used to get the clients from the global state.
 */
export const useGetClients = () => {
  const { state, setClients } = useGlobalState();
  return { clients: state.clients, setClients };
};
