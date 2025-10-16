import axios from "axios";

import { API_URL } from "./constants";

// 获取所有预订（仅管理员使用，后端需要 isAdmin 验证）
export const getBookings = async (token) => {
  const response = await axios.get(API_URL + "bookings", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

// 根据房间获取预订（用于禁用已被占用的日期）
// 说明：需要后端提供 GET /bookings/room/:roomId 路由
export const getBookingsByRoom = async (roomId) => {
  const response = await axios.get(API_URL + "bookings/room/" + roomId);
  return response.data;
};

// 获取单个预订详情（用于收据页显示）
export const getBookingById = async (id) => {
  const response = await axios.get(API_URL + "bookings/" + id);
  return response.data;
};

// 根据用户获取预订（用于“我的预约”页面）
// 说明：需要后端提供 GET /bookings/user/:userId 路由
export const getBookingsByUser = async (userId, token) => {
  const response = await axios.get(API_URL + "bookings/user/" + userId, {
    headers: token ? { Authorization: "Bearer " + token } : undefined,
  });
  return response.data;
};

// 创建预订（用户）
// 按照你提供的后端：{ user, room, checkInDate, checkOutDate, totalPrice }
export const createBooking = async (
  user,
  room,
  checkInDate,
  checkOutDate,
  totalPrice
) => {
  const response = await axios.post(API_URL + "bookings", {
    user,
    room,
    checkInDate,
    checkOutDate,
    totalPrice,
  });
  return response.data;
};

// 更新预订状态（管理员）
export const updateBooking = async (id, status, token) => {
  const response = await axios.put(
    API_URL + "bookings/" + id,
    { status },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
};

// 删除预订（管理员）
export const deleteBooking = async (id, token) => {
  const response = await axios.delete(API_URL + "bookings/" + id, {
    headers: token ? { Authorization: "Bearer " + token } : undefined,
  });
  return response.data;
};
