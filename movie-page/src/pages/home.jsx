import { useState } from "react";
import MovieSearch from "../components/MovieSearch";

export default function home() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Movie Search</h1>
      <MovieSearch />
    </div>  
  );
}