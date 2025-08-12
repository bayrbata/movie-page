import { useEffect } from "react";
import useCreditStore from "../store/useCreditStore";
import useMovieStore from "../store/useMovieStore";
import "../styles/movieDetail.css";

export default function SideDetail({ id }) {
  const { movie, fetchMovie } = useMovieStore();
  const { director, cast, loading, error, fetchCredit } = useCreditStore();

  useEffect(() => {
    fetchMovie(id);
    fetchCredit(id);
  }, [id, fetchMovie, fetchCredit]);

  return (
    <div className="sideDetailWrapper">
      {loading && <p>Loading...</p>}
      {error && <p className="errorText">{error}</p>}

      <div className="labelText">Director</div>
      <div>{director?.name || "Not available"}</div>

      <div className="labelText">Production</div>
      <div>
        {movie?.production_companies?.map((m) => m.name).join(", ") ||
          "Not available"}
      </div>

      <div className="labelText">Starring</div>
      <div>{cast?.map((c) => c.name).join(", ") || "Not available"}</div>

      <div className="labelText">Genres</div>
      <div>
        {movie?.genres?.map((g) => g.name).join(" | ") || "Not available"}
      </div>

      <div className="labelText">Language</div>
      <div>{movie?.original_language || "Not available"}</div>

      <div className="labelText">Budget</div>
      <div>
        {movie?.budget ? `$${movie.budget.toLocaleString()}` : "Not available"}
      </div>
    </div>
  );
}
