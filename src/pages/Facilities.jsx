import Header from "../components/Header";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const PlaceholderImage = ({ label }) => (
  <Box
    sx={{
      height: 200,
      bgcolor: "#f5f5f5",
      border: "2px dashed #ccc",
      borderRadius: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#888",
      fontSize: "1rem",
      mb: 2,
    }}
  >
    {label || "Image Placeholder"}
  </Box>
);

const Facilities = () => {
  return (
    <>
      <Header current="facilities" />
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Facilities
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <Card sx={{ p: 2 }}>
              <img
                src="/gym.jpg"
                alt="Gym"
                style={{ width: "100%", height: 300, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Gym
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Modern fitness equipment and spacious workout area. Open
                  daily.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <Card sx={{ p: 2 }}>
              <img
                src="/lobby_cafe.png"
                alt="Lobby Cafe"
                style={{ width: "100%", height: 300, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Lobby Cafe
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Coffee, tea, and light bites in a cozy lobby setting.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <Card sx={{ p: 2 }}>
              <img
                src="/cafeteria.jpg"
                alt="Cafeteria"
                style={{ width: "100%", height: 300, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Cafeteria
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Casual dining with self-service options for quick meals.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <Card sx={{ p: 2 }}>
              <img
                src="/common_area1.png"
                alt="Common Area"
                style={{ width: "100%", height: 300, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Common Area
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Shared lounge, seating, and co-working spaces for guests.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Facilities;
