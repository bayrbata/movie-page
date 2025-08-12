import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { RiFacebookCircleFill } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { CiLogin, CiLogout } from "react-icons/ci";
import { useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import "../styles/header.css";

export default function Header() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user, authListener, login, logout } = useAuthStore();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location.pathname === "/";

  useEffect(() => {
    const cleanUp = authListener();
    return cleanUp;
  }, [authListener]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/movies/${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header
      className={`navbar ${isHome ? "transparent" : "solid"} ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <div className="left-section">
        <nav className="nav-links">
          <Link to="/">Home</Link>
          {user && <Link to="/watchlist">Watchlist</Link>}
        </nav>
      </div>

      <div className="search-container">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="auth-section">
        {user ? (
          <>
            {user?.user_metadata?.picture ? (
              <img
                className="profile"
                src={user?.user_metadata?.picture}
                alt="profile_picture"
              />
            ) : (
              <img
                className="profile"
                src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3485.jpg?w=360"
                alt="profile_picture"
              />
            )}
            <span>{user.user_metadata.name}</span>
            <button
              className="logout-btn"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <CiLogout size={28} />
            </button>
          </>
        ) : (
          <div className="login">
            <CiLogin size={28} />
            <div className="social-buttons">
              <button className="google" onClick={() => login("google")}>
                <FcGoogle size={28} />
              </button>
              <button className="facebook" onClick={() => login("facebook")}>
                <RiFacebookCircleFill size={28} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
