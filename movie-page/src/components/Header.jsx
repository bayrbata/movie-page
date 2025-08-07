import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { FcGoogle } from "react-icons/fc";
import { RiFacebookCircleFill } from "react-icons/ri";
import { toast } from "react-toastify";

export default function Header() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.href,
      },
    });

    if (error) {
      alert("Login failed");
    }

    toast.success("Success login");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Success logout!");
    navigate(`/`);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log("Searching for:", search);
      navigate(`/movies/${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: "black",
      }}
    >
      <nav>
        <Link
          to="/"
          style={{
            marginRight: "1rem",
            color: "white",
            textDecoration: "none",
          }}
        >
          Home
        </Link>

        {user ? (
          <Link
            to="/watchlist"
            style={{
              marginRight: "1rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            Watchlist
          </Link>
        ) : null}
      </nav>

      <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
        style={{
          padding: "6px 10px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      {user ? (
        <div>
          <span style={{ marginRight: "1rem" }}>{user.user_metadata.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          Login
          <button onClick={() => handleLogin("google")}>
            <FcGoogle />
          </button>
          /
          <button onClick={() => handleLogin("facebook")}>
            <RiFacebookCircleFill />
          </button>
        </div>
      )}
    </header>
  );
}
