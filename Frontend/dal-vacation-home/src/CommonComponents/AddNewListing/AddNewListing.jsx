import React, { useState } from 'react';
import axios from 'axios';
import './AddNewListing.css'; // Import your CSS file for styling
import { useNavigate } from 'react-router-dom';

function AddNewListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    roomType: 'Rooms',
    price: '',
    description: '',
    roomImage: null,
    roomId: '',
    roomNumber: '',
    hostedBy: '',
    discountCode: '0%',
    amenities: '',
    nextAvailableDate: '',
  });

  const [alert, setAlert] = useState(null);

  function generateRoomId() {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${randomString}`;
  }

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
      roomImage: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let imageUrl = '';

    if (formData.roomImage) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];

        try {
          const uploadResponse = await axios.post(
            'https://ksqj45fgb6.execute-api.us-east-1.amazonaws.com/prod/s3upload',
            { image: base64Image }
          );
          imageUrl = uploadResponse.data.s3_url;
          await submitForm(imageUrl);
        } catch (error) {
          showAlert('Error uploading image', 'danger');
        }
      };
      reader.readAsDataURL(formData.roomImage);
    } else {
      await submitForm(imageUrl);
    }
  };

  const submitForm = async (imageUrl) => {
    const dataToSubmit = {
      ...formData,
      roomId: generateRoomId(),
      imageUrl: imageUrl,
      isBooked: false,
    };

    try {
      const response = await axios.post(
        'https://keb5kjmf80.execute-api.us-east-1.amazonaws.com/prod/roomcrudoperations',
        { httpMethod: "POST", body: dataToSubmit }
      );
      console.log(response);
      if (response.status == 200) {
        showAlert('Room added successfully', 'success');
        setFormData({
          address: '',
          city: '',
          state: '',
          roomType: 'Rooms',
          price: '',
          description: '',
          roomImage: null,
          roomId: '',
          roomNumber: '',
          hostedBy: '',
          discountCode: '0%',
          amenities: '',
          nextAvailableDate: '',
        });
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        showAlert('Error adding room', 'danger');
      }
    } catch (error) {
      showAlert('Error submitting form', 'danger');
    }
  };

  const showAlert = (message, variant) => {
    setAlert({ message, variant });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  const validateForm = () => {
    if (!formData.roomNumber.trim() || !formData.address.trim() || !formData.city.trim() || !formData.state.trim() ||
      !formData.hostedBy.trim() || !formData.price || !formData.description.trim() || !formData.amenities.trim() || 
      !formData.nextAvailableDate) {
      showAlert('Please fill in all required fields', 'danger');
      return false;
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      showAlert('Please enter a valid price', 'danger');
      return false;
    }

    return true;
  };

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div>
      {alert && (
        <div className={`alert alert-${alert.variant}`} role="alert">
          {alert.message}
        </div>
      )}
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Add A New Property</h2>
        <label>
          Room Number
          <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
        </label>
        <label>
          Address
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </label>
        <label>
          City
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </label>
        <label>
          State
          <input type="text" name="state" value={formData.state} onChange={handleChange} required />
        </label>
        <label>
          Hosted By
          <input type="text" name="hostedBy" value={formData.hostedBy} onChange={handleChange} required />
        </label>
        <label>
          Room Type
          <select name="roomType" value={formData.roomType} onChange={handleChange} required >
            <option value="Rooms">Rooms</option>
            <option value="Recreation">Recreation</option>
          </select>
        </label>
        <label>
          Price
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </label>
        <label>
          Description
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <label>
          Discount Code
          <select name="discountCode" value={formData.discountCode} onChange={handleChange} required >
            <option value="0%">0% off</option>
            <option value="10%">10% off</option>
            <option value="20%">20% off</option>
            <option value="30%">30% off</option>
            <option value="50%">50% off</option>
            <option value="75%">75% off</option>
          </select>
        </label>
        <label>
          Amenities
          <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} required />
        </label>
        <label>
          Next Available Date
          <input type="date" name="nextAvailableDate" value={formData.nextAvailableDate} onChange={handleChange} min={getTodayDate()} required />
        </label>
        <label>
          Upload Photo
          <input type="file" onChange={handlePhotoUpload} required />
        </label>
        <button type="submit">Add New Property</button>
      </form>
    </div>
  );
}

export default AddNewListing;
