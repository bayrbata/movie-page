import { useEffect } from "react";
import useReviewsStore from "../store/useReviewsStore";
import "../styles/reviewsTab.css";

export default function ReviewsTab({ id }) {
  const { reviews, loading, error, fetchReviews, subscribeToReviews } = useReviewsStore();

  useEffect(() => {
    fetchReviews(id);
    const unsubscribe = subscribeToReviews(id);
    return () => {
      unsubscribe();
    };
  }, [id, fetchReviews, subscribeToReviews]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="reviewsTabWrapper">
      <div className="reviewsList">
        <h3>User Reviews</h3>
        {loading && <p>Loading reviews...</p>}
        {error && <p className="errorText">{error}</p>}
        {reviews.length === 0 && !loading && <p>No reviews yet.</p>}
        {reviews.map((r, i) => (
          <div key={i} className="reviewCard">
            <p className="reviewUserName">{r.user_name}</p>
            <p className="reviewDateRating">
              {formatDate(r.created_at)} • ⭐ {r.rating}/5
            </p>
            <h4 className="reviewHeadline">{r.headline}</h4>
            <p>{r.review}</p>
          </div>
        ))}
      </div>
      <div className="reviewForm">review form</div>
    </div>
  );
}
