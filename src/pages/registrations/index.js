import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { RegistrationsTable } from "src/sections/registrations/registrations-table";
import { RegistrationsSearch } from "src/sections/registrations/registrations-search";
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";

const apiUrl = `http://localhost:3000/api/admin/registrations/allRegistrations`;
const Page = () => {
  const [registrations, setRegistrations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MiwidXNlcm5hbWUiOiIwOTA1NTQ3ODkwIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0wOVQyMjowNzoxNS44NzVaIn0sImlhdCI6MTcwMjE1OTYzNX0.J60sJNJPAXtXajholJQ8vg_FWWTJBJgXtuJ3DiTayWg";
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted && response.data.code === 200) {
          const formattedData = response.data.data.map((registration) => ({
            registrationId: registration.registrationId,
            username: registration.username,
            registrationStatus: registration.registrationStatus,
            approvedBy: registration.approvedBy,
            expiredDate: moment(registration.expiredDate).format("YYYY-MM-DD HH:mm:ss"),
            plateNumber: registration.plateNumber,
            createdAt: moment(registration.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            updatedAt: moment(registration.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
          }));
          setRegistrations(formattedData);
        }
      } catch (error) {
        toast.error("Failed to fetch registrations. Please try again.");
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Registration | Smart-Parking</title>
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
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Registration</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button>Import</Button>
                  <Button>Export</Button>
                </Stack>
              </Stack>
              <div>
                <Button>Add</Button>
              </div>
            </Stack>
            <RegistrationsSearch />

            <RegistrationsTable
              count={registrations.length}
              items={applyPagination(registrations, page, rowsPerPage)}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
