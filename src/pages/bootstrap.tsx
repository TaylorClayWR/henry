/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import { css } from "@emotion/react";
import {
  providers,
  schedules,
  reservations,
  clients,
} from "@/utils/generators";

const containerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
`;

const Bootstrap = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // grab all the data from generators and put it into localStorage
    localStorage.setItem("providers", JSON.stringify(providers));
    localStorage.setItem("schedules", JSON.stringify(schedules));
    localStorage.setItem("reservations", JSON.stringify(reservations));
    localStorage.setItem("clients", JSON.stringify(clients));
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <Container css={containerStyle}>
      <Typography variant="h4" gutterBottom align="center">
        Bootstrap Complete
      </Typography>
    </Container>
  );
};

export default Bootstrap;
