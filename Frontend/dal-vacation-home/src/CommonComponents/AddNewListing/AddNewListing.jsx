// AddNewListing.jsx

import React, { useState } from 'react';
import './AddNewListing.css'; // Import your CSS file for styling

function AddNewListing() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    roomType: '',
    price: '',
    type: '',
    description: '',
    roomImages: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    setFormData(prevState => ({
      ...prevState,
      roomImages: [...prevState.roomImages, ...e.target.files]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data to your API or handle as needed
    console.log(formData);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Add A New Property</h2>
      <label>
        Name
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </label>
      <label>
        Address
        <input type="text" name="address" value={formData.address} onChange={handleChange} />
      </label>
      <label>
        City
        <input type="text" name="city" value={formData.city} onChange={handleChange} />
      </label>
      <label>
        State
        <input type="text" name="state" value={formData.state} onChange={handleChange} />
      </label>
      <label>
        Room Type
        <input type="text" name="roomType" value={formData.roomType} onChange={handleChange} />
      </label>
      <label>
        Price
        <input type="text" name="price" value={formData.price} onChange={handleChange} />
      </label>
      <label>
        Description
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </label>
      <label>
        Upload Photos
        <input type="file" multiple onChange={handlePhotoUpload} />
      </label>
      <button type="submit">Add New Property</button>
    </form>
  );
}

export default AddNewListing;
