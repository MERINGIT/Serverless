import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RoomCard from './RoomCard';
import './Rooms.css';
import VacationSearchBar from '../SearchBar/VaccationSearchBar';

const Rooms = () => {
  const navigate = useNavigate();
  const [allRoomsData, setAllRoomsData] = useState([]);
  const [filteredRoomsData, setFilteredRoomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://udtjl5zrg0.execute-api.us-east-1.amazonaws.com/test/roomcrudoperations', {
        httpMethod: 'GET',
      });
      const rooms = JSON.parse(response.data.body);
      setAllRoomsData(rooms);
      setFilteredRoomsData(rooms); // Initially display all rooms
    } catch (error) {
      setError('Error fetching room data');
      console.error('Error fetching room data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchDetails) => {
    const { nextavailabledate, roomtype, discount } = searchDetails;
  
    const filteredRooms = allRoomsData.filter(room => {
      const roomAvailableDate = new Date(room.nextavailabledate);
      const searchStartDate = nextavailabledate ? new Date(nextavailabledate) : null;
  
      // Filter by available date
      const isAvailableDateMatch = !nextavailabledate || roomAvailableDate <= searchStartDate;
  
      // Filter by room type
      const isRoomTypeMatch = !roomtype || room.roomtype === roomtype;
  
      // Filter by discount
      const isDiscountMatch = !discount || room.discountcode === discount;
  
      return isAvailableDateMatch && isRoomTypeMatch && isDiscountMatch;
    });
  
    setFilteredRoomsData(filteredRooms);
  };
  

  const handleClick = (roomId) => {
    navigate(`/rooms/${roomId}`);
  };

  const handleDelete = (roomId) => {
    console.log(`Delete room with ID: ${roomId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <VacationSearchBar onSearch={handleSearch} />
      <div className="rooms-container">
        {filteredRoomsData.map((room) => (
          <RoomCard
            key={room.roomid}
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
