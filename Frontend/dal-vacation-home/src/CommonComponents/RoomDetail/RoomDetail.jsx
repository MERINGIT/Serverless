import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faEdit } from '@fortawesome/free-solid-svg-icons';
import ReviewForm from '../ReviewForm/ReviewForm';
import Modal from '../Modal/Modal';
import "./RoomDetail.css";
import { Box, Button, Divider, Typography } from "@mui/material";

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
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    const role = Cookies.get("profile")
    if (role === "property-agent") {
      setIsUserAnAgent(true);
    }

    if (role === 'user') {
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
        setRoom(response.data);
        const data = response.data;
        const defaultStartDate = new Date(data.nextavailabledate);
        const nextDay = new Date(defaultStartDate);
        nextDay.setDate(defaultStartDate.getDate() + 1);
        setRoom(data);
        setStartDate(defaultStartDate);
        setEndDate(nextDay);
        handleTotalDays(defaultStartDate, nextDay)
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

  const handleStartDate = (date) => {
    setStartDate(date);
    handleTotalDays(date, endDate);
  }
  
  const handleEndDate = (date) => {
    setEndDate(date);
    handleTotalDays(startDate, date);
  }
  
  const handleTotalDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const timeDifference = endDate.getTime() - startDate.getTime();
    
    const dayDifference = timeDifference / (1000 * 3600 * 24);

    const totalDays = Math.ceil(dayDifference);

    setTotalDays(totalDays);
  }
  
  const calculateSubTotal = () => {
    return room.price * totalDays;
  }

  const calculateDiscount = () => {
    return (calculateSubTotal() * parseInt(room.discountcode)) / 100;
  }

  const calculateTotalPrice = () => {
    return calculateSubTotal() - calculateDiscount();
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="room-details-page">
      <div className="room-images">
        {room.imageurl && (
            <img src={room.imageurl} alt={room.roomtype} className="large-image" />
        )}
      </div>
      <div className="bottom-section">
        <div className="left-section">
          <h1>
            Room {room.roomnumber} 
            {isUserAnAgent && (
              <span>
                <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={onUpdate} /> <FontAwesomeIcon icon={faDeleteLeft} className="delete-icon" onClick={onDelete} />
              </span>
            )
            }
          </h1>
          <p>{room.address}, {room.city}, {room.state}</p>
          <p>Hosted by {room.hostedby}</p>
          <div>
            <Typography variant="h5">About this place</Typography>
            <p className="room-description">{room.description}</p>
            <Typography variant="h5">Amenities included</Typography>
            <p className="room-description">{room.amenities}</p>
          </div>
        </div>
        <div className="right-section">
              <Box style={{border: '1px solid #000', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem'}}>
              <p className="price">${room.price} CAD / night</p>
              <div style={{display: 'flex', }}>
              <DatePicker
                selected={startDate}
                onChange={date => handleStartDate(date)}
                selectsStart
                startDate={startDate}
                minDate={startDate}
                placeholderText="Start Date"
                className="date-picker"
              />
              <DatePicker
                selected={endDate}
                onChange={date => handleEndDate(date)}
                selectsEnd
                endDate={endDate}
                minDate={endDate}
                placeholderText="End Date"
                className="date-picker"
              />
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                  <Typography style={{marginBottom: '8px'}}>${room.price} CAD * {totalDays} Nights</Typography>
                  {room.discountcode && (
                    <Typography style={{marginBottom: '8px'}}>{room.discountcode} OFF</Typography>
                  )}
                </div>
                <div>
                  <Typography style={{marginBottom: '8px'}}>${calculateSubTotal()} CAD</Typography>
                  {room.discountcode && (
                    <Typography style={{marginBottom: '8px'}}>-${calculateDiscount()} CAD</Typography>
                  )}
                </div>
              </div>
              <Divider sx={{border: '1px solid #000', marginBottom: '8px'}} />
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography>Total Price</Typography>
                <Typography>{calculateTotalPrice()} CAD</Typography>
              </div>
              </Box>
              <Button variant="contained" className="reserve-button" onClick={() => alert('Feature Coming Soon!')} disabled={!isUserLoggedIn} style={{backgroundColor: isUserLoggedIn && '#000'}}>
                Reserve
              </Button>
              {
                isUserLoggedIn && (
                  <Button variant="contained" className="addreview" onClick={() => setIsModalOpen(true)} style={{marginTop: '1rem'}}>Add Review</Button>
                )
              }
          </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ReviewForm
          initialReview={selectedReview?.comment}
          initialStars={selectedReview?.rating}
          onClose={handleReviewCreation}
        />
      </Modal>
      <div className="reviews-section">
        <h3>
          <span className="rating">
            {reviews.length === 0 ? (
              <span className="gold-text">0 Review</span>
              ) : (
              <>
                <span className="black-text">{reviewText}</span><span className="gold-text"> {averageRating} ★</span>
              </>
            )}
          </span>
        </h3>
            
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.reviewid} className="review">
              <p>{review.username}</p>
              <p>{review.sentimenttype}, score: {review.score}</p>
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
