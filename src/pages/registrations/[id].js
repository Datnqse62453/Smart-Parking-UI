import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Button, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useAuthContext } from "src/contexts/auth-context";
import { useRouter } from "next/router";

const apiUrl = "http://localhost:3000";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6OCwidXNlcm5hbWUiOiIwOTA1NTQ3ODkwIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0wOVQyMjoyNjowMy45OThaIn0sImlhdCI6MTcwMjE2MDc2NH0.QebBFmf9EILaR4NTROeffE8ZVNrmOTTn61j3BO92rw4";
const RegistrationDetailPage = ({ registration }) => {
  if (!registration) {
    return (
      <>
        <Head>
          <title>Registration Not Found | Smart-Parking</title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="xl">
            <Typography variant="h4">Registration Not Found</Typography>
          </Container>
        </Box>
      </>
    );
  }

  const handleDisable = async (registrationId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/registrations/disable/${registrationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error disabling registration:", error.response?.data || error.message);
    }
  };

  const handleActivate = async (registrationId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/registrations/active/${registrationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        // Do something on success
      } else {
        // Handle errors
      }
    } catch (error) {
      console.error("Error activating registration:", error);
    }
  };

  const handleVerify = async (registrationId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/registrations/verify/${registrationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        // Do something on success
      } else {
        // Handle errors
      }
    } catch (error) {
      console.error("Error verifying registration:", error);
    }
  };

  const handleReject = async (registrationId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/registrations/reject/${registrationId}`,
        {}
      );
      if (response.data.success) {
        // Do something on success
      } else {
        // Handle errors
      }
    } catch (error) {
      console.error("Error rejecting registration:", error);
    }
  };

  return (
    <>
      <Head>
        <div>
          <button onClick={() => router.back()}>Back</button>
        </div>
        <title>{`Registration #${registration.registrationId} | Smart-Parking`}</title>
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
              <Typography variant="h4">{`Registration #${registration.registrationId}`}</Typography>
            </Stack>

            <Grid container spacing={3}>
              {/* Face Image on the left */}
              <Grid item xs={12} md={6} lg={4}>
                {registration.faceImage && (
                  <img
                    src={`data:image/png;base64, ${registration.faceImage}`}
                    alt={`Face of ${registration.username}`}
                    style={{ width: "100%", height: "auto" }}
                  />
                )}
              </Grid>

              {/* Registration Details on the right */}
              <Grid item xs={12} md={6} lg={8}>
                <Box
                  sx={{
                    backgroundColor: "#f0f0f0", // Set your preferred background color
                    borderRadius: 4,
                    padding: 3,
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="body1">{`Registration Status: ${registration.registrationStatus}`}</Typography>
                    <Typography variant="body1">{`Approved By: ${registration.approvedBy}`}</Typography>
                    <Typography variant="body1">{`Expired Date: ${moment(
                      registration.expiredDate
                    ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                    <Typography variant="body1">{`Plate Number: ${registration.plateNumber}`}</Typography>
                    <Typography variant="body1">{`Model: ${registration.model}`}</Typography>
                    <Typography variant="body1">{`Registration Number: ${registration.registrationNumber}`}</Typography>
                    <Typography variant="body1">{`Manufacture: ${registration.manufacture}`}</Typography>
                    <Typography variant="body1">{`Gender: ${registration.gender}`}</Typography>
                    <Typography variant="body1">{`User ID: ${registration.userId}`}</Typography>
                    <Typography variant="body1">{`Created At: ${moment(
                      registration.createdAt
                    ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                    <Typography variant="body1">{`Updated At: ${moment(
                      registration.updatedAt
                    ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                    {/* Add other details here */}
                    {/* Additional buttons based on registration status */}
                    <Stack spacing={1}>
                      <Button onClick={() => handleActivate(registration.registrationId)}>
                        Activate
                      </Button>

                      <Button onClick={() => handleReject(registration.registrationId)}>
                        Reject
                      </Button>

                      <Button onClick={() => handleDisable(registration.registrationId)}>
                        Disable
                      </Button>

                      <Button onClick={() => handleVerify(registration.registrationId)}>
                        Verify
                      </Button>

                      {/* Display message for Rejected and Disabled states */}
                      {(registration.registrationStatus === "Rejected" ||
                        registration.registrationStatus === "Disabled") && (
                        <Typography variant="body1">
                          {`Registration ${registration.registrationStatus}`}
                        </Typography>
                      )}
                    </Stack>
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

RegistrationDetailPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default RegistrationDetailPage;

export const getServerSideProps = async ({ params }) => {
  const { id } = params;

  try {
    const response = await axios.get(`${apiUrl}/api/admin/registrations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success && response.data.data && response.data.data.registration) {
      const registration = response.data.data.registration;
      return {
        props: { registration },
      };
    } else {
      return {
        props: {},
      };
    }
  } catch (error) {
    console.error("Error fetching registration data:", error);
    return {
      props: {},
    };
  }
};
