import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/index.css";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default function MovieList({ url }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleClick(m) {
    navigate(`/movie-detail/${encodeURIComponent(m.id)}`);
  }

  useEffect(() => {
    async function fetchMovie() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();

        if (!data.results || data.results.length === 0) {
          setError("No movies found.");
          setMovie(null);
        } else {
          setMovie(data.results);
        }
      } catch (err) {
        setError("Failed to fetch data.");
        setMovie(null);
      }

      setLoading(false);
    }

    fetchMovie();
  }, []);

  return (
    <div className="movie-scroll-container">
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {movie &&
        movie.map((m) => (
          <div
            key={m.id}
            style={{
              width: "150px",
              textAlign: "center",
              margin: "0 10px",
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
              alt={m.title}
              style={{
                width: "150px",
                height: "225px",
                objectFit: "cover",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "transform 0.3s ease-in-out",
              }}
              onClick={() => handleClick(m)}
              onError={(e) => {
                e.target.src =
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoWcWg0E8pSjBNi0TtiZsqu8uD2PAr_K11DA&s";
              }}
            />
            <h5 style={{ fontSize: "14px", marginTop: "0.5rem" }}>{m.title}</h5>
          </div>
        ))}
    </div>
  );
}
