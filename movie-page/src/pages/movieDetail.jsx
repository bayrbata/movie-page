import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useParams } from "react-router-dom";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import "../styles/index.css";
import RateMovie from "../components/RateMovie";
import CastTab from "../components/CastTab";
import ImagesTab from "../components/ImagesTab";
import ReviewsTab from "../components/ReviewsTab";
import SideDetail from "../components/SideDetail";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const tabBtn = {
  marginRight: "1rem",
  background: "transparent",
  border: "none",
  padding: "0rem 4rem",
  color: "#fff",
  cursor: "pointer",
};

export default function MovieDetail() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const [movie, setMovie] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [addedToWatchlist, setAddedToWatchlist] = useState(false);
  const [openRateModal, setOpenRateModal] = useState(false);
  const [value, setValue] = useState(0);
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("images");

  const scrollLeft = () => {
    scrollRef.current.scrollLeft -= 800;
  };

  const scrollRight = () => {
    scrollRef.current.scrollLeft += 800;
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    async function fetchRating() {
      if (!user) return;
      console.log(user);

      const { data } = await supabase
        .from("ratings")
        .select("*")
        .eq("user_id", user.id)
        .eq("movie_id", id)
        .maybeSingle();

      if (data) {
        setValue(data.rating);
      }
    }

    fetchRating();
  }, [id, openRateModal, user]);

  async function addToWatchlist(movieId) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Please log in first");
      return;
    }

    try {
      if (!addedToWatchlist) {
        const { error } = await supabase
          .from("watchlist")
          .insert([{ user_id: user.id, movie_id: movieId }]);

        if (error) throw error;

        setAddedToWatchlist(true);
      } else {
        const { error } = await supabase
          .from("watchlist")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movieId);

        if (error) throw error;

        setAddedToWatchlist(false);
      }
    } catch (err) {
      console.error("Watchlist update error:", err);
      alert("Something went wrong");
    }
  }
  useEffect(() => {
    async function fetchMovie() {
      setError(null);
      setLoading(true);

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              Accept: "application/json",
            },
          }
        );

        const data = await res.json();

        if (!data || Object.keys(data).length === 0) {
          setError("No movie found");
          setMovie(null);
        } else {
          setMovie(data);

          try {
            const vidRes = await fetch(
              `https://api.themoviedb.org/3/movie/${id}/videos`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${API_TOKEN}`,
                  Accept: "application/json",
                },
              }
            );

            const videoData = await vidRes.json();
            const filtered = videoData.results.filter(
              (v) => v.type === "Trailer" && v.site === "YouTube"
            );

            const trailerKeys = filtered.map((v) => v.key);
            setTrailers(trailerKeys);
          } catch (err) {
            console.error("Failed to fetch trailer:", id, err);
          }
        }
      } catch (err) {
        setError("Failed to fetch data.");
        setMovie(null);
      }

      setLoading(false);
    }

    fetchMovie();
  }, [id]);

  async function checkAddedWashList(movieId) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Login is required");
    } else {
      const { data, error } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", user.id)
        .eq("movie_id", movieId);

      if (error) {
        console.error("Query error:", error);
      } else if (data.length > 0) {
        console.log("Movie already in watchlist");
        setAddedToWatchlist(true);
      }
    }
  }

  useEffect(() => {
    if (movie && movie.id) {
      checkAddedWashList(movie.id);
    }
  }, [movie]);

  return (
    <div style={{ padding: "1rem" }}>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {movie && (
        <div>
          <div>
            <button
              onClick={scrollLeft}
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            >
              <IoArrowBack />
            </button>
            <div ref={scrollRef} className="trailer-scroll-container">
              {trailers.length > 0 ? (
                trailers.map((key) => (
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
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "580px",
                    width: "100%",
                    borderRadius: "8px",
                    opacity: 0.8,
                  }}
                ></div>
              )}
            </div>
            <button
              onClick={scrollRight}
              style={{
                position: "absolute",
                top: "50%",
                right: 0,
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            >
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
            <div
              style={{
                borderRight: "2px solid gray",
                flex: 1,
              }}
            >
              <h3> Overview </h3>
              <p style={{ color: "#d0ceceff" }}>{movie.overview}</p>

              {user ? (
                <div className="button-group">
                  <button
                    onClick={() => addToWatchlist(movie.id)}
                    className="wishlist-button"
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
                    <span className="starNumber">⭐ {value} / 10</span>
                  </button>

                  <RateMovie
                    open={openRateModal}
                    onClose={() => setOpenRateModal(false)}
                    movieId={id}
                  />
                </div>
              ) : null}
            </div>
            <SideDetail id={id} />
          </div>
          <nav style={{ marginTop: "1rem", marginBottom: "1.5rem" }}>
            <button
              onClick={() => setActiveTab("images")}
              style={{
                ...tabBtn,
                borderBottom:
                  activeTab === "images" ? "2px solid gold" : "none",
              }}
            >
              <h3>Images</h3>
            </button>
            <button
              onClick={() => setActiveTab("cast")}
              style={{
                ...tabBtn,
                borderBottom: activeTab === "cast" ? "2px solid gold" : "none",
              }}
            >
              <h3>Cast</h3>
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              style={{
                ...tabBtn,
                borderBottom:
                  activeTab === "reviews" ? "2px solid gold" : "none",
              }}
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
