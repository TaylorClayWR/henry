/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { isToday } from "date-fns";
import { css } from "@emotion/react";
import { Box, Button, Container, Typography } from "@mui/material";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { useGetReservations } from "@/hooks/useReservations";
import { useGetSchedule } from "@/hooks/useSchedules";
import { useGetClients } from "@/hooks/useClients";
import { useProviderAuth } from "@/hooks/useAuth";
import type { ScheduleDay } from "@/types/provider";

const listStyle = css`
  margin-top: 20px;
`;

const timelineStyle = css`
  margin-top: 20px;
`;

const ProviderTimeline = () => {
  const [currDate, setCurrDate] = useState<Date>(
    (() => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      return date;
    })()
  );

  const { id } = useProviderAuth();
  const { schedule } = useGetSchedule(id);
  const { reservations } = useGetReservations();
  const { clients } = useGetClients();

  const handlePreviousDay = () => {
    setCurrDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  };

  const currDaySchedule = schedule
    ? schedule.days.find(
        (day: ScheduleDay) =>
          new Date(day.date).toLocaleDateString() ===
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
   */
  const getReservationDetails = (time: string) => {
    const formattedTime = new Date(
      `${currDate.toDateString()} ${time}`
    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    let isReserved = false;
    let isConfirmed = false;

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
          if (reservation.isConfirmed) {
            isConfirmed = true;
          }
          break; // Since we found the reservation, we can break early
        }
      }
    }

    return { isReserved, isConfirmed };
  };

  return (
    <Container css={listStyle}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button color="primary" onClick={handlePreviousDay}>
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
        <Button color="primary" onClick={handleNextDay}>
          {">"}
        </Button>
      </Box>
      {slots.length > 0 && (
        <Timeline css={timelineStyle}>
          {slots.map((slot, index) => {
            const { isReserved, isConfirmed } = getReservationDetails(slot);
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
                      isReserved
                        ? isConfirmed
                          ? "secondary"
                          : "error"
                        : "primary"
                    }
                  />
                  {index < slots.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  {isReserved && (
                    <>
                      <Typography
                        variant="body1"
                        color={isConfirmed ? "secondary" : "error"}
                      >
                        {isConfirmed ? "Confirmed" : "Pending"}
                      </Typography>
                      <Typography
                        variant="body1"
                        color={isConfirmed ? "secondary" : "error"}
                      >
                        {(() => {
                          const reservation = reservations.find(
                            (reservation) =>
                              new Date(
                                `${reservation.date} ${reservation.time}`
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              }) === slot
                          );

                          if (reservation) {
                            const client = clients.find(
                              (client) => client.id === reservation.clientId
                            );
                            return client?.name || "";
                          }

                          return "";
                        })()}
                      </Typography>
                    </>
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

export default ProviderTimeline;
