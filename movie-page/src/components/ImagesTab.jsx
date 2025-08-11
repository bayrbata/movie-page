import { useEffect } from "react";
import { useImagesStore } from "../store/useImagesStore";
import "../styles/imagesTab.css";

export default function ImagesTab({ id }) {
  const { images, loading, error, fetchImages } = useImagesStore();

  useEffect(() => {
    fetchImages(id);
  }, [id, fetchImages]);

  const currentImages = images[id];

  return (
    <div className="imagesTabWrapper">
      <div className="imagesContainer">
        {loading && <p>Loading...</p>}
        {error && <p className="errorText">{error}</p>}
        {currentImages &&
          currentImages.backdrops?.map((image, index) => (
            <div key={index} className="imageWrapper">
              <img
                src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                className="imageTag"
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
