import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Container } from "@mui/material";
import ProviderTimeline from "@/components/provider/ProviderTimeline";
import ProviderDayCreator from "@/components/provider/ProviderDayCreator";

const ProviderSchedule = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <ProviderDayCreator />
        <ProviderTimeline />
      </Container>
    </LocalizationProvider>
  );
};

export default ProviderSchedule;
