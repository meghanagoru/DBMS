

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './d.css'; // Import the CSS file

const DriverInfo = () => {
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [stops, setStops] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/driver-info", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setStops(response.data.stopNames);
        console.log(stops);

      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized access');
        } else {
          console.error('Error fetching driver info:', error);
          setErrorMessage('An error occurred while fetching driver information.');
        }
      }
    };

    if (isLoggedIn) {
      fetchStops();
    }
  }, [token, isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  return (
    <div className="container">
      <h1>Driver Information</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {(Array.isArray(stops) && stops.length === 0) ? (
        <p>No stops assigned to the driver</p>
      ) : (
        <div>
          <p>Stops assigned to the driver:</p>
          <ul className="stops-list">
            {stops.map((stop, index) => (
              <li key={index}>{stop.stopName}</li>
            ))}
          </ul>
        </div>
      )}
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DriverInfo;
