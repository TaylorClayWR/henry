/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { Container, Typography } from "@mui/material";
import ProviderList from "@/components/provider/ProviderList";

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
  return (
    <Container css={containerStyle}>
      <Typography variant="h4" align="center" css={titleStyle}>
        Choose a Provider
      </Typography>
      <ProviderList />
    </Container>
  );
};

export default Index;
