/** @jsxImportSource @emotion/react */
import React from "react";
import { useRouter } from "next/router";
import { css } from "@emotion/react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Avatar,
  Button,
} from "@mui/material";
import { useGetProviders } from "@/hooks/useProviders";

const providerCardStyle = css`
  width: 100%;
  margin-bottom: 16px;
`;

const ProviderList = () => {
  const { providers } = useGetProviders();

  const router = useRouter();

  if (!providers) {
    return (
      <Typography variant="h6" align="center">
        No providers available
      </Typography>
    );
  }

  const onScheduleClick = (providerId: string, isAccepting: boolean) => {
    if (isAccepting) {
      router.push(`/client/schedule/${providerId}`);
    }
  };

  return (
    <List>
      {providers.map((provider) => (
        <ListItem key={provider.id}>
          <Card css={providerCardStyle}>
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ marginRight: "16px" }} />
              <Typography variant="h6">{provider.name}</Typography>
            </CardContent>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                color={provider.isAcceptingPatients ? "textSecondary" : "error"}
              >
                {provider.isAcceptingPatients
                  ? "Accepting Patients"
                  : "Not Accepting Patients"}
              </Typography>
              <Button
                color="primary"
                disabled={!provider.isAcceptingPatients}
                onClick={() =>
                  onScheduleClick(provider.id, provider.isAcceptingPatients)
                }
              >
                Schedule
              </Button>
            </CardContent>
          </Card>
        </ListItem>
      ))}
    </List>
  );
};

export default ProviderList;
