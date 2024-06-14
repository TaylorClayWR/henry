/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { Container, Typography } from "@mui/material";
import { useProviderAuth } from "@/hooks/useAuth";
import { useGetProvider } from "@/hooks/useProviders";
import ProviderSchedule from "@/components/provider/ProviderSchedule";

const containerStyle = css`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const titleStyle = css`
  margin: 1.5rem 0 0;
`;

const subTitleStyle = css`
  margin: 0.75rem 0;
`;

const Provider = () => {
  const { id } = useProviderAuth();

  const { provider } = useGetProvider(id);

  return (
    <Container css={containerStyle}>
      {provider && (
        <Typography variant="h6" align="center" css={titleStyle}>
          {provider.name}
        </Typography>
      )}
      <Typography variant="h4" align="center" css={subTitleStyle}>
        Schedule
      </Typography>
      <ProviderSchedule />
    </Container>
  );
};

export default Provider;
