import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Typography,
  Container,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import {
  getBookings,
  updateBooking,
  deleteBooking,
} from "../utils/api_booking";

const statusOptions = ["pending", "confirmed", "cancelled"];

const ManageBookings = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const token = cookies.currentuser?.token || "";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getBookings(token);
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          toast.error("Failed to load bookings");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error loading bookings");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleStatusChange = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
    );
  };

  const handleSaveStatus = async (id, status) => {
    try {
      const updated = await updateBooking(id, status, token);
      toast.success("Booking updated");
      // 仅合并状态，保留原来的 user/room 等已 populate 的字段，避免变成纯 ID
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: updated?.status ?? status } : b
        )
      );
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Update failed";
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmed) return;
    try {
      await deleteBooking(id, token);
      toast.success("Booking deleted");
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Delete failed";
      toast.error(message);
    }
  };

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString() : "-";

  if (!token) {
    return (
      <Box>
        <Typography variant="h5" align="center" sx={{ mt: 6 }}>
          Please login as admin to manage bookings
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ p: 4, display: "flex", justifyContent: "center" }}
      >
        Manage Bookings
      </Typography>

      {/* 顶部操作栏 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
          mb: 2,
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate("/dashboard")}>
            Back
          </Button>
        </Box>
      </Box>

      <Container>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : bookings && bookings.length > 0 ? (
                bookings.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell>{b._id}</TableCell>
                    <TableCell>
                      {b.user?.name || b.user?.email || b.user || "-"}
                    </TableCell>
                    <TableCell>{b.room?.name || b.room || "-"}</TableCell>
                    <TableCell>{fmtDate(b.checkInDate)}</TableCell>
                    <TableCell>{fmtDate(b.checkOutDate)}</TableCell>
                    <TableCell>${b.totalPrice ?? 0}</TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={b.status || "pending"}
                          label="Status"
                          onChange={(e) =>
                            handleStatusChange(b._id, e.target.value)
                          }
                        >
                          {statusOptions.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleSaveStatus(b._id, b.status)}
                      >
                        SAVE
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(b._id)}
                      >
                        DELETE
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No bookings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default ManageBookings;