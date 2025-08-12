import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUrlMovieStore } from "../store/useUrlMovieStore";
import "../styles/slider.css";

export default function MovieList({ url, title }) {
  const { movies, loading, error, fetchMovies } = useUrlMovieStore();
  const navigate = useNavigate();

  function handleClick(m) {
    navigate(`/movie-detail/${encodeURIComponent(m.id)}`);
  }

  useEffect(() => {
    fetchMovies(url);
  }, [url, fetchMovies]);

  const movieList = movies[url] || [];

  return (
    <div className="movie-slider">
      {title && <h2>{title}</h2>}
      <div className="movie-scroll-container">
        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        {movieList &&
          movieList.map((m) => (
            <div key={m.id} className="movie-card" onClick={() => handleClick(m)}>
              <img
                src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                alt={m.title}
                onError={(e) => {
                  e.target.src =
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoWcWg0E8pSjBNi0TtiZsqu8uD2PAr_K11DA&s";
                }}
              />
              <h5>{m.title}</h5>
            </div>
          ))}
      </div>
    </div>
  );
}
