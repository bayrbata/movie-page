import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

import "../styles/movieDetail.css";

import RateMovie from "../components/RateMovie";
import CastTab from "../components/CastTab";
import ImagesTab from "../components/ImagesTab";
import ReviewsTab from "../components/ReviewsTab";
import SideDetail from "../components/SideDetail";

import useMovieStore from "../store/useMovieStore";
import useTrailerStore from "../store/useTrailerStore";
import useRatingStore from "../store/useRatingStore";
import useAuthStore from "../store/useAuthStore";
import useWatchlistStore from "../store/useWatchlistStore";

export default function MovieDetail() {
  const scrollRef = useRef(null);
  const { id } = useParams();
  const [openRateModal, setOpenRateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("images");
  const { movie, fetchMovie } = useMovieStore();
  const { trailer, fetchTrailer } = useTrailerStore();
  const { rating, fetchRating } = useRatingStore();
  const user = useAuthStore((state) => state.user);
  const authListener = useAuthStore((state) => state.authListener);
  const { addedToWatchlist, toggleWatchlist, checkAddedWatchlist } = useWatchlistStore();

  const scrollLeft = () => {
    scrollRef.current.scrollLeft -= 800;
  };

  const scrollRight = () => {
    scrollRef.current.scrollLeft += 800;
  };

  useEffect(() => {
    const cleanUp = authListener();
    return cleanUp;
  }, [authListener]);

  useEffect(() => {
    fetchMovie(id);
    fetchTrailer(id);
  }, [id, fetchMovie, fetchTrailer]);

  useEffect(() => {
    if (!user) return;
    fetchRating(user.id, id);
  }, [id, openRateModal, user, fetchRating]);

  useEffect(() => {
    if (movie?.id) {
      checkAddedWatchlist(user?.id, id);
    }
  }, [movie, user, checkAddedWatchlist, id]);

  return (
    <div className="detail-container">
      {movie && (
        <div>
          <div>
            <button onClick={scrollLeft} className="trailer-btn-left">
              <IoArrowBack />
            </button>
            <div ref={scrollRef} className="trailer-scroll-container">
              {trailer.length > 0 ? (
                trailer.map((key) => (
                  <iframe
                    key={key}
                    width="100%"
                    height="580px"
                    src={`https://www.youtube.com/embed/${key}`}
                    title={`${movie.title} trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ))
              ) : (
                <div
                  className="trailer-placeholder"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                  }}
                ></div>
              )}
            </div>
            <button onClick={scrollRight} className="trailer-btn-right">
              <IoArrowForward />
            </button>
          </div>

          <div className="movie-info">
            <h1 className="movie-title">
              {movie.title} ({new Date(movie.release_date).getFullYear()})
            </h1>
            <h4 className="movie-genres">
              {movie.genres.map((g) => g.name).join(" | ")}
            </h4>
            <h4 className="movie-rating">
              <span className="star">⭐</span> {movie.vote_average}
            </h4>
            <h4 className="movie-runtime">{movie.runtime} Minutes</h4>
          </div>

          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div className="overview-section">
              <h3>Overview</h3>
              <p className="overview-text">{movie.overview}</p>

              {user && (
                <div className="button-group">
                  <button
                    onClick={() => toggleWatchlist(user?.id, movie.id)}
                    className="rate-button"
                  >
                    {addedToWatchlist
                      ? "✔ Added to Wishlist"
                      : "Add to Wishlist"}
                  </button>
                  <button
                    onClick={() => setOpenRateModal(true)}
                    className="rate-button"
                  >
                    <span>Rate Movie</span>
                    <span className="divider">|</span>
                    <span className="starNumber">⭐ {rating} / 10</span>
                  </button>
                  <RateMovie
                    open={openRateModal}
                    onClose={() => setOpenRateModal(false)}
                    movieId={id}
                  />
                </div>
              )}
            </div>
            <SideDetail id={id} />
          </div>

          <nav style={{ marginTop: "1rem", marginBottom: "1.5rem" }}>
            <button
              onClick={() => setActiveTab("images")}
              className={`tab-button ${activeTab === "images" ? "active" : ""}`}
            >
              <h3>Images</h3>
            </button>
            <button
              onClick={() => setActiveTab("cast")}
              className={`tab-button ${activeTab === "cast" ? "active" : ""}`}
            >
              <h3>Cast</h3>
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`tab-button ${
                activeTab === "reviews" ? "active" : ""
              }`}
            >
              <h3>Reviews</h3>
            </button>
          </nav>

          {activeTab === "images" && <ImagesTab id={id} />}
          {activeTab === "cast" && <CastTab id={id} />}
          {activeTab === "reviews" && <ReviewsTab id={id} />}
        </div>
      )}
    </div>
  );
}
