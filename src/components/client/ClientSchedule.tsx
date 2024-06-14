import React from "react";
import { Container } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import ClientTimeline from "@/components/client/ClientTimeline";

const ClientSchedule = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <ClientTimeline />
      </Container>
    </LocalizationProvider>
  );
};

export default ClientSchedule;
