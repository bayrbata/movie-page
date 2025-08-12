import { useEffect } from "react";
import useCreditStore from "../store/useCreditStore";
import "../styles/castTab.css";

export default function CastTab({ id }) {
  const { credit, fetchCredit } = useCreditStore();

  useEffect(() => {
    fetchCredit(id);
  }, [id, fetchCredit]);

  return (
    <div className="cast-tab-container">
      <div className="cast-grid">
        {credit &&
          credit.cast.map((c, index) => (
            <div key={index} className="cast-card">
              <img
                src={
                  c.profile_path
                    ? `https://image.tmdb.org/t/p/w500${c.profile_path}`
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoWcWg0E8pSjBNi0TtiZsqu8uD2PAr_K11DA&s"
                }
                alt={c.name}
                className="cast-image"
              />
              <h5 className="cast-name">{c.name}</h5>
              <p className="cast-character">{c.character}</p>
              <p className="cast-department">{c.known_for_department}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
