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
  TextField,
} from "@mui/material";
import { toast } from "sonner";
import { getUsers, deleteUser } from "../utils/api_auth";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  // ✅ 初始化加载
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      if (Array.isArray(data)) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading users");
    }
  };

  // ✅ 删除用户
  const handleDelete = async (_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    try {
      const result = await deleteUser(_id, token);

      if (result?.message === "User deleted successfully") {
        toast.success("User deleted successfully");
        const latestUsers = await getUsers();
        setUsers(latestUsers);
        applyFilters(latestUsers, filter, searchTerm);
      } else {
        toast.error(result?.message || "Failed to delete user");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting user");
    }
  };

  // ✅ 通用筛选函数（过滤 + 搜索）
  const applyFilters = (userList, roleFilter, search) => {
    let filtered = [...userList];

    // 角色筛选
    if (roleFilter === "admin") {
      filtered = filtered.filter((u) => u.role === "admin");
    } else if (roleFilter === "user") {
      filtered = filtered.filter((u) => u.role === "user");
    }

    // 搜索框过滤
    if (search.trim() !== "") {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  // ✅ 切换角色过滤
  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
    applyFilters(users, newFilter, searchTerm);
  };

  // ✅ 搜索输入变化
  const handleSearchChange = (event) => {
    const newSearch = event.target.value;
    setSearchTerm(newSearch);
    applyFilters(users, filter, newSearch);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ p: 4, display: "flex", justifyContent: "center" }}
      >
        User Dashboard
      </Typography>

      {/* 顶部操作栏 */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
          mb: 2,
          gap: 2,
        }}
      >
        {/* 左侧按钮与过滤 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate("/rooms")}>
            Back
          </Button>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filter</InputLabel>
            <Select value={filter} onChange={handleFilterChange} label="Filter">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="admin">Admins</MenuItem>
              <MenuItem value="user">Users</MenuItem>
            </Select>
          </FormControl>

          {/* ✅ 搜索框 */}
          <TextField
            size="small"
            label="Search"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          {/* 管理预订按钮（紧邻搜索框） */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/manage-bookings")}
          >
            Manage Bookings
          </Button>
        </Box>

        {/* 右侧添加按钮 */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/user/new")}
        >
          Add User
        </Button>
      </Box>

      {/* 用户表格 */}
      <Container>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user._id}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="right">
                      {user.role !== "admin" && (
                        <>
                          <Button
                            variant="contained"
                            component={Link}
                            to={`/user/${user._id}/edit/`}
                            color="success"
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            EDIT
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(user._id)}
                          >
                            DELETE
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No users found
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

export default Dashboard;
