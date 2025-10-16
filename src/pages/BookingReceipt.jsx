import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { getBookingById } from "../utils/api_booking";

// 预订确认收据页面：展示房间号、日期、名字
const BookingReceipt = () => {
  const { id } = useParams(); // 预订ID
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);

  // 页面状态：loading 与 booking 数据
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  // 加载预订详情
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(id);
        setBooking(data);
      } catch (error) {
        console.error("Load booking error:", error);
        toast.error("Failed to load booking receipt");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!booking) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 6 }}>
        Booking not found
      </Typography>
    );
  }

  // 从 cookies 取当前用户名字备用
  const currentName = cookies.currentuser?.name || "";
  const userName = booking.user?.name || currentName || "Unknown";
  const roomName = booking.room?.name || booking.room?._id || "Room";
  const checkInStr = new Date(booking.checkInDate).toLocaleDateString();
  const checkOutStr = new Date(booking.checkOutDate).toLocaleDateString();

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* 返回按钮 */}
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mb: 2 }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>

        {/* 标题 */}
        <Typography variant="h4" gutterBottom>
          Booking Receipt
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* 收据内容：房间号码/名称、日期、用户名字 */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            <strong>Room:</strong> {roomName}
          </Typography>
          <Typography variant="body1">
            <strong>Check-in:</strong> {checkInStr}
          </Typography>
          <Typography variant="body1">
            <strong>Check-out:</strong> {checkOutStr}
          </Typography>
          <Typography variant="body1">
            <strong>User:</strong> {userName}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>Status:</strong> {booking.status}
          </Typography>
          {typeof booking.totalPrice === "number" && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Total Price:</strong> ${booking.totalPrice}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/rooms")}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingReceipt;
