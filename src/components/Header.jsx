import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

export default function Header() {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["currentuser"]);
  const user = cookies.currentuser;

  function logout() {
    removeCookie("currentuser", { path: "/" });
    toast.success("Signed out successfully");
    navigate("/");
  }

  return (
    <header className="fs-header">
      <div className="fs-nav">
        <Link className="fs-logo" to="/">
          <span className="fs-logo-icon">F</span>
          <span>
            FORWARD<span className="fs-logo-accent">STAY</span>
            <small>YOUR PLACE TO UNWIND</small>
          </span>
        </Link>

        <nav className="fs-links" aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/rooms">Rooms</NavLink>
          <NavLink to="/facilities">Facilities</NavLink>
          {user && <NavLink to="/my-bookings">My bookings</NavLink>}
          {user?.role === "admin" && (
            <NavLink to="/dashboard">Dashboard</NavLink>
          )}
        </nav>

        <div className="fs-nav-actions">
          {user ? (
            <>
              <span className="fs-greeting">
                Hi, {user.name?.split(" ")[0]}
              </span>
              <button className="fs-button fs-button-outline" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link className="fs-signin" to="/login">Sign in</Link>
              <Link className="fs-button fs-button-gold" to="/signup">
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}