import { useEffect } from "react";
import useMovieStore from "../store/useMovieStore";
import MovieList from "../components/MovieList";
import Trailer from "../components/Trailer";
import "../styles/index.css";

export default function Home() {
  const { movie, fetchMovie } = useMovieStore();

  useEffect(() => {
    fetchMovie("278");
  }, [fetchMovie]);

  return (
    <div className="home">
      {movie && (
        <div
          className="hero"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        >
          <div className="overlay"></div>
          <div className="hero-content">
            <h1>{movie.title}</h1>
            <p>{movie.overview}</p>
            <a className="details-btn" href="movie-detail/278">
              ▶ More Details
            </a>
          </div>
        </div>
      )}

      <MovieList url="https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1" />
      <MovieList
        title="Top Rated"
        url="https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1"
      />
      <Trailer
        title="Top Rated"
        url="https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"
      />
      <MovieList
        title="Popular"
        url="https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"
      />
      <MovieList
        title="Now Playing"
        url="https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1"
      />
    </div>
  );
}
