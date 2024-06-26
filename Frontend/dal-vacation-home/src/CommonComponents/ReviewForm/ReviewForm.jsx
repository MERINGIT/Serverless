import React, { useState } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ initialReview = '', initialStars = 0, onClose }) => {
  const [review, setReview] = useState(initialReview);
  const [stars, setStars] = useState(initialStars);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (review.trim().length < 10) {
      newErrors.review = 'Review must be at least 10 characters long';
    }
    if (stars < 1 || stars > 5) {
      newErrors.stars = 'Stars rating must be between 1 and 5';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Call onClose with the review and stars data
    onClose({ review, stars });
  };

  return (
    <div className="review-form">
      <h2>How was your stay?</h2>
      {errors.review && <p className="error">{errors.review}</p>}
      {errors.stars && <p className="error">{errors.stars}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <div className="star-rating">
          <label>Stars</label>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= stars ? 'star filled' : 'star'}
              onClick={() => setStars(star)}
            >
              ★
            </span>
          ))}
        </div>
        <button type="submit" disabled={review.trim().length < 10 || stars < 1}>
          {initialReview ? 'Update Your Review' : 'Submit Your Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
