import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "./constants";

export const login = async (email, password) => {
  const res = await axios.post(API_URL + "users/login", { email, password });
  return res.data;
};

export const signup = async (name, email, password) => {
  const res = await axios.post(API_URL + "users/signup", {
    name,
    email,
    password,
  });
  return res.data;
};

export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL + "users");
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const getUser = async (id) => {
  try {
    const response = await axios.get(`${API_URL}users/${id}`);
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};

// update user
export const updateUser = async (id, userData, token) => {
  try {
    const response = await axios.put(`${API_URL}users/${id}`, userData, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Update user error:", error);
    toast.error(error.response?.data?.error || "Failed to update user");
    throw error;
  }
};

// delete user
export const deleteUser = async (id, token) => {
  try {
    const res = await fetch(`http://localhost:5555/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 检查 HTTP 状态码
    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(errMsg || "Failed to delete user");
    }

    // 正确解析 fetch 返回的 JSON
    const data = await res.json();

    return data; // 返回解析后的数据
  } catch (error) {
    console.error("Delete user error:", error);
    // 有可能 error.response 不存在，所以改成安全写法
    const message =
      error.response?.data?.error || error.message || "Delete failed";
    toast.error(message);
  }
};

export const getCurrentUser = (cookies) => {
  return cookies.currentuser ? cookies.currentuser : null;
};

export const isUserLoggedIn = (cookies) => {
  return getCurrentUser(cookies) ? true : false;
};

export const isAdmin = (cookies) => {
  const currentUser = getCurrentUser(cookies);
  return currentUser && currentUser.role === "admin" ? true : false;
};

// function to access cookies.currentUser.token
export function getUserToken(cookies) {
  return cookies?.currentUser?.token || null;
}
