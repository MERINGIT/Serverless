import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // Import date picker library
import 'react-datepicker/dist/react-datepicker.css'; // Import date picker styles
import './VacationSearchBar.css'; // Import your CSS file for styling

const VacationSearchBar = () => {
  const [searchDetails, setSearchDetails] = useState({
    startDate: null, // Date object for start date
    endDate: null, // Date object for end date
    roomType: '' // Type of room
  });

  // Handle changes in date pickers
  const handleStartDateChange = (date) => {
    setSearchDetails({ ...searchDetails, startDate: date });
  };

  const handleEndDateChange = (date) => {
    setSearchDetails({ ...searchDetails, endDate: date });
  };

  // Handle changes in select input and text input
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchDetails({ ...searchDetails, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the search logic here
    console.log('Search Details:', searchDetails);
  };

  return (
    <div className="vacation-search-bar">
      <form onSubmit={handleSubmit} className="form-row">
        <div className="form-group">
          <label>Check-in:</label>
          <DatePicker
            selected={searchDetails.startDate}
            onChange={handleStartDateChange}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select date"
            className="date-picker"
          />
        </div>
        <div className="form-group">
          <label>Check-out:</label>
          <DatePicker
            selected={searchDetails.endDate}
            onChange={handleEndDateChange}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select date"
            className="date-picker"
          />
        </div>
        <div className="form-group">
          <label>Room Type:</label>
          <input
            type="text"
            name="roomType"
            placeholder="E.g., Deluxe, Standard"
            value={searchDetails.roomType}
            onChange={handleInputChange}
            className="room-type-input"
          />
        </div>
        <button type="submit" className="search-button">SEARCH</button>
      </form>
    </div>
  );
};

export default VacationSearchBar;
