import { useGlobalState } from "@/contexts/GlobalStateContext";
import type { Schedule } from "@/types/provider";

/*
 * This hook is used to get the schedules from the global state.
 */
export const useGetSchedules = () => {
  const { state, setSchedules } = useGlobalState();
  return { schedules: state.schedules, setSchedules };
};

/*
 * This hook is used to get a specific schedule from the global state by a `providerId`.
 */
export const useGetSchedule = (providerId: string) => {
  const { state, setSchedules } = useGlobalState();
  const schedule =
    state.schedules.find((schedule) => schedule.providerId === providerId) ||
    null;

  const setSchedule = (schedule: Schedule) => {
    const newSchedules = state.schedules.map((s) =>
      s.providerId === providerId ? schedule : s
    );
    setSchedules(newSchedules);
  };

  return { schedule, setSchedule };
};
