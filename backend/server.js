const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
const cors = require("cors");

app.use(cors());
// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'meg',
  database: 'DBMS_final', // Your database name
});


db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + db.threadId);
});

module.exports = db;
// Middleware to parse JSON requests
app.use(bodyParser.json());

// Define your API routes and handlers here
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const homepageRoutes = require('./routes/homepage');
const profileRoutes = require('./routes/profile');
const paymentRoutes = require('./routes/payments');
const dhomeRoutes = require('./routes/d_homepage.js');
// Include the routes using app.use
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/home', homepageRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/driver-info',dhomeRoutes);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
