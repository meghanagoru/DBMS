const express = require('express');
const router = express.Router();

const db = require('/Users/meghanagoru/DBMS_project/backend/server.js');
const jwt = require('jsonwebtoken');
const secretKey="meg";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userData = decoded;
    console.log('Decoded user data:', decoded);
    next();
  } catch (error) {
    console.error('Error decoding token:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// API endpoint to get driver information
router.get('/', verifyToken, (req, res) => {
  const userID = req.userData.user;
  console.log("hi");

  const busQuery = 'SELECT BusID FROM buses WHERE DriverID = ?';

  db.query(busQuery, [userID], (busErr, busResults) => {
    if (busErr) {
      console.error('Error retrieving bus ID:', busErr);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      if (busResults === []) {
        res.status(201).json({ message: 'Driver not found' });
      } else {
        const busId = busResults[0].BusID;
        console.log("bus",busId);
        // Query to get stops assigned to the driver's bus
        //const stopsQuery = 'SELECT StopID FROM RouteAssignment WHERE BusID = ?';
        const stopsQuery = `
                          SELECT RouteAssignment.StopID, Stops.StopName
                          FROM RouteAssignment
                          JOIN Stops ON RouteAssignment.StopID = Stops.StopID
                          WHERE RouteAssignment.BusID = ?;
                        `;
        db.query(stopsQuery, [busId], (stopsErr, stopsResults) => {
          if (stopsErr) {
            console.error('Error retrieving stops:', stopsErr);
            res.status(500).json({ message: 'Internal Server Error' });
          } else {
            if (Array.isArray(stopsResults) && stopsResults.length === 0) {
              
              res.json({ stopNames: [], message: 'No stops assigned to the driver' });
            } else {
              const stopNames = stopsResults.map((stop) => ({
                stopID: stop.StopID,
                stopName: stop.StopName
              }));
        
              res.json({ stopNames });
            }
          }
        });
//     }
//   }
// });
     }
    }
  });
});

module.exports = router;