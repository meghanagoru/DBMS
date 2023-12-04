import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    role: 'student',
    SID: '',
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNo: '',
    pincode: '',
    password: '',
    username: '',
    LicenseNumber: '',
  });

  const [errors, setErrors] = useState({}); // To store validation errors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const navigate = useNavigate();
  const validateForm = () => {
    const newErrors = {};

    if (formData.role === 'student') {
      if (!formData.SID) {
        newErrors.SID = 'Student Registration Number is required';
      }
      if (!formData.Email || !/^\S+@\S+\.\S+$/.test(formData.Email)) {
        newErrors.Email = 'Valid email is required';
      }
      if (!formData.pincode) {
        newErrors.pincode = 'pincode is required';
      }
    }

    if (formData.role === 'driver') {
      if (!formData.DID) {
        newErrors.DID = 'Driver Registration Number is required';
      }
      if (!formData.LicenseNumber || !/^[A-Z]{2}\d{2}-\d{6}$/.test(formData.LicenseNumber)) {
        newErrors.LicenseNumber = 'Valid License Number is required (e.g., AB12-345678)';
      }
    }

    if (!formData.PhoneNo || !/^\d{10}$/.test(formData.PhoneNo)) {
      newErrors.PhoneNo = 'Valid 10-digit phone number is required';
    }

    if (!formData.FirstName) {
      newErrors.FirstName = 'First Name is required';
    }
    if (!formData.LastName) {
      newErrors.LastName = 'Last Name is required';
    }
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const chosen_s_d = formData.role === 'student' ? 'student' : 'driver';

        // Send a POST request to your Express API to register the user
        const response = await axios.post(`http://localhost:8080/api/register`, formData, {
          headers: {
            'Content-Type': 'application/json',
            'chosen_s_d': chosen_s_d
          },
        });

        if (response.status === 201) {
          console.log('User registered successfully');
          const token = response.data.token;
          localStorage.setItem('token', token);
          if(chosen_s_d==='student')
          {
            navigate('/');
          }
          else if(chosen_s_d==='driver')
          {
            navigate('/d_homepage');
          }
          
        } else {
          console.log(response.status);
          console.error('Error registering user:');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div>
      <h2>Register User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Role:
            <select name="role" onChange={handleInputChange} value={formData.role}>
              <option value="student">Student</option>
              <option value="driver">Driver</option>
            </select>
          </label>
        </div>
        <div>
          {formData.role === 'student' && (
            <div>
              <input
                type="text"
                name="SID"
                placeholder="Student Registration Number"
                onChange={handleInputChange}
                required
              />
              {errors.SID && <span className="error">{errors.SID}</span>}
            </div>
          )}
        </div>
        <div>
          {formData.role === 'driver' && (
            <div>
              <input
                type="text"
                name="DID"
                placeholder="Driver Registration Number"
                onChange={handleInputChange}
                required
              />
              {errors.DID && <span className="error">{errors.DID}</span>}
            </div>
          )}
        </div>
        <div>
          <input
            type="text"
            name="FirstName"
            placeholder="First Name"
            onChange={handleInputChange}
            required
          />
          {errors.FirstName && <span className="error">{errors.FirstName}</span>}
        </div>
        <div>
          <input
            type="text"
            name="LastName"
            placeholder="Last Name"
            onChange={handleInputChange}
            required
          />
          {errors.LastName && <span className="error">{errors.LastName}</span>}
        </div>
        <div>
          {formData.role === 'student' && (
            <div>
              <input
                type="text"
                name="Email"
                placeholder="Email"
                onChange={handleInputChange}
                required
              />
              {errors.Email && <span className="error">{errors.Email}</span>}
            </div>
          )}
        </div>
        <div>
          <input
            type="text"
            name="PhoneNo"
            placeholder="Phone Number"
            onChange={handleInputChange}
            required
          />
          {errors.PhoneNo && <span className="error">{errors.PhoneNo}</span>}
        </div>
        <div>
          {formData.role === 'student' && (
            <div>
              <input
                type="text"
                name="pincode"
                placeholder="pincode"
                onChange={handleInputChange}
                required
              />
              {errors.pincode && <span className="error">{errors.pincode}</span>}
            </div>
          )}
        </div>
        {formData.role === 'driver' && (
          <div>
            <input
              type="text"
              name="LicenseNumber"
              placeholder="License Number"
              onChange={handleInputChange}
              required
            />
            {errors.LicenseNumber && <span className="error">{errors.LicenseNumber}</span>}
          </div>
        )}
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleInputChange}
            required
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;