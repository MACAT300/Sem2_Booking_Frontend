import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router";
import Header from "../components/Header";

const Home = () => {
  return (
    <>
      {/* Header（顶部导航） */}
      <Header current="home" />

      {/* 主体区域 */}
      <Box
        sx={{
          position: "relative",
          height: "100vh", // 占满大部分屏幕高度
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url('/forward.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        {/* 半透明遮罩，提升文字对比度 */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />

        {/* 内容 */}
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: "bold" }}>
            Welcome to Our Hotel
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            color="success"
            size="large"
            sx={{
              px: 5,
              py: 1.5,
              fontSize: "1.2rem",
              borderRadius: "10px",
            }}
          >
            Explore Rooms
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Home;
