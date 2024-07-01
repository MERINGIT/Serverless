import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateList.css'; // Assuming AddNewListing.css is the same CSS file used for AddNewListing

const UpdateList = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    roomtype: 'rooms',
    price: '',
    description: '',
    roomImage: null,
    roomid: '',
    roomnumber: '',
    hostedby: '',
    discountcode: '0%',
    amenities: '',
    nextavailabledate: '',
    imageUrl: '',
  });

  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.post(
          `https://edbukdvnag.execute-api.us-east-1.amazonaws.com/test/roomcrudoperations`,
          {
            httpMethod: 'GET',
            pathParameters: { roomId: roomId },
          }
        );
        const roomData = JSON.parse(response.data.body);
        setFormData({
          ...roomData,
          roomImage: null, // reset the image upload field
        });
      } catch (error) {
        console.error('Error fetching room details:', error);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

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

    let imageUrl = formData.imageUrl;

    if (formData.roomImage) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];

        try {
          const uploadResponse = await axios.post(
            'https://ljfq5ths4e.execute-api.us-east-1.amazonaws.com/test/s3upload',
            { image: base64Image }
          );
          imageUrl = JSON.parse(uploadResponse.data.body).s3_url;
          console.log(imageUrl);
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
      imageurl: imageUrl,
      isbooked: false,
    };

    try {
      const response = await axios.post(
        'https://edbukdvnag.execute-api.us-east-1.amazonaws.com/test/roomcrudoperations',
        { httpMethod: "PUT", pathParameters:{roomId:roomId}, body: dataToSubmit }
      );
    console.log(response);
      if (response.data.statusCode === 200) {
        showAlert('Room updated successfully', 'success');
        setTimeout(() => {
          navigate(`/rooms/${roomId}`);
        }, 3000);
      } else {
        showAlert('Error updating room', 'danger');
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
    if (!formData.roomnumber.trim() || !formData.address.trim() || !formData.city.trim() || !formData.state.trim() ||
      !formData.hostedby.trim() || !formData.price || !formData.description.trim() || !formData.amenities.trim() || 
      !formData.nextavailabledate) {
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
        <h2>Update Property</h2>
        <label>
          Room Number
          <input type="text" name="roomnumber" value={formData.roomnumber} onChange={handleChange} required />
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
          <input type="text" name="hostedby" value={formData.hostedby} onChange={handleChange} required />
        </label>
        <label>
          Room Type
          <select name="roomtype" value={formData.roomtype} onChange={handleChange} required >
            <option value="rooms">Rooms</option>
            <option value="recreation">Recreation</option>
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
          <select name="discountcode" value={formData.discountcode} onChange={handleChange} required >
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
          <input type="date" name="nextavailabledate" value={formData.nextavailabledate} onChange={handleChange} min={getTodayDate()} required />
        </label>
        <label>
          Upload Photo
          <input type="file" onChange={handlePhotoUpload} />
        </label>
        <button type="submit">Update Property</button>
      </form>
    </div>
  );
};

export default UpdateList;
