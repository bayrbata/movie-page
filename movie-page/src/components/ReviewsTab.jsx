import { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import useReviewsStore from "../store/useReviewsStore";
import useAuthStore from "../store/useAuthStore";
import { toast } from "react-toastify";
import "../styles/reviewsTab.css";

export default function ReviewsTab({ id }) {
  const { reviews, loading, error, fetchReviews, subscribeToReviews, saveReview } = useReviewsStore();
  const user = useAuthStore((state) => state.user);
  const [review, setReview] = useState("");
  const [headline, setHeadline] = useState("");
  const [ratingValue, setRatingValue] = useState(0);

  useEffect(() => {
    fetchReviews(id);
    const unsubscribe = subscribeToReviews(id);
    return () => unsubscribe();
  }, [id, fetchReviews, subscribeToReviews]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0];
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    await saveReview(user.id, user.user_metadata.name, headline, review, id, ratingValue);

    if (error) {
      toast.error("Failed to save rating");
    } else {
      setHeadline("");
      setReview("");
      setRatingValue(0);
    }
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
            <p className="reviewUserName">by {r.user_name}</p>
            <p className="reviewDateRating">
              {formatDate(r.created_at)} • ⭐ {r.rating}/5
            </p>
            <h4 className="reviewHeadline">{r.headline}</h4>
            <p className="reviewParagraph">{r.review}</p>
          </div>
        ))}
      </div>
      <div className="reviewForm">
        <h3>Your Review</h3>

        <Rating
          className="rateStar"
          size="large"
          max={5}
          value={ratingValue}
          onChange={(e, newValue) => setRatingValue(newValue)}
        />

        <input
          className="headline"
          type="text"
          placeholder="Review headline"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
        />
        <textarea
          className="review"
          placeholder="Your review here"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>

        <button className="reviewFormButton" onClick={handleSubmit} disabled={loading}>
          Submit
        </button>
      </div>
    </div>
  );
}
