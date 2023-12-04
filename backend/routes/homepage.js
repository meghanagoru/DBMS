const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('/Users/meghanagoru/DBMS_project/backend/server.js');

const secretKey = 'meg'; // Replace with your actual secret key

// Middleware to verify the token and attach the payload to the request
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userData = decoded;
   
    next();
  } catch (error) {
    console.error('Error decoding token:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Endpoint to get stops
router.get('/', verifyToken, async (req, res) => {
    try {
      const userId = req.userData.user;
      const selectedStop = req.body.stopName;
      // Fetch user's pincode
        db.query('SELECT StopID,StopName FROM stops WHERE pincode=(SELECT pincode FROM student WHERE SID= ?)', [userId], (err, result) => {
                if(err){
                    return res.status(404).json({ message: 'error' });
                }
                if (result!=[]) {
                const stops = result.map((results) => results.StopName); // Corrected property name
                return res.json({ stops });
                } else {
                console.log("no stops");
                return res.json({ message: 'No stops found for the given pincode.' });
                }
                // });
            });
    
    } catch (error) {
      console.error('Error fetching stops:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.post('/assign-bus', verifyToken, async (req, res) => {
    try {
        const userId = req.userData.user;
        const selectedStop = req.body.stopName;

        // Fetch BusID based on selectedStop
        db.query('SELECT BusID from student where SID=?', [userId], (err, nullornot) => {
            console.log(selectedStop);
            if (nullornot[0].BusID === null && selectedStop != "" ) {
                db.query('SELECT BusID FROM ROUTEASSIGNMENT WHERE StopID = (SELECT StopID from Stops where StopName=? )', [selectedStop], (err, result) => {
                    if (err) {
                        console.error('Error fetching BusID:', err);
                        return res.status(500).json({ message: 'Internal Server Error' });
                    }

                    if (result.length > 0) {
                        const busIds = result.map((row) => row.BusID);
                        db.query('SELECT BusID, MIN(Capacity) AS MinCapacity FROM BUSES WHERE BusID IN (?) GROUP BY BusID ORDER BY MinCapacity LIMIT 1', [busIds], (err, busresult) => {
                            if (err) {
                                console.error('Error fetching min BusID:', err);
                                return res.status(500).json({ message: 'Internal Server Error' });
                            }
                            
                            const minCapacity = busresult[0].MinCapacity;
                            console.log("min",minCapacity);
                            if (minCapacity > 2) {
                                // Assign a new free bus to all stops with the initial bus ID
                                db.query('SELECT DISTINCT StopID FROM ROUTEASSIGNMENT WHERE BusID = ?', [busIds[0]], (err, stops) => {
                                    if (err) {
                                        console.error('Error fetching stops for initial bus ID:', err);
                                        return res.status(500).json({ message: 'Internal Server Error' });
                                    }

                                    const stopIds = stops.map((stop) => stop.StopID);

                                    db.query('SELECT BusID FROM BUSES WHERE Capacity = 0 AND BusID NOT IN (?) LIMIT 1', [busIds], (err, newBus) => {
                                        if (err) {
                                            console.error('Error fetching new free bus:', err);
                                            return res.status(500).json({ message: 'Internal Server Error' });
                                        }

                                        const newBusId = newBus[0].BusID;

                                        const values = stopIds.map((stopId) => [stopId, newBusId]);
                                        db.query('INSERT INTO ROUTEASSIGNMENT (StopID, BusID) VALUES ?', [values], (err) => {
                                            if (err) {
                                                console.error('Error inserting rows with new bus ID:', err);
                                                return res.status(500).json({ message: 'Internal Server Error' });
                                            }

                                            // Update student and BUSES tables
                                            db.query('UPDATE student SET BusID=? WHERE SID=?', [newBusId, userId]);
                                            db.query('UPDATE BUSES SET Capacity = Capacity + 1 WHERE BusID = ?', [newBusId]);
                                            return res.status(201).json({ BusID: newBusId, message: 'Bus assigned successfully.' });
                                        });
                                    });
                                });
                            } else {
                                db.query('UPDATE student SET BusID=? WHERE SID=?', [busresult[0].BusID, userId]);
                                db.query('UPDATE BUSES SET Capacity = Capacity + 1 WHERE BusID = ?', [busresult[0].BusID]);
                                return res.status(201).json({ BusID: busresult[0].BusID, message: 'Bus assigned successfully.' });
                            }
                        });

                    } else {

                        return res.status(201).json({ message: 'No buses found for the selected stop.' });
                    }
                });
            } else if (selectedStop == "") {
                return res.status(201).json({ message: 'No buses found for this pincode.' });
            } else {
                return res.status(201).json({ BusID: nullornot[0].BusID, message: 'Bus assigned successfully.' });
            }
        });

    } catch (error) {
        console.error('Error assigning bus:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports = router;
