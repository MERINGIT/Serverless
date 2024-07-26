import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './VacationSearchBar.css';

const VacationSearchBar = ({ onSearch }) => {
  const [searchDetails, setSearchDetails] = useState({
    nextavailabledate: '',
    roomtype: '',
    discount: '',
  });

  const handleAvailableDateChange = (date) => {
    setSearchDetails({ ...searchDetails, nextavailabledate: date });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchDetails({ ...searchDetails, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchDetails);
  };

  return (
    <div className="vacation-search-bar">
      <form onSubmit={handleSubmit} className="form-row">
        <div className="form-group">
          <label>Next Available Date:</label>
          <DatePicker
            selected={searchDetails.nextavailabledate}
            onChange={handleAvailableDateChange}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select date"
            className="date-picker"
            minDate={new Date()} // Set the minimum date to today's date
          />
        </div>
        <div className="form-group">
          <label>Room Type:</label>
          <select
            name="roomtype"
            value={searchDetails.roomtype}
            onChange={handleInputChange}
            className="room-type-input"
          >
            <option value="">Select Room Type</option>
            <option value="Rooms">Room</option>
            <option value="Recreation">Recreation</option>
          </select>
        </div>
        <div className="form-group">
          <label>Discount:</label>
          <select
            name="discount"
            value={searchDetails.discount}
            onChange={handleInputChange}
            className="room-type-input"
          >
            <option value="">Select Discount</option>
            <option value="0%">0% off</option>
            <option value="10%">10% off</option>
            <option value="20%">20% off</option>
            <option value="30%">30% off</option>
            <option value="50%">50% off</option>
            <option value="75%">75% off</option>
          </select>
        </div>
        <button type="submit" className="search-button">SEARCH</button>
      </form>
    </div>
  );
};

export default VacationSearchBar;
