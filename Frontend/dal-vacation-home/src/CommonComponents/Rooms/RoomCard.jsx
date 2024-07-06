import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Tooltip from '../ToolTip/Tooltip'
import './RoomCard.css';

const RoomCard = ({ room, onClick, onDelete }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const navigate = useNavigate();

  const  previewImageDefault= 'https://www.pexels.com/photo/lighted-beige-house-1396132/';
  const previewImageUrl = room.imageurl ? room.imageurl : previewImageDefault;

  const averageRating = room.avgRating ? parseFloat(room.avgRating).toFixed(1) : 'New';
  console.log(room);



  return (
    <div
      key={room.roomid}
      className="room-tile"
      onMouseEnter={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
      onClick={() => onClick(room.roomid)}
    >
      <img src={previewImageUrl} alt={room.name} />
      <Tooltip text={room.name} visible={tooltipVisible} /> 
      <div className="room-info">
        <h3 className="room-name">{room.roomtype}</h3>
        <p>{room.address},{room.city},{room.state}</p>
        <p>${room.price} / night</p>
        <p className="average-rating">{averageRating} ★</p>
        <p className="average-rating">{averageRating} ★</p>

        <div className="room-actions">
            <button className="book-button" onClick={() => onClick(room.roomid)}>Book Now</button>
          </div> 

          
        
      </div>
    </div>
  );
};

export default RoomCard;
