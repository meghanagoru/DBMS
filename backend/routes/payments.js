// Import necessary modules
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('/Users/meghanagoru/DBMS_project/backend/server.js'); // Replace with the actual path to your database module

const secretKey = "meg"; // Replace with your actual secret key

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

// Endpoint to get payment information
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userData.user;

    // Fetch payment data from the database using user ID
    db.query('SELECT * FROM payments WHERE StudentID = ?', [userId], (err, result) => {
      if (err) {
        console.error('Error fetching payments:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      const paymentData = result.map(payment => ({
        paymentId: payment.PaymentID,
        paymentDate: payment.PaymentDate,
        paymentMethod: payment.PaymentMethod,
        Amount:payment.Amount
       
      }));

      res.status(200).json({ payments: paymentData });
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
