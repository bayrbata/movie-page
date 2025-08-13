import MovieSearch from "../components/MovieSearch";
import { useParams } from "react-router-dom";

export default function Movies() {
  const { query } = useParams();

  return (
    <div style={{ marginTop: "5rem" }}>
      <h1 style={{paddingLeft:"1rem", textTransform: "uppercase"}}>Movie Search : {query}</h1>
      <MovieSearch query={query} />
    </div>
  );
}
