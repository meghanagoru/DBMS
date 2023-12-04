

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
 // Import the NavigationBar component
 import NavigationBar from './navbar';
function HomePage() {
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [stops, setStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState([]);
  const [selectedBus, setSelectedBus] = useState([]);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/home", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setStops(response.data.stops);
        
      } catch (error) {
        console.error("Error fetching stops:", error);
      }
    };

    if (isLoggedIn) {
      fetchStops();
    }
  }, [token, isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(); // Reload the page after logging out
  };

  const handleStopChange = (e) => {
    setSelectedStop(e.target.value);
  };

  const handleBusAssignment = async () => {
    // Perform logic to find the bus with the least capacity and assign it
    // You'll need to make another API request for this logic
    try {
      const response = await axios.post("http://localhost:8080/api/home/assign-bus", {
        stopName: selectedStop,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(response.status===201)
      {
        console.log(response.data.message);
        console.log("hi");
        if(response.data.BusID){
          setSelectedBus(response.data.BusID);
        }
        if(response.data.message)
        {
          setMessage(response.data.message);
        }
        console.log(selectedBus);
      }
      else{

      }
    } catch (error) {
      console.error("Error assigning bus:", error);
    }
  };

  return (
    <div>
      {/* <NavigationBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} /> */}
      <h1>Welcome to our website</h1>
      {isLoggedIn ? (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <div>
            <label>Select Stop:</label>
            <select onChange={handleStopChange}>
              <option value="">Select a stop</option>
              {stops.map((stop, index) => (
                <option key={index} value={stop}>{stop}</option>
              ))}
            </select>
          </div>
          {selectedStop && (
            <div>
              <p>Selected Stop: {selectedStop}</p>
              <button onClick={handleBusAssignment}>Assign Bus</button>
              {selectedBus && <p>Assigned Bus: {selectedBus}</p>}
              {message && <p>{message}</p>}
            </div>
          )}
          <Link to="/profile">
            <button>Profile</button>
          </Link>
          <Link to="/payment">
            <button>Payment</button>
          </Link>
        </div>
      ) : (
        <div>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default HomePage;
