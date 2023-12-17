"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Button, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuthContext } from "src/contexts/auth-context";
import Image from "next/image";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const SessionDetailPage = () => {
  const [session, setSessionData] = useState({});
  const router = useRouter();
  const auth = useAuthContext();
  const token = auth.user?.accessToken;
  const sessionId = router.query?.sessionId;
  useEffect(() => {
    const getParkingSession = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/sessions/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const session = response.data.data.parkingSession;
        setSessionData(session);
      } catch (err) {
        console.error("ERR", err);
      }
    };

    getParkingSession();
  }, []);

  if (!session) {
    return (
      <>
        <Head>
          <title>Session Not Found | Smart-Parking</title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="xl">
            <Typography variant="h4">Session Not Found</Typography>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <Head>
        <div>
          <button onClick={() => router.back()}>Back</button>
        </div>
        <title>{`Session #${session.parkingSessionId} | Smart-Parking`}</title>
      </Head>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button onClick={() => router.back()}>Back</Button>
              <Typography variant="h4">{`Session #${session.parkingSessionId}`}</Typography>
            </Stack>

            <Grid container spacing={3}>
              {/* Check-in Images */}
              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="h6">Check-In</Typography>
                {renderImage(session.checkinFaceImage, "Check-In Face Image")}
                {renderImage(session.checkinPlateNumberImage, "Check-In Plate Number Image")}
              </Grid>

              {/* Check-out Images */}
              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="h6">Check-Out</Typography>
                {renderImage(session.checkoutFaceImage, "Check-Out Face Image")}
                {renderImage(session.checkoutPlateNumberImage, "Check-Out Plate Number Image")}
              </Grid>

              {/* Session Details */}
              <Grid item xs={12} md={12} lg={12}>
                <Box
                  sx={{
                    backgroundColor: "#f0f0f0",
                    borderRadius: 4,
                    padding: 3,
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="body1">{`Card ID: ${session.cardId}`}</Typography>
                    <Typography variant="body1">{`Check-in Time: ${moment(
                      session.checkinTime
                    ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                    <Typography variant="body1">{`Check-out Time: ${moment(
                      session.checkoutTime
                    ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                    <Typography variant="body1">{`Approved By: ${session.approvedBy}`}</Typography>
                    <Typography variant="body1">{`Plate Number: ${session.plateNumber}`}</Typography>
                    <Typography variant="body1">{`Parking Fee: ${session.parkingFee}`}</Typography>
                    <Typography variant="body1">{`Created At: ${moment(session.createdAt).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}`}</Typography>
                    <Typography variant="body1">{`Updated At: ${moment(session.updatedAt).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}`}</Typography>

                    {/* Display Parking Type ID or Name */}
                    <Typography variant="body1">
                      {`Parking Type: ${
                        session.ParkingType?.parkingTypeId || session.parkingTypeId
                      }`}
                    </Typography>

                    {/* Additional details from ParkingType if needed */}
                    <Typography variant="body1">{`Parking Type Description: ${
                      session.ParkingType?.description || "N/A"
                    }`}</Typography>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};
const renderImage = (imageData, altText) => {
  if (!imageData) {
    return <Typography variant="body2">{`${altText}: N/A`}</Typography>;
  }

  return (
    <Image src={`data:image/png;base64, ${imageData}`} alt={altText} width={400} height={600} />
  );
};
SessionDetailPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SessionDetailPage;
