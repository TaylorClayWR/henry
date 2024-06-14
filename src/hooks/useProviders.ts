import { useGlobalState } from "@/contexts/GlobalStateContext";
import type { Provider } from "@/types/provider";

/*
 * This hook is used to get the clients from the global state.
 */
export const useGetProviders = () => {
  const { state, setProviders } = useGlobalState();
  return { providers: state.providers, setProviders };
};

/*
 * This hook is used to get a specific provider from the global state by a `providerId`.
 */
export const useGetProvider = (providerId: string | undefined) => {
  const { state, setProviders } = useGlobalState();
  const provider =
    state.providers.find((provider) => provider.id === providerId) || null;

  const setProvider = (provider: Provider) => {
    const newProviders = state.providers.map((p) =>
      p.id === providerId ? provider : p
    );
    setProviders(newProviders);
  };

  return { provider, setProvider };
};

/*
 * This hook is used to find a provider from the global state from a `reservationId`.
 */
export const useFindProvider = (reservationId: string | undefined) => {
  const { state } = useGlobalState();

  if (!state.providers) {
    return { provider: null };
  }

  const reservation = state.reservations.find(
    (reservation) => reservation.id === reservationId
  );
  if (!reservation) {
    return { provider: null };
  }

  return {
    provider: state.providers.find(
      (provider) => provider.id === reservation.providerId
    ),
  };
};
