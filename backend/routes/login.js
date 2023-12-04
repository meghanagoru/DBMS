const express = require('express');
const router = express.Router();
const db = require('/Users/meghanagoru/DBMS_project/backend/server.js');
const jwt = require('jsonwebtoken');
const secretKey = 'meg';

function generateToken(user) {
  const payload = {
    user: user.username,
    password: user.password,
  };


  const token = jwt.sign(payload, secretKey);
  return token;
}

// Define the login route
router.post('/', (req, res) => {
  const chosen_s_d = req.headers['chosen_s_d'];
  const { username, password } = req.body;  
  console.log(chosen_s_d);
  let query="";
  if(chosen_s_d=="student")
  {
    query = 'SELECT * FROM student WHERE SID = ?'; 
  }
  else if(chosen_s_d=="driver")
  {
    query = 'SELECT * FROM driver WHERE DID = ?'; 
  }

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  db.query(query, [username,password], (err, results) => {
    
    if (err) {
      return res.status(500).json({ message: 'Error checking the user.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found.' });
    }
    let r=results[0].DID;
    if(chosen_s_d=="student")
    {
      r=results[0].SID;
    }
    
    // Create and send a JWT token
    const user = { password: results[0].password, username: r };
    const token = generateToken(user); 
    return res.status(201).json({ token });
  });
  
});

module.exports = router;