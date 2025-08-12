import MovieSearch from "../components/MovieSearch";
import { useParams } from "react-router-dom";

export default function Movies() {
  const { query } = useParams();

  return (
    <div style={{ marginTop: "5rem" }}>
      <h1>Movie Search</h1>
      <MovieSearch query={query} />
    </div>
  );
}
