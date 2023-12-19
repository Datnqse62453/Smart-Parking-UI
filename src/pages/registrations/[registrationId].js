"use client";
import {
  Badge,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Unstable_Grid2 as Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "src/contexts/auth-context";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const renderButtonsBasedOnStatus = (status) => {
  switch (status) {
    case "created":
      return (
        <>
          <Button onClick={() => handleReject(registration.registrationId)}>Reject</Button>
          <Button onClick={() => handleVerify(registration.registrationId)}>Verify</Button>
        </>
      );
    case "verified":
      return <Button onClick={() => handleReject(registration.registrationId)}>Reject</Button>;
    case "paid":
      return (
        <>
          <Button onClick={() => handleReject(registration.registrationId)}>Reject</Button>
          <Button onClick={() => handleActivate(registration.registrationId)}>Activate</Button>
        </>
      );
    case "active":
      return (
        <Button onClick={() => handleDeactive(registration.registrationId)}>Deactivate</Button>
      );
    case "temp-inactive":
      return (
        <>
          <Button onClick={() => handleReactive(registration.registrationId)}>Reactivate</Button>
        </>
      );
    default:
      return null;
  }
};
const getStatusBadge = (status) => {
  let color = "default";

  switch (status) {
    case "created":
      color = "primary";
      break;
    case "canceled":
      color = "error";
      break;
    case "verified":
      color = "info";
      break;
    case "paid":
      color = "success";
      break;
    case "active":
      color = "success";
      break;
    case "temp-inactive":
      color = "warning";
      break;
    default:
      break;
  }
  return <Badge color={color} badgeContent={status.toUpperCase()} />;
};
const RegistrationDetailPage = () => {
  const auth = useAuthContext();
  const token = auth.user?.accessToken;
  const router = useRouter();
  const registrationId = router.query.registrationId;
  const [registration, setRegistrationData] = useState({});
  const [registrationHistories, setRegistrationHistories] = useState([]);
  const [showPayments, setShowPayments] = useState(false);
  const [payments, setPayments] = useState([]);
  const [cards, setCards] = useState([]);
  const [isActivateFormOpen, setIsActivateFormOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [registrationResponse, historyResponse, paymentResponse, cardResponse] =
          await Promise.all([
            axios.get(`${apiUrl}/api/admin/registrations/${registrationId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${apiUrl}/api/admin/registrations/history/${registrationId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${apiUrl}/api/admin/registrations/payment/${registrationId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${apiUrl}/api/admin/active-cards`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        if (registrationResponse.data.success) {
          const registration = registrationResponse.data.data.registration;
          const registrationHistories =
            historyResponse.data.success && historyResponse.data.data
              ? historyResponse.data.data.registrationHistories
              : [];
          const payments =
            paymentResponse.data.success && paymentResponse.data.data
              ? paymentResponse.data.data
              : [];
          const cards =
            cardResponse.data.success && cardResponse.data.data ? cardResponse.data.data : [];
          setRegistrationData(registration);
          setRegistrationHistories(registrationHistories);
          setPayments(payments);
          setCards(cards);
        } else {
          console.error("Failed to fetch registration data");
        }
      } catch (error) {
        console.error("Error fetching registration data:", error);
      }
    };

    fetchData();
  }, [token]);
  const handleActivate = () => {
    // Set the selected card to the first card by default
    const defaultCardId =
      cards.data && cards.data.activeCards.length > 0 ? cards.data.activeCards[0].cardId : "";
    setSelectedCardId(defaultCardId);

    // Open the activation form
    setIsActivateFormOpen(true);
  };
  const handleDeactive = async (registrationId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/registrations/deactivate/${registrationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Registration temporarily deactive !");
        router.replace(router.asPath);
      } else {
        console.error("Failed to disable registration", response.data.message);
      }
    } catch (error) {
      console.error("Error disabling registration:", error.response?.data || error.message);
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
        toast.success("Verify success");
        router.replace(router.asPath);
      } else {
        // Handle errors
        toast.error("Can't verify, please try again!");
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
        toast.success("Reject success");
        router.replace(router.asPath);
      } else {
        // Handle errors
      }
    } catch (error) {
      console.error("Error rejecting registration:", error);
    }
  };
  const handleReactive = async (registrationId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/registrations/reactivate/${registrationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Registration reactive successfully!");
        router.replace(router.asPath);
      } else {
        console.error("Failed to reactive registration", response.data.message);
      }
    } catch (error) {
      console.error("Error reactivating registration:", error.message);
    }
  };
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
  return (
    <>
      <Head>
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
                  <Image
                    src={`data:image/png;base64, ${registration.faceImage}`}
                    alt={`Face of ${registration.username}`}
                    width={400}
                    height={640}
                  ></Image>
                )}
              </Grid>

              {/* Registration Details on the right */}
              <Grid item xs={12} md={6} lg={8}>
                <Paper elevation={3} style={{ padding: 16, borderRadius: 8 }}>
                  <Grid container spacing={4}>
                    {/* Left side */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">{`Registration Status: ${registration.status}`}</Typography>
                      <Typography variant="body1">{`Approved By: ${registration.approvedBy}`}</Typography>
                      <Typography variant="body1">
                        {`Expired Date: ${
                          registration.expiredDate
                            ? moment(registration.expiredDate).format("YYYY-MM-DD HH:mm:ss")
                            : " "
                        }`}
                      </Typography>
                      <Typography variant="body1">{`Plate Number: ${registration.plateNumber}`}</Typography>
                      <Typography variant="body1">{`Model: ${registration.model}`}</Typography>
                      <Typography variant="body1">{`Registration Number: ${registration.registrationNumber}`}</Typography>
                      <Typography variant="body1">{`Manufacture: ${registration.manufacture}`}</Typography>
                    </Grid>
                    {/* Right side */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">{`Gender: ${registration.gender}`}</Typography>
                      <Typography variant="body1">{`User ID: ${registration.userId}`}</Typography>
                      <Typography variant="body1">{`Created At: ${moment(
                        registration.createdAt
                      ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                      <Typography variant="body1">{`Updated At: ${moment(
                        registration.updatedAt
                      ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                    </Grid>
                  </Grid>

                  {/* Additional buttons based on registration status */}
                  <Stack
                    spacing={1}
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent={{ xs: "flex-start", sm: "flex-end" }}
                  >
                    {registration.status === "created" && (
                      <>
                        <Button onClick={() => handleReject(registration.registrationId)}>
                          Reject
                        </Button>
                        <Button onClick={() => handleVerify(registration.registrationId)}>
                          Verify
                        </Button>
                      </>
                    )}
                    {registration.status === "verified" && (
                      <Button onClick={() => handleReject(registration.registrationId)}>
                        Reject
                      </Button>
                    )}
                    {registration.status === "paid" && (
                      <>
                        <Button onClick={() => handleReject(registration.registrationId)}>
                          Reject
                        </Button>
                        <Button onClick={() => handleActivate(registration.registrationId)}>
                          Activate
                        </Button>
                      </>
                    )}
                    {registration.status === "active" && (
                      <Button onClick={() => handleDeactive(registration.registrationId)}>
                        Deactivate
                      </Button>
                    )}
                    {registration.status === "temp-inactive" && (
                      <Button onClick={() => handleReactive(registration.registrationId)}>
                        Reactivate
                      </Button>
                    )}
                  </Stack>

                  {/* Activate Registration Form */}
                  <ActivateRegistrationForm
                    open={isActivateFormOpen}
                    handleClose={() => setIsActivateFormOpen(false)}
                    handleActivate={handleActivate}
                    cards={cards}
                    selectedCardId={selectedCardId}
                    setSelectedCardId={setSelectedCardId}
                    registrationId={registration.registrationId}
                  />
                  {/* Toggle switch for showing/hiding payment information */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1">Show Payments</Typography>
                    <Switch
                      checked={showPayments}
                      onChange={() => setShowPayments(!showPayments)}
                      color="primary"
                    />
                  </Stack>
                  {/* Payment Information */}
                  {showPayments && <PaymentInfo payments={payments} />}
                  {/* New section for Registration History */}
                  <Stack>
                    <Typography variant="h5">Registration History</Typography>
                    {/* List for histories */}
                    <List>
                      {Array.isArray(registrationHistories) &&
                        registrationHistories.map((history) => (
                          <ListItem key={history.registrationHistoryId} disablePadding>
                            <Box
                              sx={{
                                backgroundColor: "#f0f0f0",
                                borderRadius: 4,
                                padding: 1,
                                marginBottom: 1,
                                width: "100%",
                              }}
                            >
                              <ListItemText
                                primary={`Status: ${history.status}`}
                                secondary={
                                  <>
                                    <Typography
                                      component="span"
                                      variant="body2"
                                      color="text.primary"
                                    >{`Approved By: ${history.approvedBy}`}</Typography>
                                    <br />
                                    <Typography
                                      component="span"
                                      variant="body2"
                                      color="text.primary"
                                    >{`Created At: ${moment(history.createdAt).format(
                                      "YYYY-MM-DD HH:mm:ss"
                                    )}`}</Typography>
                                    {/* Add other details from the history if needed */}
                                  </>
                                }
                              />
                            </Box>
                          </ListItem>
                        ))}
                    </List>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

RegistrationDetailPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const ActivateRegistrationForm = ({ open, handleClose, handleActivate, cards, registrationId }) => {
  const [selectedCardId, setSelectedCardId] = useState("");
  const auth = useAuthContext();
  const token = auth.user?.accessToken;
  const handleActivateClick = async () => {
    // Validate the form fields, perform additional checks if needed
    if (selectedCardId) {
      try {
        // Make a request to activate the registration using the selected card
        const response = await axios.put(
          `${apiUrl}/api/admin/registrations/active/${registrationId}`,
          {
            cardId: selectedCardId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          // Call handleActivate to perform additional logic
          handleActivate(registrationId);
          toast.success("Registration activated successfully!");
        } else {
          console.error("Failed to activate registration", response.data.message);
        }
      } catch (error) {
        toast.error("Error activating registration. Please try again.", { autoClose: 3000 });
        console.error("Error activating registration:", error);
      }

      handleClose();
    } else {
      // Display an error or handle invalid form data
      console.error("Invalid form data");
      toast.error("Please select a card to activate the registration.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Activate Registration</DialogTitle>
      <DialogContent>
        <DialogContentText>Select a card to activate the registration:</DialogContentText>
        <FormControl fullWidth>
          <InputLabel id="cardId-label">Select Card</InputLabel>
          <Select
            labelId="cardId-label"
            value={selectedCardId}
            onChange={(e) => setSelectedCardId(e.target.value)}
            required
          >
            {cards.activeCards ? (
              cards.activeCards.map((card) => (
                <MenuItem key={card.cardId} value={card.cardId}>
                  {card.cardId}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No cards available</MenuItem>
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleActivateClick} color="primary">
          Activate
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const PaymentInfo = ({ payments }) => {
  return (
    <Stack>
      <Typography variant="h5">Payment Information</Typography>
      <Grid container spacing={2}>
        {payments.map((payment) => (
          <Grid item key={payment.paymentId} xs={12}>
            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                borderRadius: 4,
                padding: 2,
              }}
            >
              <Typography variant="body1">{`Amount: ${payment.amount}`}</Typography>
              <Typography variant="body1">{`Payment Method: ${payment.paymentMethod}`}</Typography>
              <Typography variant="body1">{`Status: ${payment.status}`}</Typography>
              <Typography variant="body1">{`Created At: ${moment(payment.createdAt).format(
                "YYYY-MM-DD HH:mm:ss"
              )}`}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default RegistrationDetailPage;
