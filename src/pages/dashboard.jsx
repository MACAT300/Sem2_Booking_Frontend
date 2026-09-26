import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import Header from "../components/Header";
import { API_URL } from "../utils/constants";

const money = (value) =>
  `RM ${Number(value || 0).toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

async function api(path, token, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || data.message || `Request failed (${response.status})`
    );
  }

  return data;
}

// Your backend returns six rooms/bookings per page.
async function loadAllPages(path, token) {
  const results = [];

  for (let page = 1; page <= 100; page += 1) {
    const separator = path.includes("?") ? "&" : "?";
    const batch = await api(`${path}${separator}page=${page}`, token);

    if (!Array.isArray(batch)) {
      throw new Error("Unexpected response from the server");
    }

    results.push(...batch);

    if (batch.length < 6) break;
  }

  return results;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const currentUser = cookies.currentuser;
  const token = currentUser?.token;

  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const [bookingData, roomData, userData] = await Promise.all([
        loadAllPages("bookings", token),
        loadAllPages("rooms", token),
        api("users", token),
      ]);

      setBookings(bookingData);
      setRooms(roomData);
      setUsers(userData);
    } catch (err) {
      setError(err.message || "Could not load the dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login", { replace: true });
      return;
    }

    loadDashboard();
    // Load when the signed-in admin changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, currentUser?.role, navigate]);

  const visibleRows = useMemo(() => {
    const source =
      tab === "bookings" ? bookings : tab === "rooms" ? rooms : users;

    return source.filter((item) => {
      let text;
      let category;

      if (tab === "bookings") {
        text = `${item.user?.name || ""} ${item.user?.email || ""} ${
          item.room?.name || ""
        } ${item._id}`;
        category = item.status?.toLowerCase();
      } else if (tab === "rooms") {
        text = `${item.name || ""} ${item.type || ""}`;
        category = item.type;
      } else {
        text = `${item.name || ""} ${item.email || ""}`;
        category = item.role;
      }

      return (
        text.toLowerCase().includes(search.toLowerCase()) &&
        (filter === "all" || category === filter)
      );
    });
  }, [tab, bookings, rooms, users, search, filter]);

  const roomTypes = [...new Set(rooms.map((room) => room.type).filter(Boolean))];

  async function updateStatus(bookingId, status) {
    try {
      await api(`bookings/${bookingId}`, token, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      toast.success("Booking status updated");
      await loadDashboard();
    } catch (err) {
      toast.error(err.message || "Could not update booking");
    }
  }

  async function removeItem(resource, id) {
    const itemName =
      resource === "users"
        ? "user"
        : resource === "rooms"
          ? "room"
          : "booking";

    if (!window.confirm(`Delete this ${itemName}? This cannot be undone.`)) {
      return;
    }

    try {
      await api(`${resource}/${id}`, token, { method: "DELETE" });
      toast.success(`${itemName[0].toUpperCase() + itemName.slice(1)} deleted`);
      await loadDashboard();
    } catch (err) {
      toast.error(err.message || `Could not delete ${itemName}`);
    }
  }

  function changeTab(nextTab) {
    setTab(nextTab);
    setSearch("");
    setFilter("all");
  }

  if (!currentUser || currentUser.role !== "admin") return null;

  return (
    <>
      <Header />

      <main className="fs-page fs-dashboard">
        <div className="fs-page-heading">
          <div>
            <span className="fs-eyebrow">ADMIN WORKSPACE</span>
            <h1>Dashboard</h1>
            <p>Welcome back, {currentUser.name}. Here’s what’s happening.</p>
          </div>

          {tab === "rooms" && (
            <Link className="fs-button fs-button-dark" to="/rooms/new">
              + Add room
            </Link>
          )}

          {tab === "users" && (
            <Link className="fs-button fs-button-dark" to="/user/new">
              + Add user
            </Link>
          )}
        </div>

        <div className="fs-stats">
          <div className="fs-stat">
            <span>Total bookings</span>
            <strong>{bookings.length}</strong>
            <small>All reservations</small>
          </div>

          <div className="fs-stat">
            <span>Pending bookings</span>
            <strong>
              {
                bookings.filter(
                  (booking) => booking.status?.toLowerCase() === "pending"
                ).length
              }
            </strong>
            <small>Need attention</small>
          </div>

          <div className="fs-stat">
            <span>Available rooms</span>
            <strong>{rooms.length}</strong>
            <small>Rooms in your catalogue</small>
          </div>

          <div className="fs-stat">
            <span>Guests</span>
            <strong>
              {users.filter((user) => user.role === "user").length}
            </strong>
            <small>Registered customers</small>
          </div>
        </div>

        <section className="fs-table-section">
          <div className="fs-tabs">
            {["bookings", "rooms", "users"].map((name) => (
              <button
                key={name}
                type="button"
                className={tab === name ? "active" : ""}
                onClick={() => changeTab(name)}
              >
                {name[0].toUpperCase() + name.slice(1)}
                <span>
                  {name === "bookings"
                    ? bookings.length
                    : name === "rooms"
                      ? rooms.length
                      : users.length}
                </span>
              </button>
            ))}
          </div>

          <div className="fs-toolbar">
            <input
              type="search"
              aria-label={`Search ${tab}`}
              placeholder={`Search ${tab}...`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              aria-label={`Filter ${tab}`}
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All {tab}</option>

              {tab === "bookings" &&
                ["pending", "confirmed", "cancelled"].map((status) => (
                  <option key={status} value={status}>
                    {status[0].toUpperCase() + status.slice(1)}
                  </option>
                ))}

              {tab === "users" && (
                <>
                  <option value="user">Users</option>
                  <option value="admin">Admins</option>
                </>
              )}

              {tab === "rooms" &&
                roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
            </select>

            <span className="fs-results">
              {visibleRows.length} result{visibleRows.length !== 1 ? "s" : ""}
            </span>
          </div>

          {error && (
            <div className="fs-error">
              {error}
              <button onClick={loadDashboard}>Try again</button>
            </div>
          )}

          {loading ? (
            <div className="fs-empty">Loading dashboard...</div>
          ) : visibleRows.length === 0 ? (
            <div className="fs-empty">
              <h3>No {tab} found</h3>
              <p>Try another search or filter.</p>
            </div>
          ) : (
            <div className="fs-table-scroll">
              <table className="fs-table">
                {tab === "bookings" && (
                  <>
                    <thead>
                      <tr>
                        <th>Guest</th>
                        <th>Room</th>
                        <th>Stay dates</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleRows.map((booking) => (
                        <tr key={booking._id}>
                          <td>
                            <strong>
                              {booking.user?.name || "Deleted user"}
                            </strong>
                            <small>{booking.user?.email || ""}</small>
                          </td>

                          <td>{booking.room?.name || "Deleted room"}</td>

                          <td>
                            {formatDate(booking.checkInDate)}
                            <br />
                            <span className="fs-muted">
                              to {formatDate(booking.checkOutDate)}
                            </span>
                          </td>

                          <td>{money(booking.totalPrice)}</td>

                          <td>
                            <span
                              className={`fs-badge ${
                                booking.status?.toLowerCase() || "pending"
                              }`}
                            >
                              {booking.status || "Pending"}
                            </span>
                          </td>

                          <td>
                            <div className="fs-row-actions">
                              <select
                                aria-label={`Status for booking ${booking._id}`}
                                value={booking.status || "Pending"}
                                onChange={(event) =>
                                  updateStatus(
                                    booking._id,
                                    event.target.value
                                  )
                                }
                              >
                                <option>Pending</option>
                                <option>Confirmed</option>
                                <option>Cancelled</option>
                              </select>

                              <button
                                className="fs-delete"
                                onClick={() =>
                                  removeItem("bookings", booking._id)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {tab === "rooms" && (
                  <>
                    <thead>
                      <tr>
                        <th>Room</th>
                        <th>Type</th>
                        <th>Capacity</th>
                        <th>Price per night</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleRows.map((room) => (
                        <tr key={room._id}>
                          <td><strong>{room.name}</strong></td>
                          <td>{room.type}</td>
                          <td>{room.capacity} guests</td>
                          <td>{money(room.price)}</td>
                          <td>
                            <div className="fs-row-actions">
                              <Link to={`/rooms/${room._id}/edit`}>Edit</Link>
                              <button
                                className="fs-delete"
                                onClick={() =>
                                  removeItem("rooms", room._id)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {tab === "users" && (
                  <>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleRows.map((user) => (
                        <tr key={user._id}>
                          <td><strong>{user.name}</strong></td>
                          <td>{user.email}</td>
                          <td>
                            <span className="fs-badge neutral">
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <div className="fs-row-actions">
                              <Link to={`/user/${user._id}/edit`}>Edit</Link>
                              <button
                                className="fs-delete"
                                disabled={user._id === currentUser._id}
                                onClick={() =>
                                  removeItem("users", user._id)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}