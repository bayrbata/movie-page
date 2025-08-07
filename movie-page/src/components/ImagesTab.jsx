import { useState, useEffect } from "react";
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default function ImagesTab({ id }) {
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/images`,
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
          setError("No images found");
          setImages(null);
        } else {
          setImages(data);
        }
      } catch (err) {
        setError("Failed to fetch data.");
        setImages(null);
      }
      setLoading(false);
    }
    fetchImages();
  }, [id]);

  return (
    <div
      style={{
        width: "100%",
        height: "635px",
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          height: "100%",
          maxHeight: "100%",
          gap: "18px",
          padding: "10px",
          flexDirection: "column",
          columnGap: "20px",
          minWidth: "max-content",
        }}
      >
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {images &&
          images.backdrops.map((image, index) => (
            <div
              key={index}
              style={{
                width: "240px",
                height: "135px",
                overflow: "hidden",
                borderRadius: "8px",
                flexShrink: 0,
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease-in-out",
                }}
                onError={(e) => {
                  e.target.src =
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoWcWg0E8pSjBNi0TtiZsqu8uD2PAr_K11DA&s";
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
