export type ScheduleDay = {
  date: string;
  start: string;
  end: string;
  reservationIds: string[];
};

export type Schedule = {
  id: string;
  providerId: string;
  days: ScheduleDay[];
};

export type Provider = {
  id: string;
  name: string;
  isAcceptingPatients: boolean;
  scheduleId: string;
};
