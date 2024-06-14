/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { useRouter } from "next/router";
import { isFuture, isToday } from "date-fns";
import { css } from "@emotion/react";
import { Button, Container, Typography, Box } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { useClientAuth } from "@/hooks/useAuth";
import { useGetSchedule, useGetSchedules } from "@/hooks/useSchedules";
import { useGetReservations } from "@/hooks/useReservations";
import { useGetClients } from "@/hooks/useClients";
import type { Schedule, ScheduleDay } from "@/types/provider";
import type { Reservation } from "@/types/reservation";
import type { Client } from "@/types/client";

const buttonStyle = css`
  padding: 0.4rem;
  width: 80px;
`;

const listStyle = css`
  margin-top: 20px;
`;

const timelineStyle = css`
  margin-top: 20px;
  padding: 0;
`;

const ClientTimeline = () => {
  const [currDate, setCurrDate] = useState<Date>(
    (() => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 1);
      return date;
    })()
  );

  const { id: clientId } = useClientAuth();

  const router = useRouter();
  const { id: providerId } = router.query;

  const { schedule } = useGetSchedule(providerId as string);
  const { reservations, setReservations } = useGetReservations();
  const { schedules, setSchedules } = useGetSchedules();
  const { clients, setClients } = useGetClients();

  const handleGoToPreviousDay = () => {
    setCurrDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  const handleGoToNextDay = () => {
    setCurrDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  };

  const currDaySchedule = schedule
    ? schedule.days.find(
        (slot: ScheduleDay) =>
          new Date(slot.date).toLocaleDateString() ===
          currDate.toLocaleDateString()
      )
    : null;

  /*
   * Generate time slots for the current day
   * Start from the start time and increment by 15 minutes until the end time is reached
   */
  const generateTimeSlots = ({ start, end }: ScheduleDay) => {
    const slots = [];
    let current = new Date(`${currDate.toDateString()} ${start}`);
    const endTime = new Date(`${currDate.toDateString()} ${end}`);

    while (current < endTime) {
      slots.push(
        current.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      current.setMinutes(current.getMinutes() + 15);
    }

    return slots;
  };

  const slots = currDaySchedule ? generateTimeSlots(currDaySchedule) : [];

  /*
   * Get the reservation details for a slot
   * Check if the slot is reserved
   * Check if the slot is confirmed
   * Check if the slot is reserved by the client
   */
  const getReservationDetails = (time: string) => {
    const formattedTime = new Date(
      `${currDate.toDateString()} ${time}`
    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    let isReserved = false;
    let isConfirmed = false;
    let isMyReservation = false;
    let reservationId = "";

    if (reservations && schedule) {
      const now = Date.now();

      const filteredReservations = reservations.filter(
        (reservation) =>
          reservation.providerId === schedule.providerId &&
          reservation.date === currDate.toLocaleDateString() &&
          (reservation.isConfirmed ||
            (reservation.expiresAt &&
              new Date(reservation.expiresAt).getTime() > now))
      );

      for (const reservation of filteredReservations) {
        const reservationTime = new Date(
          `${currDate.toDateString()} ${reservation.time}`
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        if (reservationTime === formattedTime) {
          isReserved = true;
          reservationId = reservation.id;
          if (reservation.isConfirmed) {
            isConfirmed = true;
          }
          if (reservation.clientId === clientId) {
            isMyReservation = true;
          }
          break; // Since we found the reservation, we can break early
        }
      }
    }

    return { isReserved, isConfirmed, isMyReservation, reservationId };
  };

  /*
   * Handle the reservation of a slot
   * Insert the reservation into the reservations state
   * Insert the reservationId into the provider's schedule
   * Insert the reservationId into the client's reservations
   * Redirect the client to the confirmation page
   */
  const handleReservation = (currDate: Date, slot: string) => {
    if (!schedule) return;

    // Create a new reservation
    const newReservation: Reservation = {
      date: currDate.toLocaleDateString(),
      time: slot,
      isConfirmed: false,
      clientId: clientId,
      providerId: schedule.providerId,
      scheduleId: schedule.id,
      id: Math.random().toString(36).substr(2, 9),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };

    // Insert the new reservation into reservations state
    const newReservations = [...reservations, newReservation];

    // Insert the reservationId into the provider's schedule
    const newSchedules = schedules.map((s: Schedule) => {
      if (s.id === schedule.id) {
        const newDays = s.days.map((day: ScheduleDay) => {
          if (day.date === currDate.toLocaleDateString()) {
            return {
              ...day,
              reservationIds: [...day.reservationIds, newReservation.id],
            };
          }
          return day;
        });
        return { ...s, days: newDays };
      }
      return s;
    });

    // Insert the reservationId into the client's reservations
    const newClients = clients.map((c: Client) => {
      if (c.id === clientId) {
        return {
          ...c,
          reservationIds: [...c.reservationIds, newReservation.id],
        };
      }
      return c;
    });

    setReservations(newReservations);
    setSchedules(newSchedules);
    setClients(newClients);

    router.push(`/client/reservation/${newReservation.id}/confirm`);
  };

  return (
    <Container css={listStyle}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button color="primary" onClick={handleGoToPreviousDay}>
          {"<"}
        </Button>
        <Typography
          variant="h2"
          sx={{
            color: "primary.main",
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {isToday(currDate) ? "Today" : currDate.toLocaleDateString()}
        </Typography>
        <Button color="primary" onClick={handleGoToNextDay}>
          {">"}
        </Button>
      </Box>
      {slots.length > 0 && (
        <Timeline css={timelineStyle}>
          {slots.map((slot, index) => {
            const { isReserved, isConfirmed, isMyReservation, reservationId } =
              getReservationDetails(slot);

            return (
              <TimelineItem key={index}>
                <TimelineOppositeContent>
                  <Typography variant="body2" color="textSecondary">
                    {slot}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    color={
                      !isReserved
                        ? "primary"
                        : !isMyReservation
                        ? "secondary"
                        : isConfirmed
                        ? "success"
                        : "error"
                    }
                  />
                  {index < slots.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  {(() => {
                    // If the slot is reserved by the client, show Scheduled
                    if (isMyReservation) {
                      if (isConfirmed) {
                        return (
                          <Typography variant="body1" color="green">
                            Scheduled
                          </Typography>
                        );
                      } else {
                        return (
                          <Button
                            css={buttonStyle}
                            href={`/client/reservation/${reservationId}/confirm`}
                            variant="contained"
                            color="error"
                            size="small"
                          >
                            Pending
                          </Button>
                        );
                      }
                    }
                    // If the slot is reserved by another client, show Unavailable
                    if (isReserved) {
                      return (
                        <Typography variant="body1" color="textSecondary">
                          Unavailable
                        </Typography>
                      );
                    }
                  })()}
                  {!isReserved && isFuture(currDate) && (
                    <Button
                      css={buttonStyle}
                      onClick={() => handleReservation(currDate, slot)}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Reserve
                    </Button>
                  )}
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      )}
      {!slots.length && (
        <Typography
          variant="body1"
          color="textSecondary"
          align="center"
          mt="1.5rem"
        >
          No schedule available
        </Typography>
      )}
    </Container>
  );
};

export default ClientTimeline;
