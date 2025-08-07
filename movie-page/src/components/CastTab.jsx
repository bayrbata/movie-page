import { useState, useEffect } from "react";
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default function CastTab({ id }) {
  const [cast, setCast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCast() {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              Accept: "application/json",
            },
          }
        );
        const data = await res.json();
        if (!data || Object.keys(data).length === 0) {
          setError("No cast found");
          setCast(null);
        } else {
          setCast(data.cast);
        }
      } catch (err) {
        setError("Failed to fetch data.");
        setCast(null);
      }
      setLoading(false);
    }
    fetchCast();
  }, [id]);

  return (
    <div
      style={{
        width: "100%",
        height: "750px",
        overflowX: "auto",
        overflowY: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: "18px",
        }}
      >
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {cast &&
          cast.map((c, index) => (
            <div
              key={index}
              style={{
                width: "200px",
                height: "350px",
                overflow: "hidden",
                borderRadius: "8px",
                flexShrink: 0,
                textAlign: "center",
              }}
            >
              <img
                src={
                  c.profile_path
                    ? `https://image.tmdb.org/t/p/w500${c.profile_path}`
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoWcWg0E8pSjBNi0TtiZsqu8uD2PAr_K11DA&s"
                }
                alt={c.name}
                style={{
                  width: "150px",
                  height: "225px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "transform 0.3s ease-in-out",
                }}
              />
              <h5 style={{ fontSize: "14px", marginTop: "-0px" }}>{c.name}</h5>
              <p style={{ fontSize: "12px", margin: "-20px" }}>{c.character}</p>
              <p style={{ fontSize: "12px", color: "gray", margin: "20px" }}>
                {c.known_for_department}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
