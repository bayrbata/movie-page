import MovieSearch from "../components/MovieSearch";
import { useParams } from "react-router-dom";

export default function movies() {
  const { query } = useParams();

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Movie Search</h1>
      <MovieSearch query={query} />
    </div>
  );
}
