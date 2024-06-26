import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Tooltip from '../ToolTip/Tooltip'
import './RoomCard.css';

const RoomCard = ({ room, onClick, onDelete }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const navigate = useNavigate();

  const  previewImageDefault= 'https://www.pexels.com/photo/lighted-beige-house-1396132/';
  const previewImageUrl = room.previewImage ? room.previewImage : previewImageDefault;

  const averageRating = room.avgRating ? parseFloat(room.avgRating).toFixed(1) : 'New';

  const handleUpdateClick = (e) => {
    e.stopPropagation();
    navigate('/room/1');
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(room.id);
  };

  return (
    <div
      key={room.id}
      className="room-tile"
      onMouseEnter={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
      onClick={() => onClick(room.id)}
    >
      <img src={previewImageUrl} alt={room.name} />
      <Tooltip text={room.name} visible={tooltipVisible} /> 
      <div className="room-info">
        <h3 className="room-name">{room.name}</h3>
        <p>{room.bed}</p>
        <p>${room.price} / night</p>
        <p className="average-rating">{averageRating} ★</p>
        <p className="average-rating">{averageRating} ★</p>

        <div className="room-actions">
            <button className="book-button" onClick={handleUpdateClick}>Book Now</button>
          </div> 

          {/* <div className="room-actions">
            <button className="update-button" onClick={handleUpdateClick}>Update</button>
            <button className="delete-button" onClick={handleDeleteClick}>Delete</button>
          </div> */}
        
      </div>
    </div>
  );
};

export default RoomCard;
