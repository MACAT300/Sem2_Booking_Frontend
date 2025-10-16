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

import validator from "email-validator";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { signup } from "../../utils/api_auth";
import { useCookies } from "react-cookie";

const SignUp = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["cookie-name"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //  控制密码
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFormSubmit = async () => {
    try {
      //  验证输入
      if (!name || !email || !password || !confirmPassword) {
        toast.error("Please fill up all the fields");
      } else if (!validator.validate(email)) {
        toast.error("Please use a valid email address");
      } else if (!email.endsWith("@gmail.com")) {
        toast.error("Email must be a Gmail address (end with @gmail.com)");
      } else if (password !== confirmPassword) {
        toast.error("Passwords do not match");
      } else {
        //  调用 signup API
        const userData = await signup(name, email, password);
        setCookie("currentuser", userData, {
          maxAge: 60 * 60 * 8, // expire in 8 hours
        });
        toast.success("You have successfully signed up an account!");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
      <Header current="signup" />
      <Container maxWidth="sm" sx={{ mt: 3 }}>
        <Typography variant="h3" align="center" mb={2}>
          Create New Account
        </Typography>

        <Box mb={2}>
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>

        {/*  密码输入框 + 显示按钮 */}
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

        {/* 🔁 确认密码输入框 + 显示按钮 */}
        <Box mb={2}>
          <TextField
            label="Confirm Password"
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

        {/* 登录提示：已有账号跳转登录 */}
        <Typography align="center" variant="body2">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#1976d2",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Login here
          </span>
        </Typography>
      </Container>
    </>
  );
};

export default SignUp;
