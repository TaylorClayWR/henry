/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { Container, Typography } from "@mui/material";
import ClientSchedule from "@/components/client/ClientSchedule";

const containerStyle = css`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const titleStyle = css`
  margin: 1.5rem 0;
`;

const Schedule = () => {
  return (
    <Container css={containerStyle}>
      <Typography variant="h4" align="center" css={titleStyle}>
        Schedule an appointment
      </Typography>
      <ClientSchedule />
    </Container>
  );
};

export default Schedule;
