import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import Rating from "@mui/material/Rating";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#1e1e1e",
  color: "#fff",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  width: 300,
};

export default function RateModal({ open, onClose, movieId }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    async function fetchRating() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("ratings")
        .select("rating")
        .eq("user_id", user.id)
        .eq("movie_id", movieId)
        .maybeSingle();

      if (data) {
        setValue(data.rating);
      }
    }

    if (open) fetchRating();
  }, [movieId, open]);

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Login required");
      return;
    }

    const { error } = await supabase.from("ratings").upsert(
      {
        user_id: user.id,
        movie_id: movieId,
        rating: value,
      },
      { onConflict: ["movie_id", "user_id"] }
    );

    if (error) {
      toast.error("Failed to save rating");
    } else {
      toast.success("Rating saved");
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Rate this movie
        </Typography>
        <Rating
          value={value}
          onChange={(e, newValue) => setValue(newValue)}
          size="large"
          max={10}
        />
        <Box mt={2}>
          <Button onClick={handleSubmit} variant="contained" fullWidth>
            Submit Rating
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
