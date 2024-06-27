import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomCard from './RoomCard';
import './Rooms.css';
import VacationSearchBar from '../SearchBar/VaccationSearchBar';

const Rooms = () => {
  const navigate = useNavigate();

  const roomsData = [
    {
      id: 1,
      name: 'Deluxe Room',
      bed: '2 King Size',
      price: 250,
      avgRating: 4.5,
      previewImage: 'https://i.pinimg.com/originals/ad/34/ad/ad34ad8485eb2eb9fce806826b65375d.jpg',
    },
    {
      id: 2,
      name: 'Family Room',
      bed: '2 King Size',
      price: 300,
      avgRating: 4.7,
      previewImage: 'https://lancasterbangkok.com/wp-content/uploads/2019/02/09_1025_Deluxe_Room_Out_In_Night_Final_SM.jpg',
    },
    {
      id: 3,
      name: 'Suite',
      bed: '2 King Size',
      price: 200,
      avgRating: 4.3,
      previewImage: 'https://assets-global.website-files.com/5c6d6c45eaa55f57c6367749/624b471bdf247131f10ea14f_61d31b8dbff9b500cbd7ed32_types_of_rooms_in_a_5-star_hotel_2_optimized_optimized.jpeg',
    },
    {
      id: 4,
      name: 'Luxury Room',
      bed: '2 King Size',
      price: 250,
      avgRating: 4.5,
      previewImage: 'https://i.pinimg.com/originals/ad/34/ad/ad34ad8485eb2eb9fce806826b65375d.jpg',
    },
    {
      id: 5,
      name: 'Single Room',
      bed: '2 King Size',
      price: 250,
      avgRating: 4.5,
      previewImage: 'https://i.pinimg.com/originals/ad/34/ad/ad34ad8485eb2eb9fce806826b65375d.jpg',
    },
    {
      id: 6,
      name: 'Double Room',
      bed: '2 King Size',
      price: 250,
      avgRating: 4.5,
      previewImage: 'https://i.pinimg.com/originals/ad/34/ad/ad34ad8485eb2eb9fce806826b65375d.jpg',
    },
  ];

  const handleClick = (roomId) => {
    navigate('/rooms/1');
  };

  const handleDelete = (roomId) => {
    console.log(`Delete room with ID: ${roomId}`);
  };

  return (
  <div>
    <VacationSearchBar/>
    <div className="rooms-container">
      {roomsData.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onClick={handleClick}
          onDelete={handleDelete}
        />
      ))}
    </div>
    </div>
  );
};

export default Rooms;
