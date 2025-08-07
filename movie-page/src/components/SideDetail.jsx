import { useState, useEffect } from "react";
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default function SideDetail({ id }) {
  const [director, setDirector] = useState(null);
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCast() {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              Accept: "application/json",
            },
          }
        );
        const data = await res.json();
        if (!data || Object.keys(data).length === 0) {
          setError("No credit found");
          setCast([]);
        } else {
          const director = data.crew.find((d) => d.job === "Director");
          setDirector(director);
          const top3Cast = data.cast
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 3);
          setCast(top3Cast);
        }
      } catch (err) {
        setError("Failed to fetch data.");
        setCast([]);
      }
      setLoading(false);
    }

    async function fetchMovie() {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              Accept: "application/json",
            },
          }
        );
        const data = await res.json();
        if (!data || Object.keys(data).length === 0) {
          setError("No movie data found");
          setMovie(null);
        } else {
          setMovie(data);
        }
      } catch (err) {
        setError("Failed to fetch movie.");
        setMovie(null);
      }
      setLoading(false);
    }

    fetchCast();
    fetchMovie();
  }, [id]);

  return (
    <div
      style={{
        flex: 1,
        padding: "1rem",
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        rowGap: "0.75rem",
        fontSize: "0.95rem",
        color: "#d1d5db",
      }}
    >
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ fontWeight: 600 }}>Director</div>
      <div>{director?.name || "Not available"}</div>

      <div style={{ fontWeight: 600 }}>Production</div>
      <div>
        {movie?.production_companies?.map((m) => m.name).join(", ") ||
          "Not available"}
      </div>

      <div style={{ fontWeight: 600 }}>Starring</div>
      <div>{cast?.map((c) => c.name).join(", ") || "Not available"}</div>

      <div style={{ fontWeight: 600 }}>Genres</div>
      <div>
        {movie?.genres?.map((g) => g.name).join(" | ") || "Not available"}
      </div>

      <div style={{ fontWeight: 600 }}>Language</div>
      <div>
        {movie?.original_language ? movie.original_language : "Not available"}
      </div>

      <div style={{ fontWeight: 600 }}>Budget</div>
      <div>
        {movie?.budget ? `$${movie.budget.toLocaleString()}` : "Not available"}
      </div>
    </div>
  );
}
