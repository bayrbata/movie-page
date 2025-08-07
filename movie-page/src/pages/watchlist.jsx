import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default function watchList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleClick(m) {
    navigate(`/movie-detail/${encodeURIComponent(m.id)}`);
  }

  useEffect(() => {
    async function fetchWatchlist() {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError("Login required.");
          return;
        }

        const { data: watchlist, error: watchlistError } = await supabase
          .from("watchlist")
          .select("*")
          .eq("user_id", user.id);

        if (watchlistError) {
          setError("Error fetching watchlist.");
          return;
        }

        if (!watchlist || watchlist.length === 0) {
          setError("No movies in watchlist.");
          return;
        }

        const fetchedMovies = await Promise.all(
          watchlist.map(async (item) => {
            const res = await fetch(
              `https://api.themoviedb.org/3/movie/${item.movie_id}`,
              {
                headers: {
                  Authorization: `Bearer ${API_TOKEN}`,
                  Accept: "application/json",
                },
              }
            );
            return res.json();
          })
        );

        setMovies(fetchedMovies);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Something went wrong.");
      }

      setLoading(false);
    }

    fetchWatchlist();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              width: "150px",
              textAlign: "center",
              margin: "0 10px",
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              style={{
                width: "150px",
                height: "225px",
                objectFit: "cover",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "transform 0.3s ease-in-out",
              }}
              onClick={() => handleClick(movie)}
              onError={(e) => {
                e.target.src =
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoWcWg0E8pSjBNi0TtiZsqu8uD2PAr_K11DA&s";
              }}
            />
            <h5 style={{ fontSize: "14px", marginTop: "0.5rem" }}>
              {movie.title}
            </h5>
          </div>
        ))}
      </div>
    </div>
  );
}
