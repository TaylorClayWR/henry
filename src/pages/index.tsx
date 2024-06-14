/** @jsxImportSource @emotion/react */
import React from "react";
import Link from "next/link";
import { css } from "@emotion/react";
import { Button, Container, Typography } from "@mui/material";

const containerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
`;

const buttonStyle = css`
  margin-top: 20px;
  width: 250px;
`;

const Index = () => (
  <Container css={containerStyle}>
    <Typography variant="h4" gutterBottom align="center">
      Welcome to the Henry Scheduling App
    </Typography>
    <Link href="/provider" passHref>
      <Button variant="contained" color="primary" css={buttonStyle}>
        Provider Login
      </Button>
    </Link>
    <Link href="/client" passHref>
      <Button variant="contained" color="secondary" css={buttonStyle}>
        Client Login
      </Button>
    </Link>
  </Container>
);

export default Index;
