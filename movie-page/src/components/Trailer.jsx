import { useState, useEffect } from "react";
import "../styles/index.css";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default function TrailerList({ url }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrailer() {
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
          let trailers = [];

          for (let i = 0; i < data.results.length; i++) {
            const movieId = data.results[i].id;

            try {
              let vid = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}/videos`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                    Accept: "application/json",
                  },
                }
              );

              const videoData = await vid.json();
              const trailer = videoData.results.find(
                (v) => v.type === "Trailer" && v.site === "YouTube"
              );

              trailers.push({
                trailerKey: trailer ? trailer.key : null,
              });
            } catch (error) {
              console.error(
                "Failed to fetch trailer for movie ID:",
                movieId,
                error
              );
            }
          }
          setMovie(trailers);
        }
      } catch (err) {
        setError("Failed to fetch data.");
        setMovie(null);
      }

      setLoading(false);
    }

    fetchTrailer();
  }, []);

  return (
    <div className="movie-scroll-container">
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {movie &&
        movie.map((m) => (
          <div key={m.trailerKey} style={{ marginBottom: "2rem" }}>
            {m.trailerKey ? (
              <div style={{ marginTop: "1rem" }}>
                <iframe
                  width="300"
                  height="170"
                  src={`https://www.youtube.com/embed/${m.trailerKey}`}
                  title={`${m.title} trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <p>No trailer available.</p>
            )}
            <h3>{m.title}</h3>
          </div>
        ))}
    </div>
  );
}
