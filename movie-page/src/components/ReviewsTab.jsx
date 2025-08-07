import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ReviewsTab({ id }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("movie_id", id);
      if (data) setReviews(data);
    };

    fetchReviews();
  }, [id]);

  useEffect(() => {
    const channel = supabase
      .channel("reviews-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reviews",
          filter: `movie_id=eq.${id}`,
        },
        (payload) => {
          console.log("New review:", payload.new);
          setReviews((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0];
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <div style={{ borderRight: "2px solid gray", flex: 1 }}>
        <h3>User Reviews</h3>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((r, i) => (
          <div
            key={i}
            style={{
              borderRadius: "8px",
              backgroundColor: "black",
            }}
          >
            <p style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              {r.user_name}
            </p>
            <p style={{ marginTop: "0.25rem", color: "#666" }}>
              {formatDate(r.created_at)} • ⭐ {r.rating}/5
            </p>
            <h4 style={{ marginTop: "0.5rem" }}>{r.headline}</h4>
            <p>{r.review}</p>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: "1rem" }}>review form</div>
    </div>
  );
}
