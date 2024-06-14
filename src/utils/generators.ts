import type { Schedule, Provider } from "@/types/provider";
import type { Reservation } from "@/types/reservation";
import type { Client } from "@/types/client";

// Generate reservations for a given day and provider
export function generateReservations(
  day: Date,
  startHour: number,
  workLength: number,
  providerId: string
): Reservation[] {
  const reservations: Reservation[] = [];
  const hourAdd = [
    Math.floor(workLength * (1 / 4)),
    Math.floor(workLength * (1 / 2)),
    Math.floor(workLength * (3 / 4)),
  ];

  for (let i = 0; i < 3; i++) {
    const time = `${startHour + hourAdd[i]}:${i * 15 < 10 ? "0" : ""}${i * 15}`;

    reservations.push({
      id: Math.random().toString(36).substr(2, 9),
      providerId,
      clientId: `${i + 1}`,
      scheduleId: "", // Will be assigned later
      date: day.toLocaleDateString(),
      time,
      isConfirmed: providerId === "1",
      expiresAt: new Date(Date.now() + 60 * 1000).toISOString(),
    });
  }
  return reservations;
}

// Generate a schedule for a provider
export const generateSchedule = (id: string): Schedule => {
  const offset = +id;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + offset + 1);

  const future = new Date(today);
  future.setDate(future.getDate() + offset + 2);

  const scheduleId = `${id}${id}`;

  return {
    id: scheduleId,
    providerId: id,
    days: [
      {
        date: today.toLocaleDateString(),
        start: "08:00",
        end: "17:00",
        reservationIds: [], // Will be assigned later
      },
      {
        date: tomorrow.toLocaleDateString(),
        start: "12:00",
        end: "17:00",
        reservationIds: [], // Will be assigned later
      },
      {
        date: future.toLocaleDateString(),
        start: "08:00",
        end: "14:00",
        reservationIds: [], // Will be assigned later
      },
    ],
  };
};

// Generate providers without schedules
type ProviderWithoutSchedule = Omit<Provider, "scheduleId">;
const generateProviders = (): ProviderWithoutSchedule[] => [
  {
    id: "1",
    name: "Dr. Michael Scott",
    isAcceptingPatients: true,
  },
  {
    id: "2",
    name: "Dr. Dwight Schrute",
    isAcceptingPatients: true,
  },
  {
    id: "3",
    name: "Dr. Jim Halpert",
    isAcceptingPatients: false,
  },
];
let providersWithoutSchedule = generateProviders();

// Generate schedules based on provider IDs
const providerIds: string[] = providersWithoutSchedule.map(
  (provider: ProviderWithoutSchedule) => provider.id
);

const generateSchedules = (ids: string[]): Schedule[] =>
  ids.map((id) => generateSchedule(id));

const schedules: Schedule[] = generateSchedules(providerIds);

// Assign reservations to schedules and link them correctly
const reservations: Reservation[] = schedules.flatMap((schedule) => {
  return schedule.days.flatMap((day) => {
    const startHour = parseInt(day.start.slice(0, 2), 10);
    const endHour = parseInt(day.end.slice(0, 2), 10);
    const hoursDifference = endHour - startHour;

    const dayReservations = generateReservations(
      new Date(day.date),
      startHour,
      hoursDifference,
      schedule.providerId
    );

    day.reservationIds = dayReservations.map((res) => res.id);
    dayReservations.forEach((res) => (res.scheduleId = schedule.id));

    return dayReservations;
  });
});

// Update providers with schedule IDs
const providers: Provider[] = providersWithoutSchedule.map(
  (provider: ProviderWithoutSchedule) => {
    const schedule = schedules.find(
      (schedule) => schedule.providerId === provider.id
    );
    return {
      ...provider,
      scheduleId: schedule?.id || "",
    } as Provider;
  }
);

// Generate clients
const generateClients = (): Client[] => [
  {
    id: "1",
    name: "Client 1",
    reservationIds: reservations
      .filter((reservation) => reservation.clientId === "1")
      .map((reservation) => reservation.id),
  },
  {
    id: "2",
    name: "Client 2",
    reservationIds: reservations
      .filter((reservation) => reservation.clientId === "2")
      .map((reservation) => reservation.id),
  },
  {
    id: "3",
    name: "Client 3",
    reservationIds: reservations
      .filter((reservation) => reservation.clientId === "3")
      .map((reservation) => reservation.id),
  },
];

const clients: Client[] = generateClients();

export { providers, schedules, reservations, clients };
