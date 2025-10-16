import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import Header from "../components/Header";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { useState, useEffect } from "react";
import { getRooms, deleteRoom } from "../utils/api_rooms";
import { getTypes } from "../utils/api_type";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { API_URL } from "../utils/constants";
import { useCookies } from "react-cookie";

const Rooms = () => {
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies; // avoid undefined
  const { role = "user" } = currentuser;

  // room data
  const [rooms, setRooms] = useState([]);
  // pagination
  const [page, setPage] = useState(1);
  // filter by type
  const [type, setType] = useState("all");
  const [types, setTypes] = useState([]);

  useEffect(() => {
    getTypes().then((data) => setTypes(data));
  }, []);

  // 当 type 或 page 改变时取房间
  useEffect(() => {
    getRooms(type, page).then((data) => setRooms(data));
  }, [type, page]);

  const handleType = (newType) => {
    setType(newType);
  };

  const handleRoomDelete = async (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this room?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#78828cff",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRoom(id);
          const updatedRooms = await getRooms(type, page);
          setRooms(updatedRooms);

          toast.success("Room has been deleted");
        } catch (error) {
          const message =
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            error?.message ||
            "Delete failed";
          toast.error(message);
        }
      }
    });
  };

  return (
    <>
      <Header current="home" />
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            mt: 2,
          }}
        >
          <FormControl sx={{ minWidth: "250px" }}>
            <InputLabel
              id="demo-simple-select-label"
              sx={{ backgroundColor: "white", paddingRight: "5px" }}
            >
              Filter By Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              label="Genre"
              onChange={(event) => {
                setType(event.target.value);
                // reset the page back to 1
                setPage(1);
              }}
            >
              <MenuItem value="all">All</MenuItem>
              {types.map((cat) => (
                <MenuItem value={cat.label}>{cat.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {role === "admin" && (
            <Button
              component={Link}
              to="/rooms/new"
              variant="contained"
              color="secondary"
            >
              Add New
            </Button>
          )}
        </Box>
        <Grid container spacing={4}>
          {rooms.map((room) => (
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }} key={room._id}>
              <Card variant="outlined" sx={{ borderColor: "#000", borderWidth: 1, borderStyle: "solid" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    API_URL +
                    (room.image ? room.image : "uploads/default_image.png")
                  }
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{ minHeight: "64px", fontWeight: 700 }}
                  >
                    {room.name}
                  </Typography>
                  <Divider sx={{ my: 1, height: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      pt: 2,
                    }}
                  >
                    <Chip label={room.type ? room.type : ""} color="primary" />
                  </Box>
                </CardContent>

                <CardActions sx={{ display: "block", px: 3, pb: 3 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    href={`/rooms/${room._id}/booking`}
                    sx={{
                      backgroundColor: "#CBAA77",
                      color: "#ffffffff",
                      fontWeight: 700,
                      "&:hover": { backgroundColor: "#CBAA77" },
                    }}
                  >
                    Book Now
                  </Button>

                  {/* Edit & Delete 仅 admin 可见 */}
                  {role === "admin" && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        pt: 2,
                      }}
                    >
                      <Button
                        component={Link}
                        to={`/rooms/${room._id}/edit`}
                        variant="contained"
                        color="secondary"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRoomDelete(room._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        {rooms.length === 0 ? (
          <Typography variant="h5" align="center" py={3}>
            No more rooms found.
          </Typography>
        ) : null}
        <Box
          sx={{
            pt: 2,
            pb: 2,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              disabled={page === 1 ? true : false}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span>Page: {page}</span>
            <Button
              variant="contained"
              color="secondary"
              disabled={rooms.length === 0 ? true : false}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Rooms;
