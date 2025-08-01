import { useState } from "react";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchMovie() {
    if (!query) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            Accept: "application/json",
          },
        }
      );

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

  console.log(movie);

  return (
    <div className="movie-search">
      <input
        type="text"
        placeholder="Enter movie title"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchMovie()}
      />
      <button onClick={fetchMovie} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {movie &&
        movie.map((m) => (
          <div key={m.id}>
            <h3>{m.title}</h3>
            <img
              src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
              alt={m.title}
            />
          </div>
        ))}
    </div>
  );
}
