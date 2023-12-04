import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './payment.css'; // Import the CSS file

const Payment = () => {
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/payment", {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setPayments(response.data.payments);
        console.log(payments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    if (isLoggedIn) {
      fetchPayments();
    }
  }, [token, isLoggedIn]);

  return (
    <div>
      <h2>Payment Information</h2>
      {Array.isArray(payments) && payments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Payment Date</th>
              <th>Payment Method</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.paymentId}>
                <td>{payment.paymentId}</td>
                <td>{payment.paymentDate}</td>
                <td>{payment.paymentMethod}</td>
                <td>{payment.Amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Payment not done yet. Please go to the pesuacademy website and make it.Bus will not pick you up.</p>
     
      )}
    </div>
  );
};
export default Payment;