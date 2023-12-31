"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography, Button, Unstable_Grid2 as Grid } from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";
import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const CreateFeeForm = ({ open, handleClose, handleCreate }) => {
  const [feeName, setFeeName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const handleCreateClick = () => {
    // Validate the form fields, perform additional checks if needed
    if (feeName && amount && description) {
      handleCreate({ feeName, amount, description });
      handleClose();
    } else {
      // Display an error or handle invalid form data
      console.error("Invalid form data");
      toast.error("Invalid form data. Please fill in all the fields.");
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create New Fee</DialogTitle>
      <DialogContent>
        <DialogContentText>Fill in the details for the new fee:</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="feeName"
          label="Fee Name"
          type="text"
          fullWidth
          value={feeName}
          onChange={(e) => setFeeName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="amount"
          label="Amount"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          margin="dense"
          id="description"
          label="Description"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreateClick} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const FeesIndexPage = () => {
  const [feesList, setFeesList] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const auth = useAuthContext();
  const token = auth.user.accessToken;

  const handleCreateFee = async (formData) => {
    try {
      const response = await axios.post(`${apiUrl}/api/admin/fees`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setFeesList((prevFees) => [...prevFees, response.data.data.fee]);
        toast.success("Fee created successfully!");
      } else {
        console.error("Failed to create fee:", response.data.message);
      }
    } catch (error) {
      toast.error("Error creating fee. Please try again.", { autoClose: 3000 });
      console.error("Error creating fee:");
    }
  };
  const handleDeleteFee = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/api/admin/fees/${selectedFeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setFeesList((prevFees) => prevFees.filter((fee) => fee.feeId !== selectedFeeId));
        toast.success("Fee deleted successfully!");
      } else {
        console.error("Failed to delete fee:", response.data.message);
        toast.error("Failed to delete fee. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting fee:", error);
      toast.error("Error deleting fee. Something went wrong.");
    }
  };

  const handleDeleteButtonClick = (feeId) => {
    setSelectedFeeId(feeId);
    setIsDeleteDialogOpen(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/fees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.data && response.data.data.fees) {
          const fees = response.data.data.fees;
          setFeesList(fees);
        } else {
          console.error("Failed to fetch fees data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching fees data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Fee Management | Smart Parking</title>
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
            <Typography variant="h4">Fee Management</Typography>
            <div style={{ textAlign: "left" }}>
              <Button variant="contained" color="primary" onClick={() => setIsFormOpen(true)}>
                Create New Fee
              </Button>
            </div>
            {/* Create Fee Form */}
            <CreateFeeForm
              open={isFormOpen}
              handleClose={() => setIsFormOpen(false)}
              handleCreate={handleCreateFee}
            />
            <Grid container spacing={3}>
              {feesList.map((fee) => (
                <Grid item key={fee.feeId} xs={12} md={6} lg={4}>
                  <Box
                    sx={{
                      backgroundColor: "#f0f0f0",
                      borderRadius: 4,
                      padding: 3,
                      minHeight: "250px",
                      margin: "16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <Typography variant="h6" gutterBottom>
                        {fee.feeName}
                      </Typography>
                      <Typography variant="body1">{`Amount: ${fee.amount}`}</Typography>
                      <Typography variant="body1">{`Description: ${fee.description}`}</Typography>
                      {/* <Typography variant="body1">{`Created At: ${fee.createdAt}`}</Typography> */}
                      <Typography variant="body1">{`Updated At: ${fee.updatedAt}`}</Typography>
                    </div>
                    {/* button section */}
                    <Stack direction="row" spacing={1} justifyContent="space-between">
                      <Link href={`/fees/${fee.feeId}`}>
                        <Button variant="outlined" color="primary">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteButtonClick(fee.feeId)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <DeleteFeeDialog
              open={isDeleteDialogOpen}
              handleClose={() => setIsDeleteDialogOpen(false)}
              handleDelete={handleDeleteFee}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

FeesIndexPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default FeesIndexPage;
const DeleteFeeDialog = ({ open, handleClose, handleDelete }) => {
  const handleConfirmDelete = () => {
    handleDelete();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Delete Fee"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this fee? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirmDelete} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
