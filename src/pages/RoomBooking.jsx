import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Rating,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getRoom } from "../utils/api_rooms";
import axios from "axios";
import { API_URL } from "../utils/constants";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { addReview } from "../utils/api_review";
import { createBooking } from "../utils/api_booking";

const RoomBooking = () => {
  // 从 URL 中获取房间 ID
  const { id } = useParams();

  // 用于跳转页面
  const navigate = useNavigate();

  // 获取当前登录用户的 token
  const [cookies] = useCookies(["currentuser"]);
  const token = cookies.currentuser?.token;

  // 页面状态
  const [room, setRoom] = useState(null); // 当前房间详情
  const [loading, setLoading] = useState(true); // 是否在加载中
  const [comment, setComment] = useState(""); // 用户输入的评论文字
  const [reviews, setReviews] = useState([]); // 房间评论列表
  const [rating, setRating] = useState(0); // 用户评分

  // Booking（预订弹窗）相关状态
  const [openBooking, setOpenBooking] = useState(false); // 控制对话框开关
  const [checkInDate, setCheckInDate] = useState(null); // 入住日期
  const [checkOutDate, setCheckOutDate] = useState(null); // 退房日期
  const [submitting, setSubmitting] = useState(false); // 提交状态（防止重复提交）

  // 🟢 页面加载时，获取房间详情 + 评论
  useEffect(() => {
    (async () => {
      try {
        // 同时请求房间信息和房间评论
        const [roomData, reviewsRes] = await Promise.all([
          getRoom(id),
          axios.get(`${API_URL}reviews/room/${id}`),
        ]);
        setRoom(roomData);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load room data");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 将日期对象转为 YYYY-MM-DD 格式（发送给后端）
  const toYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  };

  // 返回“下一天”的日期
  const nextDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);

  // 打开预订弹窗
  const handleOpenBooking = () => {
    setOpenBooking(true);
  };

  // 关闭预订弹窗并重置状态
  const handleCloseBooking = () => {
    setOpenBooking(false);
    setCheckInDate(null);
    setCheckOutDate(null);
    setSubmitting(false);
  };

  // 计算入住天数（两日期相差多少天）
  const getNights = (inDate, outDate) => {
    if (!inDate || !outDate) return 0;
    const ms = new Date(outDate) - new Date(inDate);
    return ms > 0 ? Math.ceil(ms / 86400000) : 0; // 86400000 = 一天的毫秒数
  };

  // 🟢 创建预订（当用户点击“Confirm Booking”）
  const handleCreateBooking = async () => {
    try {
      // 未登录提示登录
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      // 检查是否选了日期
      if (!checkInDate || !checkOutDate) {
        toast.error("Please select check-in and check-out dates");
        return;
      }

      // 校验退房必须在入住之后
      const nights = getNights(checkInDate, checkOutDate);
      if (nights <= 0) {
        toast.error("Check-out must be after check-in");
        return;
      }

      setSubmitting(true);

      // 当前用户 ID（有时是 id，有时是 _id）
      const userId = cookies.currentuser?.id || cookies.currentuser?._id;
      const totalPrice = (room?.price || 0) * nights;

      // 调用后端创建预订
      const booking = await createBooking(
        userId,
        id,
        toYMD(checkInDate),
        toYMD(checkOutDate),
        totalPrice
      );

      toast.success("Booking created!");
      handleCloseBooking();
      navigate(`/receipt/${booking._id}`); // 跳到收据页面
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create booking";
      console.error("Create booking error:", message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // 🟢 提交用户评论（评分 + 评论文字）
  const handleAddReview = async () => {
    // 未登录则跳转
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    // 必须有评分和文字
    if (!rating || !comment.trim()) {
      toast.error("Please provide a rating and comment");
      return;
    }

    try {
      // 调用 API 提交评论
      const newReview = await addReview(id, rating, comment, token);
      toast.success("Review added!");
      // 新评论加到最前
      setReviews([newReview, ...reviews]);
      setComment("");
      setRating(0);
    } catch (error) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to add review";
      console.error("Add review error:", status, message);
      toast.error(message);
    }
  };

  // 🟡 房间不存在时显示提示
  if (!room) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 6 }}>
        Room not found
      </Typography>
    );
  }

  // 🟢 主体 UI 渲染
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* 返回按钮 */}
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mb: 2 }}
          onClick={() => navigate("/rooms")}
        >
          ← Back
        </Button>

        {/* 房间图片 */}
        {room.image && (
          <Box
            component="img"
            src={`${API_URL}${room.image}`}
            alt={room.name}
            sx={{
              width: "100%",
              height: 300,
              objectFit: "cover",
              borderRadius: 2,
              mb: 3,
            }}
          />
        )}

        {/* 房间详情 */}
        <Typography variant="h4" gutterBottom>
          {room.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {room.description || "No description available."}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Type:</strong> {room.type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Capacity:</strong> {room.capacity} person(s)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          <strong>Price:</strong> ${room.price}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* 添加评论区域 */}
        <Typography variant="h6" gutterBottom>
          Write a Review
        </Typography>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(Math.round(newValue || 0))}
        />
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ my: 2 }}
        />
        <Button variant="contained" onClick={handleAddReview}>
          Submit Review
        </Button>

        {/* 预订按钮 */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#CBAA77",
              "&:hover": { backgroundColor: "#CBAA77" },
            }}
            size="large"
            onClick={handleOpenBooking}
          >
            Book This Room
          </Button>
        </Box>

        {/* 评论显示 */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Reviews
        </Typography>

        {reviews.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No reviews yet.
          </Typography>
        ) : (
          reviews.map((review) => (
            <Paper
              key={review._id}
              elevation={1}
              sx={{ p: 2, mb: 2, borderRadius: 2 }}
            >
              <Typography variant="subtitle2">
                {review.user?.name || "Anonymous"}
              </Typography>
              <Rating value={review.rating} readOnly size="small" />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {review.comment}
              </Typography>
            </Paper>
          ))
        )}
      </Paper>

      {/* 预订对话框 */}
      <Dialog open={openBooking} onClose={handleCloseBooking} fullWidth>
        <DialogTitle>Choose Your Stay</DialogTitle>
        <DialogContent>
          {/* 用来让 DatePicker 支持国际化 */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              {/* 入住日期 */}
              <DatePicker
                label="Check-in"
                value={checkInDate}
                onChange={setCheckInDate}
                minDate={new Date()} // 不允许选择过去日期
                slotProps={{ textField: { fullWidth: true } }}
              />
              {/* 退房日期 */}
              <DatePicker
                label="Check-out"
                value={checkOutDate}
                onChange={setCheckOutDate}
                minDate={checkInDate ? nextDay(checkInDate) : new Date()}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
          </LocalizationProvider>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">
              Total: $
              {getNights(checkInDate, checkOutDate) * (room?.price || 0)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBooking} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleCreateBooking}
            disabled={submitting}
            variant="contained"
            color="primary"
          >
            {submitting ? "Submitting..." : "Confirm Booking"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoomBooking;
