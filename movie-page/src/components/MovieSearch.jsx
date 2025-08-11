import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSearchStore from "../store/useSearchStore";
import "../styles/movieSearch.css";

export default function MovieSearch({ query }) {
  const { resultsCache, loading, error, searchMovies } = useSearchStore();
  const navigate = useNavigate();

  function handleClick(m) {
    navigate(`/movie-detail/${encodeURIComponent(m.id)}`);
  }

  useEffect(() => {
    searchMovies(query);
  }, [query, searchMovies]);

  const movies = resultsCache[query] || [];

  return (
    <div className="movieSearchWrapper">
      {loading && <p>Loading...</p>}
      {error && <p className="errorText">{error}</p>}
      {movies &&
        movies.map((m) => (
          <div key={m.id} className="movieCard">
            {m.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                alt={m.title}
                className="movieImage"
                onClick={() => handleClick(m)}
                onError={(e) => {
                  e.target.src =
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoWcWg0E8pSjBNi0TtiZsqu8uD2PAr_K11DA&s";
                }}
              />
            )}
            <h5 className="movieTitle">{m.title}</h5>
          </div>
        ))}
    </div>
  );
}
