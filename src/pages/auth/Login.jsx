import Header from "../../components/Header";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { login } from "../../utils/api_auth";
import { useCookies } from "react-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["currentuser"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ 控制显示密码

  const handleFormSubmit = async () => {
    try {
      // 1 检查输入
      if (!email || !password) {
        toast.error("Please fill up all the fields");
      } else if (!email.endsWith("@gmail.com")) {
        toast.error("Email must be a Gmail address (end with @gmail.com)");
      } else {
        // 2 登录请求
        const userData = await login(email, password);
        // 设置 cookies
        setCookie("currentuser", userData, {
          maxAge: 60 * 60 * 8, // expire 8 hours
        });
        toast.success("You have successfully logged in!");
        navigate("/rooms");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Header current="login" />
      <Container maxWidth="sm" sx={{ mt: 3 }}>
        <Typography variant="h3" align="center" mb={2}>
          Login To Your Account
        </Typography>

        <Box mb={2}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Password"
            fullWidth
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </Box>

        {/*  新增这一行：提示跳转注册页 */}
        <Typography align="center" variant="body2">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={{
              color: "#1976d2",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Sign up here
          </span>
        </Typography>
      </Container>
    </>
  );
};

export default Login;
