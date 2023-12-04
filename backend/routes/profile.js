// Import necessary modules
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('/Users/meghanagoru/DBMS_project/backend/server.js'); // Replace with the actual path to your database module

const secretKey="meg";
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
// Endpoint to get student profiles
router.get('/', verifyToken,async (req, res) => {
  try {
    const userId = req.userData.user;
    // Fetch student data from the database using SID
    db.query('SELECT * FROM student where SID=?',[userId],(err,result)=>{
        if(err)
        {
            return res.status(500).json({message: Error});
        }
        const studentData =  result.map(result => ({
            SID: result.SID,
            FirstName: result.FirstName,
            LastName: result.LastName,
            Email: result.Email,
            PhoneNo: result.PhoneNo,
            pincode: result.pincode
          }));
      
        res.status(200).json({ studentData:studentData });
    }); // Replace with your actual query
  
    
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/update', verifyToken, async (req, res) => {
    try {
      const userId = req.userData.user;
      const { FirstName, LastName, Email, PhoneNo, pincode } = req.body;
  
      // Update student data in the database
      db.query(
        'UPDATE student SET FirstName=?, LastName=?, Email=?, PhoneNo=?, pincode=? WHERE SID=?',
        [FirstName, LastName, Email, PhoneNo, pincode, userId],
        (err, result) => {
          if (err) {
            console.error('Error updating student profile:', err);
            return res.status(500).json({ message: 'Error updating student profile' });
          }
  
          // Fetch updated student data
          db.query('SELECT * FROM student WHERE SID=?', [userId], (err, result) => {
            if (err) {
              return res.status(500).json({ message: 'Error' });
            }
            const updatedStudent = result.map(result => ({
              SID: result.SID,
              FirstName: result.FirstName,
              LastName: result.LastName,
              Email: result.Email,
              PhoneNo: result.PhoneNo,
              pincode: result.pincode
            }));
  
            res.status(200).json({ studentData: updatedStudent });
          });
        }
      );
    } catch (error) {
      console.error('Error updating student profile:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  router.delete('/delete', verifyToken, async (req, res) => {
    try {
      const userId = req.userData.user;
  
      // Check if the student exists
      const [student] = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM student WHERE SID=?', [userId], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Delete the student from the students table
      db.query('UPDATE BUSES SET Capacity=Capacity-1 where BusID =(SELECT BusID from student where SID =?)',[userId]);
      db.query('DELETE FROM student WHERE SID=?', [userId], (err) => {
        if (err) {
          console.error('Error deleting student profile:', err);
          return res.status(500).json({ message: 'Error deleting student profile' });
        }
        
        // Check and delete from payments table if necessary
        db.query('SELECT * FROM payments WHERE SID=?', [userId], (err, result) => {
            if (err) {
                return res.status(201).json({ message: 'Error deleting student profile' });
            } else {
            
              if(result.length>0){
                db.query('DELETE FROM payments WHERE SID=?', [userId], (err) => {
                    if (err) {
                    console.error('Error deleting payments:', err);
                    return res.status(500).json({ message: 'Error deleting payments' });
                    }
                    
                    res.status(200).json({ message: 'Student profile deleted successfully' });
                });
            }
            
            }
          });
        });

    } catch (error) {
      console.error('Error deleting student profile:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
module.exports = router;
