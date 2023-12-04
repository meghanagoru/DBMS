const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken');
const db = require('/Users/meghanagoru/DBMS_project/backend/server.js');

const secretKey="meg";
function generateToken(user) {
  const payload = {
    user: user.username,
    password: user.password,
  };

  const token = jwt.sign(payload, secretKey);
  return token;
}

router.post('/', (req, res) => {
    const chosen_s_d = req.headers['chosen_s_d'];
    console.log(chosen_s_d);
    if(chosen_s_d=="student")
    {
      const { SID, FirstName, LastName, Email, PhoneNo, password,username ,pincode} = req.body;

      // Validate user input (e.g., check for required fields)
      if (!SID || !FirstName|| !Email || !PhoneNo || !pincode || !username  || !password) {
          return res.status(400).json({ message: 'Please fill in all required fields.' });
      }
      
      // Hash the password securely using bcrypt
      bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
              return res.status(500).json({ message: 'Error hashing the password.' });
          }
          
          // Store user data in the database
          const query = 'INSERT INTO student (SID, FirstName, LastName, Email, PhoneNo, username,passwd,pincode) VALUES (?, ?, ?, ?, ?, ? ,?, ?)';
          db.query(query, [SID, FirstName, LastName, Email, PhoneNo, username, hash,pincode], (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Error registering the user.' });
              }
              
              let user = {password:hash,username:SID };
              console.log(user);
              const token = generateToken(user); 
              return res.status(201).json({ message: 'User registered successfully.',token });
            
          });
      });
  }
  else if(chosen_s_d=="driver")
  {
    const { DID, FirstName, LastName, LicenseNumber, PhoneNo, username, password } = req.body;
    console.log(req.body);
    
    // Validate user input (e.g., check for required fields)
    if (!DID || !FirstName|| !LicenseNumber || !PhoneNo  || !username  || !password) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // Hash the password securely using bcrypt
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing the password.' });
        }
        
        // Store user data in the database
        const query = 'INSERT INTO driver (DID, FirstName, LastName, LicenseNumber, PhoneNo, username, passwd) VALUES (?, ?, ?, ?, ?, ?,?)';
        db.query(query, [DID, FirstName, LastName, LicenseNumber, PhoneNo, username, hash], (err, results) => {
            if (err) {
              return res.status(500).json({ message: 'Error registering the user.' });
            }
            if (results.length === 0) {
              return res.status(401).json({ message: 'User not found.' });
            }
            
            let user = {password:hash,username:DID };
            const token = generateToken(user); 
            return res.status(201).json({ message: 'User registered successfully.',token });
            
        });
    });
  }
});

module.exports = router;
