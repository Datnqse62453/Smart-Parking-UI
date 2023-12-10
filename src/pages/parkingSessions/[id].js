import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Button, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useRouter } from "next/router";

const apiUrl = "http://localhost:3000";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MiwidXNlcm5hbWUiOiIwOTA1NTQ3ODkwIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0wOVQyMjowNzoxNS44NzVaIn0sImlhdCI6MTcwMjE1OTYzNX0.J60sJNJPAXtXajholJQ8vg_FWWTJBJgXtuJ3DiTayWg";

const SessionDetailPage = ({ session }) => {
  const router = useRouter();

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
              {[
                session.checkinFaceImage,
                session.checkinPlateNumberImage,
                session.checkoutFaceImage,
                session.checkoutPlateNumberImage,
              ].map((image, index) => (
                <Grid item key={index} xs={12} md={6} lg={4}>
                  {image && (
                    <img
                      src={`data:image/png;base64, ${image}`}
                      alt={`Image ${index + 1}`}
                      style={{ width: "100%", height: "auto" }}
                    />
                  )}
                </Grid>
              ))}

              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                  {/* No images to display */}
                </Grid>

                <Grid item xs={12} md={6} lg={8}>
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
                      {/* <Typography variant="body1">{`Parking Type Description: ${session.ParkingType?.description}`}</Typography> */}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

SessionDetailPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SessionDetailPage;

export const getServerSideProps = async ({ params }) => {
  const { id } = params;

  try {
    const response = await axios.get(`${apiUrl}/api/admin/sessions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success && response.data.data && response.data.data.parkingSession) {
      const session = response.data.data.parkingSession;
      return {
        props: { session },
      };
    } else {
      return {
        props: {},
      };
    }
  } catch (error) {
    console.error("Error fetching session data:", error);
    return {
      props: {},
    };
  }
};
