import axios from "axios";
import { API_URL } from "./constants";

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// 获取特定球馆的所有评论
export async function getReviews(roomId) {
  const response = await axios.get(`${API_URL}reviews/room/${roomId}`);
  return response.data;
}

// 创建评论
export async function addReview(roomId, rating, comment, token) {
  const response = await axios.post(
    `${API_URL}reviews`,
    { room: roomId, rating, comment },
    getAuthHeader(token)
  );
  return response.data;
}

// 删除评论
export async function deleteReview(id, token) {
  const response = await axios.delete(
    `${API_URL}reviews/${id}`,
    getAuthHeader(token)
  );
  return response.data;
}
