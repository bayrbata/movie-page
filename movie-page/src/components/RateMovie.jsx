import { useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import Rating from "@mui/material/Rating";
import { toast } from "react-toastify";
import useRatingStore from "../store/useRatingStore";
import useAuthStore from "../store/useAuthStore";
import "../styles/rateModal.css";

export default function RateModal({ open, onClose, movieId }) {
  const user = useAuthStore((state) => state.user);
  const { rating, fetchRating, saveRating, clearRating, loading, error } = useRatingStore();

  useEffect(() => {
    if (open && user) {
      fetchRating(user.id, movieId);
    }
    if (!open) {
      clearRating();
    }
  }, [open, user, movieId, fetchRating, clearRating]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Login required");
      return;
    }

    await saveRating(user.id, movieId, rating);

    if (error) {
      toast.error("Failed to save rating");
    } else {
      toast.success("Rating saved");
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="rateModalBox">
        <Typography variant="h6" gutterBottom>
          Rate this movie
        </Typography>
        <Rating
          value={rating}
          onChange={(e, newValue) =>
            newValue !== null && saveRating(user?.id, movieId, newValue)
          }
          size="large"
          max={10}
        />
        <Button
          onClick={handleSubmit}
          variant="contained"
          className="submitButton"
          disabled={loading}
        >
          Submit Rating
        </Button>
      </Box>
    </Modal>
  );
}
