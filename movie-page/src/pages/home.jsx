import { useEffect, useState } from "react";
import MovieList from "../components/MovieList";
import Trailer from "../components/Trailer";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default function home() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      setError(null);
      setLoading(true);

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/1011477?language=en-US`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              Accept: "application/json",
            },
          }
        );

        const data = await res.json();

        if (!data || data.length === 0) {
          setError("No movie found");
          setMovie(null);
        } else {
          setMovie(data);
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
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {movie && (
        <div
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "580px",
            width: "100%",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.8,
            boxShadow: "0 8px 24px rgba(231, 85, 6, 0.3)",
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          <div className="bottom-left-text">
            <h1 style={{ fontSize: "50px" }}>{movie.title}</h1>
            <h4 style={{ opacity: 0.85 }}>
              {movie.genres.map((m) => m.name).join(" | ")}
            </h4>
            <a
              href="movie-detail/1011477"
              style={{ color: "white", textDecoration: "none" }}
            >
              View Trailer
            </a>
          </div>
        </div>
      )}

      <h1>Upcoming movies</h1>
      <MovieList url="https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1" />

      <h1>Top rated movies</h1>
      <MovieList url="https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1" />

      <h1>Trailers</h1>
      <Trailer url="https://api.themoviedb.org/3/movie/popular?language=en-US&page=1" />

      <h1>Popular movies</h1>
      <MovieList url="https://api.themoviedb.org/3/movie/popular?language=en-US&page=1" />

      <h1>Now playing movies</h1>
      <MovieList url="https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1" />
    </div>
  );
}
