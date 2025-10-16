import Header from "../components/Header";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { addRoom } from "../utils/api_rooms"; //
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { API_URL } from "../utils/constants";
import { getTypes } from "../utils/api_type";
import { useCookies } from "react-cookie";
import { uploadImage } from "../utils/api_image";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const RoomAdd = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [capacity, setCapacity] = useState(1);
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);

  const [types, setTypes] = useState([]);

  // 获取房间类型
  useEffect(() => {
    getTypes().then((data) => setTypes(data));
  }, []);

  // 提交表单
  const handleFormSubmit = async () => {
    if (!name || !type || !price || !capacity) {
      toast.error("Please fill up the required fields");
      return;
    }

    try {
      await addRoom(name, type, description, price, capacity, image, token); //

      toast.success("New room has been added");
      navigate("/rooms");
    } catch (error) {
      toast.error(error.message);
      console.log(error.response?.data);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Typography variant="h3" align="center" mb={2}>
          Add New Room
        </Typography>

        <Box mb={2}>
          <TextField
            label="Room Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Description"
            fullWidth
            value={description}
            multiline
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

        <Box mb={2}>
          <TextField
            type="number"
            label="Price"
            fullWidth
            value={price}
            inputProps={{ min: 0 }}
            onChange={(e) => setPrice(Math.max(0, e.target.value))}
          />
        </Box>

        <Box mb={2}>
          <TextField
            type="number"
            label="Capacity"
            fullWidth
            value={capacity}
            inputProps={{ min: 1 }}
            onChange={(e) => setCapacity(Math.max(1, e.target.value))}
          />
        </Box>

        <Box mb={2}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel
              id="type-select-label"
              sx={{ backgroundColor: "white", paddingRight: "5px" }}
            >
              Type
            </InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              value={type}
              label="Type"
              onChange={(event) => setType(event.target.value)}
            >
              {types.map((t) => (
                <MenuItem key={t._id} value={t.label}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mb={2} sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {image ? (
            <>
              <img src={API_URL + image} width="200px" />
              <Button
                color="info"
                variant="contained"
                size="small"
                onClick={() => setImage(null)}
              >
                Remove
              </Button>
            </>
          ) : (
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload image
              <VisuallyHiddenInput
                type="file"
                onChange={async (event) => {
                  const data = await uploadImage(event.target.files[0]);
                  // { image_url: "uploads/image.jpg" }
                  // set the image url into state
                  setImage(data.image_url);
                }}
                accept="image/*"
              />
            </Button>
          )}
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
      </Container>
    </>
  );
};

export default RoomAdd;
