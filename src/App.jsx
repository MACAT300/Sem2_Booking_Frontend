import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { CookiesProvider } from "react-cookie";

import Home from "./pages/Home";
import Rooms from "./pages/Room";
import RoomAdd from "./pages/RoomAdd";
import RoomEdit from "./pages/RoomEdit";
import RoomBooking from "./pages/RoomBooking";
import BookingReceipt from "./pages/BookingReceipt";
import BookingHistory from "./pages/BookingHistory";
import ManageBookings from "./pages/ManageBookings";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard";
import UserEdit from "./pages/UserEdit";
import UserAdd from "./pages/UserAdd";
import Facilities from "./pages/Facilities";

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/new" element={<RoomAdd />} />
          <Route path="/rooms/:id/edit" element={<RoomEdit />} />
          <Route path="/rooms/:id/booking" element={<RoomBooking />} />
          <Route path="/receipt/:id" element={<BookingReceipt />} />
          <Route path="/my-bookings" element={<BookingHistory />} />
          <Route path="/manage-bookings" element={<ManageBookings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user/:id/edit" element={<UserEdit />} />
          <Route path="/user/new" element={<UserAdd />} />
          <Route path="/facilities" element={<Facilities />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
