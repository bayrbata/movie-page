import { useEffect, useMemo } from "react";
import { useUrlMovieStore } from "../store/useUrlMovieStore";
import useAllTrailerStore from "../store/useAllTrailerStore";

export default function TrailerList({ url }) {
  const { movies, loading, error, fetchMovies } = useUrlMovieStore();
  const {
    trailersMap,
    loading: trailersLoading,
    error: trailersError,
    fetchTrailersForMovies,
  } = useAllTrailerStore();

  useEffect(() => {
    if (url) fetchMovies(url);
  }, [url, fetchMovies]);

  const movieList = useMemo(() => movies[url] || [], [movies, url]);

  useEffect(() => {
    if (movieList.length > 0) fetchTrailersForMovies(movieList);
  }, [movieList, fetchTrailersForMovies]);

  if (loading || trailersLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (trailersError) return <p style={{ color: "red" }}>{trailersError}</p>;

  return (
    <div className="movie-scroll-container">
      {movieList.map((movie) => {
        const trailer = trailersMap[movie.id];

        return (
          <div key={movie.id} style={{ marginBottom: "2rem" }}>
            {trailer ? (
              <>
                <iframe
                  width="300"
                  height="170"
                  src={`https://www.youtube.com/embed/${trailer.trailerKey}`}
                  title={`${trailer.title} trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <h3>{trailer.title}</h3>
              </>
            ) : (
              <p>No trailer available for {movie.title}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
