import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import ReviewForm from '../ReviewForm/ReviewForm';
import Modal from '../Modal/Modal';
import "./RoomDetail.css";

const RoomDetail = () => {
  const { roomId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    const fetchRoomDetails = async (roomId) => {
      setLoading(true);
      const roomData = {
        id: 1,
        name: 'Luxury Suite',
        city: 'Halifax',
        state: 'Nova Scotia',
        country: 'Canada',
        price: 350,
        avgRating: 4.8,
        description: 'A luxurious suite with stunning views. Enjoy the best of Halifax from this elegantly furnished space, complete with cozy beds, air conditioning, and other modern amenities. Perfect for a comfortable and memorable stay.',
        roomImages: [
          { id: 1, url: 'https://i.pinimg.com/originals/ad/34/ad/ad34ad8485eb2eb9fce806826b65375d.jpg' },
          { id: 2, url: 'https://i.pinimg.com/originals/ad/34/ad/ad34ad8485eb2eb9fce806826b65375d.jpg' },
          { id: 3, url: 'https://i.pinimg.com/originals/ad/34/ad/ad34ad8485eb2eb9fce806826b65375d.jpg' },
        ],
        Owner: { firstName: 'John', lastName: 'Doe' },
      };
      setRoom(roomData);
      setLoading(false);
    };

    const fetchReviews = async () => {
      const reviewsData = [
        { id: 1, userId: 2, userName: 'Jane Smith', stars: 5, review: 'Great experience!', createdAt: '2024-06-24' },
        { id: 2, userId: 3, userName: 'Alice Johnson', stars: 4.5, review: 'Nice room and amenities.', createdAt: '2024-06-22' },
      ];
      setReviews(reviewsData);
    };

    fetchRoomDetails(roomId);
    fetchReviews();
  }, []);

  const handleEditReview = (reviewId) => {
    const selected = reviews.find(review => review.id === reviewId);
    setSelectedReview(selected);
    setIsModalOpen(true);
  };

  const handleDeleteReview = (reviewId) => {
    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    setReviews(updatedReviews);
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
    setIsModalOpen(false);
  };

  const handleReviewCreation = (newReview) => {
    if (selectedReview) {
      const updatedReviews = reviews.map(review =>
        review.id === selectedReview.id ? { ...review, ...newReview } : review
      );
      setReviews(updatedReviews);
      setIsModalOpen(false);
      setSelectedReview(null);
    } else {
      setReviews([...reviews, { ...newReview, id: Date.now(), userName: 'Current User', createdAt: new Date().toISOString() }]);
      setIsModalOpen(false);
    }
  };

  const reviewText = reviews.length === 1 ? '1 Review' : `${reviews.length} Reviews`;

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 'New';
    const totalRating = reviews.reduce((acc, review) => acc + review.stars, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating(reviews);

  return (
    <div className="room-details-page">
      <div className="top-section">
        <div className="room-detail">
          <h1>{room.name} <FontAwesomeIcon icon={faEdit} className="edit-icon"/> <FontAwesomeIcon icon={faDeleteLeft} className="delete-icon" /></h1>
          <p>Hosted by {room.Owner?.firstName} {room.Owner?.lastName}</p>
          <p>{room.city}, {room.state}, {room.country}</p>
          <div className="room-images">
            {room.roomImages && room.roomImages.length > 0 && (
              <>
                <img src={room.roomImages[0]?.url} alt={room.name} className="large-image" />
                <div className="small-images">
                  {room.roomImages.slice(1, 5).map((image) => (
                    <img key={image.id} src={image.url} alt={room.name} />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="room-info">
            <p className="room-description">{room.description}</p>
          </div>
        </div>
        <div className="callout-ctn">
          <div className="callout-info">
            <p className="price">${room.price} / night</p>
            <p className="rating">
              {reviews.length === 0 ? (
                <span className="gold-text">★ New</span>
              ) : (
                <>
                  <span className="gold-text">{averageRating} ★</span> <span className="black-text">· {reviewText}</span>
                </>
              )}
            </p>
            <button className="reserve-button" onClick={() => alert('Feature Coming Soon!')}>
              Reserve
            </button>
          </div>
        </div>
      </div>
      <button className="addreview" onClick={() => setIsModalOpen(true)}>Add Review</button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ReviewForm
          initialReview={selectedReview?.review}
          initialStars={selectedReview?.stars}
          onClose={handleReviewCreation}
        />
      </Modal>
      <div className="reviews-section">
        <h3>Top Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review">
              <p>{review.userName}</p>
              <p>{new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
              <p>{review.review}</p>
              <p>Rating: {review.stars} ★</p>
              <div className="review-actions">
                <button onClick={() => handleEditReview(review.id)}>Edit</button>
                <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-reviews-text">Be the first to post a review!</p>
        )}
      </div>
    </div>
  );
};

export default RoomDetail;
