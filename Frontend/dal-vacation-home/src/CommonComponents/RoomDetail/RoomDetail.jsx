import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import ReviewForm from '../ReviewForm/ReviewForm';
import Modal from '../Modal/Modal';
import "./RoomDetail.css";

import Cookies from 'js-cookie';

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [room, setRoom] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const [isUserAnAgent, setIsUserAnAgent] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    if (Cookies.get("profile") === "property-agent") {
      setIsUserAnAgent(true);
    }

    if (Cookies.get("user_id")) {
      setIsUserLoggedIn(true);
    }

    const fetchRoomDetails = async (roomId) => {
      try {
        setLoading(true);
        const response = await axios.post(`https://keb5kjmf80.execute-api.us-east-1.amazonaws.com/prod/roomcrudoperations`, 
          {
            httpMethod: 'GET',
            pathParameters: { roomId: roomId },
          }
        );
        console.log(response.data);
        setRoom(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching room details:', error);
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.post(`https://n4n363umn2.execute-api.us-east-1.amazonaws.com/prod/feedbackcrud`, { httpMethod: "GET" });
        var allReviews = response.data;
        allReviews=allReviews.reviews;
        console.log(allReviews);
        
        // Filter reviews by roomid
        const filteredReviews = allReviews.filter(review => review.roomid === roomId);
        setReviews(filteredReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    
    fetchRoomDetails(roomId);
    fetchReviews();
  }, [roomId]);

  const handleEditReview = (reviewId) => {
    const selected = reviews.find(review => review.reviewid === reviewId);
    setSelectedReview(selected);
    setIsModalOpen(true);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.post(`https://n4n363umn2.execute-api.us-east-1.amazonaws.com/prod/feedbackcrud`, 
        {
          httpMethod: 'DELETE',
          body: { reviewid: reviewId },
        }
      );
      alert('Feedback deleted successfully');
      const updatedReviews = reviews.filter(review => review.reviewid !== reviewId);
      setReviews(updatedReviews);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
    setIsModalOpen(false);
  };

  const handleReviewCreation = async (newReview) => {
    if (selectedReview) {
      try {
        await axios.post(`https://n4n363umn2.execute-api.us-east-1.amazonaws.com/prod/feedbackcrud`, 
          {
            httpMethod: 'PUT',
            body: {
              reviewid: selectedReview.reviewid,
              comment: newReview.review,
              rating: newReview.stars,
            },
          }
        );
        const updatedReviews = reviews.map(review =>
          review.reviewid === selectedReview.reviewid ? { ...review, ...newReview } : review
        );
        setReviews(updatedReviews);
        setIsModalOpen(false);
        setSelectedReview(null);
        alert('Feedback edited successfully');
        window.location.reload();
      } catch (error) {
        console.error('Error updating review:', error);
      }
    } else {
      try {
        await axios.post(`https://n4n363umn2.execute-api.us-east-1.amazonaws.com/prod/feedbackcrud`, 
          {
            httpMethod: 'POST',
            body: {
              reviewid: Date.now().toString(),
              comment: newReview.review,
              rating: newReview.stars,
              roomid: roomId,
              username: Cookies.get("name"),
            },
          }
        );
        setReviews([...reviews, { ...newReview, reviewid: Date.now(), userName: 'Current User', createdAt: new Date().toISOString() }]);
        setIsModalOpen(false);
        alert('Feedback added successfully');
        window.location.reload();
      } catch (error) {
        console.error('Error creating review:', error);
      }
    }
  };

  const onDelete = async () => {
    try {
      await axios.post(`https://keb5kjmf80.execute-api.us-east-1.amazonaws.com/prod/roomcrudoperations`, 
        {
          httpMethod: 'DELETE',
          pathParameters: { roomId: roomId },
        }
      );
      alert('Room deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete the room');
    }
  };

  const onUpdate = () => {
    navigate(`/update-room/${roomId}`);
  };

  const reviewText = reviews.length === 1 ? '1 Review' : `${reviews.length} Reviews`;

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 'New';
    const totalRating = reviews.reduce((acc, review) => acc + parseInt(review.rating), 0);
    return (totalRating / reviews.length).toFixed(1);
  };
  

  const averageRating = calculateAverageRating(reviews);

  if (loading) {
    return <div>Loading...</div>;
  }
//need to be changed based on admin type
  return (
    <div className="room-details-page">
      <div className="top-section">
        <div className="room-detail">
          <h1>{room.roomtype}
            {isUserAnAgent && <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={onUpdate} />}
            {isUserAnAgent && <FontAwesomeIcon icon={faDeleteLeft} className="delete-icon" onClick={onDelete} />}
          </h1>
          <p>Hosted by {room.hostedby}</p>
          <p>{room.address},{room.city}, {room.state}</p>
          <div className="room-images">
            {room.imageurl && (
              <>
                <img src={room.imageurl} alt={room.roomtype} className="large-image" />
                <div className="small-images">
                  <img key={room.roomid + "1"} src={room.imageurl} alt={room.roomtype} />
                  <img key={room.roomid + "2"} src={room.imageurl} alt={room.roomtype} />
                  <img key={room.roomid + "3"} src={room.imageurl} alt={room.roomtype} />
                  <img key={room.roomid + "4"} src={room.imageurl} alt={room.roomtype} />
                </div>
              </>
            )}
          </div>
          <div className="room-info">
            <p className="room-description">{room.description}</p>
            <p className="room-description">Amenities included: {room.amenities}</p>
            {room.discountcode && room.discountcode !== "0%" ? (
              <p className="room-description">Discount: {room.discountcode}</p>
            ) : (
              <p className="room-description">No discounts available</p>
            )}
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
      {isUserLoggedIn && <button className="addreview" onClick={() => setIsModalOpen(true)}>Add Review</button>}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ReviewForm
          initialReview={selectedReview?.comment}
          initialStars={selectedReview?.rating}
          onClose={handleReviewCreation}
        />
      </Modal>
      <div className="reviews-section">
        <h3>Top Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.reviewid} className="review">
              <p>{review.username}</p>
              <p>{review.sentimenttype},score:{review.score}</p>
              <p>{review.comment}</p>
              <p>Rating: {review.rating} ★</p>
              <div className="review-actions">
                {review.username === Cookies.get("name") && (
                  <>
                    <button onClick={() => handleEditReview(review.reviewid)}>Edit</button>
                    <button onClick={() => handleDeleteReview(review.reviewid)}>Delete</button>
                  </>
                )}

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
