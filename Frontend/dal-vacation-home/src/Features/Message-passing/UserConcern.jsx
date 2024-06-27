import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserConcern.css'; // Import your custom CSS file for styling

const UserConcern = () => {
  const [concerns, setConcerns] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All', 'Open', 'Closed'

  useEffect(() => {
    axios.post('https://94wy48cque.execute-api.us-east-1.amazonaws.com/test/fetchingconcern', {
      userid: '1' // Replace '1' with the actual user ID
    })
    .then((response) => {
      console.log(response.data.body);
      setConcerns(JSON.parse(response.data.body));
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []); // Empty array as the second argument to run this effect only once on component mount

  const handleClose = (enquiryid) => {
    const concernToUpdate = concerns.find((concern) => concern.enquiryid === enquiryid);
    if (concernToUpdate) {
      axios.put('https://9vacegm7ub.execute-api.us-east-1.amazonaws.com/test2/closeticket', {
        enquiryid: concernToUpdate.enquiryid,
        comments: concernToUpdate.comments,
        concern:concernToUpdate.concern,
        useremail:concernToUpdate.useremail,
        status: 'Closed'
      })
      .then((response) => {
        const updatedConcerns = concerns.map((concern) =>
          concern.enquiryid === enquiryid ? { ...concern, status: 'Closed' } : concern
        );
        setConcerns(updatedConcerns);
      })
      .catch((error) => {
        console.error('Error closing ticket:', error);
      });
    }
  };

  const handleCommentChange = (enquiryid, newComment) => {
    const updatedConcerns = concerns.map((concern) =>
      concern.enquiryid === enquiryid ? { ...concern, comments: newComment } : concern
    );
    setConcerns(updatedConcerns);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Check if concerns is empty before filtering
  const filteredConcerns = concerns.length > 0 ? (filter === 'All' ? concerns : concerns.filter((concern) => concern.status === filter)) : [];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">New Tickets</h2>
      <div className="filter-container mb-4">
        <label htmlFor="filter">Filter by Status:</label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>User</th>
            <th>User Email</th>
            <th>Booking Reference</th>
            <th>Status</th>
            <th>Concern</th>
            <th>Comments</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredConcerns.map((concern) => (
            <tr key={concern.enquiryid}>
              <td>{concern.username}</td>
              <td>{concern.useremail}</td>
              <td>{concern.bookingReference}</td>
              <td>{concern.status}</td>
              <td>{concern.concern}</td>
              <td>
                {concern.status === 'Open' ? (
                  <input
                    type="text"
                    value={concern.comments}
                    onChange={(e) => handleCommentChange(concern.enquiryid, e.target.value)}
                  />
                ) : (
                  concern.comments
                )}
              </td>
              <td>
                {concern.status === 'Open' && (
                  <button className="custom-button" onClick={() => handleClose(concern.enquiryid)}>
                    Close
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserConcern;
