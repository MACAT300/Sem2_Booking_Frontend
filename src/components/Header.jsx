// src/components/Header.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Link } from "@mui/material";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Room", to: "/rooms" },
  { label: "Facilities", to: "/facilities" },
  { label: "My Bookings", to: "/my-bookings" },
];

const Header = () => {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["currentuser"]);
  const { currentuser } = cookies; // 如果没有登录，currentuser 为 undefined

  const handleLogout = () => {
    try {
      removeCookie("currentuser", { path: "/" });
      toast.success("You have logged out.");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // 处理导航点击：未登录用户强制跳 login
  const handleNavClick = (item) => {
    if (!currentuser && item.label !== "Home") {
      navigate("/login");
    } else {
      navigate(item.to);
    }
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        background: "#000000",
        border: "none",
        borderRadius: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component="span"
          sx={{
            textDecoration: "none",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Forward Hotel Booking
        </Typography>

        {/* 导航菜单项 */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {navItems
            .filter((item) => !(currentuser && item.label === "Home")) // 登录后隐藏 Home
            .map((item) => (
              <Typography
                key={item.to}
                onClick={() => handleNavClick(item)}
                sx={{
                  textDecoration: "none",
                  color: "#fff",
                  cursor: "pointer",
                  "&:hover": { color: "#e0e0e0" },
                }}
              >
                {item.label}
              </Typography>
            ))}
        </Box>

        {/* 管理与退出按钮（仅登录用户显示） */}
        {currentuser && (
          <Box sx={{ display: "flex", gap: 2 }}>
            {currentuser.role === "admin" && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => navigate("/dashboard")}
              >
                Manage
              </Button>
            )}
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
