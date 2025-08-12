import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetchWatchlistStore from "../store/useFetchWatchlistStore";
import "../styles/watchlist.css";

export default function WatchList() {
  const { movies, loading, error, fetchWatchlist } = useFetchWatchlistStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  function handleClick(m) {
    navigate(`/movie-detail/${encodeURIComponent(m.id)}`);
  }

  return (
    <div className="watchlist-container">
      {loading && <p className="watchlist-loading">Loading...</p>}
      {error && <p className="watchlist-error">{error}</p>}

      <div className="watchlist-grid">
        {movies.map((m) => (
          <div key={m.id} className="watchlist-item">
            {m.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                alt={m.title}
                className="watchlist-poster"
                onClick={() => handleClick(m)}
                onError={(e) => {
                  e.target.src =
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoWcWg0E8pSjBNi0TtiZsqu8uD2PAr_K11DA&s";
                }}
              />
            )}
            <h5 className="watchlist-title">{m.title}</h5>
          </div>
        ))}
      </div>
    </div>
  );
}
