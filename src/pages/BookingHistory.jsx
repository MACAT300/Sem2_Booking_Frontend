import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { getBookingsByUser } from "../utils/api_booking";

const BookingHistory = () => {
  const [cookies] = useCookies(["currentuser"]);
  const navigate = useNavigate();
  const currentuser = cookies.currentuser || {};
  const token = currentuser.token;
  const userId = currentuser._id || currentuser.id;

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!userId) {
          setError("Please login to view your bookings.");
          setBookings([]);
          return;
        }
        const data = await getBookingsByUser(userId, token);
        setBookings(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        const msg =
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load bookings";
        setError(msg);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [userId, token]);

  if (!userId) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          My Bookings
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You are not logged in.
          </Typography>
          <Button variant="contained" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {/* 回去按钮和标题同一行 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          position: "relative",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ position: "absolute", left: 0 }}
        >
          Go Back
        </Button>
        <Typography variant="h5" gutterBottom>
          My Bookings
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 3 }}>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {bookings.length === 0 ? (
            <Typography color="text.secondary">No bookings found.</Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {bookings.map((b) => {
                const roomName =
                  typeof b.room === "object" ? b.room?.name : b.room;
                const price = b.totalPrice ?? b.room?.price;
                const inStr = new Date(b.checkInDate).toLocaleDateString();
                const outStr = new Date(b.checkOutDate).toLocaleDateString();
                return (
                  <Paper key={b._id} variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {roomName || "Room"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {inStr} ~ {outStr}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">
                        Total: ${price || 0}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate(`/receipt/${b._id}`)}
                        >
                          View Receipt
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default BookingHistory;
