import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Card, CardContent, CardMedia, Typography} from "@mui/material";
import Tooltip from '../ToolTip/Tooltip';
import './RoomCard.css';

const RoomCard = ({ room, onClick, onDelete }) => {
  const navigate = useNavigate();

  const previewImageDefault = 'https://www.pexels.com/photo/lighted-beige-house-1396132/';
  const previewImageUrl = room.imageurl ? room.imageurl : previewImageDefault;

  const averageRating = room.avgRating ? parseFloat(room.avgRating).toFixed(1) : 0;

  return (
    <div
      key={room.roomid}
      onClick={() => onClick(room.roomid)}
    >
      <Card sx={{width: 300, borderRadius: 2, position: 'relative'}}>
        <CardMedia
          image={previewImageUrl}
          sx={{height: 300}}
          title={room.name}
        />
        {
          room.discountcode && (
            <Typography style={{position: 'absolute', left: '10px', top: '5px', backgroundColor: 'red', padding: '4px', borderRadius: '8px', color: '#fff'}}>
              {room.discountcode} OFF
            </Typography>
          )
        }
      </Card>
      <div>
        <div className="room-header">
          <h3 className="room-name">{room.roomtype === 'Rooms' ? `Room ${room.roomnumber}` : room.roomtype}</h3>
        </div>
        <p className="room-address">{room.address}, {room.city}, {room.state}</p>
        <p className="room-price">${room.price} CAD / night</p>
      </div>
    </div>
  );
};

export default RoomCard;
