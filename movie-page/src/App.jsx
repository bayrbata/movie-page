import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Movies from "./pages/movies";
import MovieDetail from "./pages/movieDetail";
import Watchlist from "./pages/watchlist";
import Layout from "./Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/movies/:query" element={<Movies />} />
          <Route path="/movie-detail/:id" element={<MovieDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
