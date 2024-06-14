export type Reservation = {
  id: string;
  providerId: string;
  clientId: string;
  scheduleId: string;
  date: string;
  time: string;
  isConfirmed: boolean;
  expiresAt: string;
};
