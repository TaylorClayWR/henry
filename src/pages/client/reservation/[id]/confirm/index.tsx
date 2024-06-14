/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { css } from "@emotion/react";
import { Button, Container, Typography } from "@mui/material";
import { useGetReservations } from "@/hooks/useReservations";
import { useGetSchedules } from "@/hooks/useSchedules";
import { useFindProvider } from "@/hooks/useProviders";
import type { Reservation } from "@/types/reservation";
import type { Schedule } from "@/types/provider";

const containerStyle = css`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const titleStyle = css`
  margin: 1.5rem 0;
`;

const Index = () => {
  const [filteredReservations, setFilteredReservations] = useState<
    Reservation[]
  >([]);
  const [isNavigating, setNavigating] = useState(false);

  const router = useRouter();
  const { id: reservationId } = router.query;

  const { reservations, setReservations } = useGetReservations();
  const { schedules, setSchedules } = useGetSchedules();
  const { provider } = useFindProvider(reservationId as string);

  useEffect(() => {
    if (!reservationId) return;

    setFilteredReservations(
      reservations.filter((r) => {
        // Remove the reservation if we are past the expiresAt time
        if (!r.isConfirmed && r.expiresAt) {
          return new Date(r.expiresAt).getTime() > Date.now();
        }

        return true;
      })
    );
  }, [reservationId, reservations]);

  if (isNavigating) {
    return (
      <Container css={containerStyle}>
        <Typography variant="h4" align="center" css={titleStyle}>
          Updating reservation...
        </Typography>
      </Container>
    );
  }

  const reservation = filteredReservations.find((r) => r.id === reservationId);

  if (!reservation) {
    return (
      <Container css={containerStyle}>
        <Typography variant="h4" align="center" css={titleStyle}>
          Reservation not found
        </Typography>
      </Container>
    );
  }

  if (reservation.isConfirmed) {
    return (
      <Container css={containerStyle}>
        <Typography variant="h4" align="center" css={titleStyle}>
          This reservation has been confirmed with{" "}
          {provider?.name ?? "your provider"} on {reservation.date} at{" "}
          {reservation.time}
        </Typography>
      </Container>
    );
  }

  return (
    <Container css={containerStyle}>
      <Typography variant="h4" align="center" css={titleStyle}>
        Confirm your reservation
      </Typography>
      <Typography variant="h6" align="center" css={titleStyle}>
        Are you sure you want to see {provider?.name ?? "your provider"} on{" "}
        {reservation.date} at {reservation.time}?
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ width: "100px" }}
        onClick={() => {
          if (!reservationId) return;

          // Update the reservation in reservations
          const newReservations = filteredReservations.map((r) =>
            r.id === reservationId ? { ...r, isConfirmed: true } : r
          );

          // Update the reservation in the provider's schedule
          const newSchedules: Schedule[] = schedules.map(
            (schedule: Schedule) => {
              if (schedule.id === reservation.scheduleId) {
                return {
                  ...schedule,
                  days: schedule.days.map((day) => ({
                    ...day,
                    reservationIds: [
                      ...day.reservationIds,
                      reservationId as string,
                    ],
                  })),
                };
              }
              return schedule;
            }
          );

          setNavigating(true);
          setReservations(newReservations);
          setSchedules(newSchedules);

          router.push("/client");
        }}
      >
        Confirm
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{ width: "100px", marginTop: "1rem" }}
        onClick={() => {
          // Remove the reservation from reservations
          const newReservations = reservations.filter(
            (r) => r.id !== reservationId
          );

          // Remove the reservation from the provider's schedule
          const newSchedules: Schedule[] = schedules.map(
            (schedule: Schedule) => {
              if (schedule.id === reservation.scheduleId) {
                return {
                  ...schedule,
                  days: schedule.days.map((day) => ({
                    ...day,
                    reservationIds: day.reservationIds.filter(
                      (id) => id !== reservationId
                    ),
                  })),
                };
              }
              return schedule;
            }
          );

          setNavigating(true);
          setReservations(newReservations);
          setSchedules(newSchedules);

          router.push("/client");
        }}
      >
        Cancel
      </Button>
    </Container>
  );
};

export default Index;
