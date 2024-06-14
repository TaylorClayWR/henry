/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { css } from "@emotion/react";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { Button, Grid } from "@mui/material";
import { useGetSchedule } from "@/hooks/useSchedules";
import { useProviderAuth } from "@/hooks/useAuth";
import type { ScheduleDay } from "@/types/provider";

const buttonStyle = css`
  width: 100%;
`;

const ProviderDayCreator = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  const { id } = useProviderAuth();
  const { schedule, setSchedule } = useGetSchedule(id);

  /*
   * Handle creating a new day
   * Insert the new day into the provider's schedule
   */
  const handleSubmit = () => {
    if (!schedule || !date || !start || !end) return;

    const newDay: ScheduleDay = {
      date: date.toLocaleDateString(),
      start: start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      end: end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      reservationIds: [],
    };

    const updatedSchedule = {
      ...schedule,
      days: [...schedule.days, newDay],
    };

    setSchedule(updatedSchedule);
    setDate(null);
    setStart(null);
    setEnd(null);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <DatePicker
          label="Date"
          value={date}
          onChange={(newValue) => {
            if (!newValue) return;

            setDate(newValue as Date);
          }}
          minDate={(() => {
            const date = new Date();
            // Set the minimum date to tomorrow
            date.setDate(date.getDate() + 1);
            return date;
          })()}
        />
      </Grid>
      <Grid item xs={6} sm={4} md={3} lg={2}>
        <TimePicker
          label="Start"
          value={start}
          onChange={(newValue) => {
            if (!newValue) return;

            setStart(newValue as Date);
          }}
        />
      </Grid>
      <Grid item xs={6} sm={4} md={3} lg={2}>
        <TimePicker
          label="End"
          value={end}
          onChange={(newValue) => {
            if (!newValue) return;

            setEnd(newValue as Date);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!date || !start || !end}
          css={buttonStyle}
        >
          Add Schedule
        </Button>
      </Grid>
    </Grid>
  );
};

export default ProviderDayCreator;
