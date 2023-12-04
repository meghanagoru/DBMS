import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import './login.css'; // Import the CSS file
const Login = ({setToken}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    role: 'student',
    password: '',
    username: '',
  
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const navigate = useNavigate();

    // Make a POST request to the login API
    const handleSubmit =  async (e) => {
      e.preventDefault();
    
      try {
        const chosen_s_d = formData.role === 'student' ? 'student' : 'driver';

        const response = await axios.post("http://localhost:8080/api/login", {
          username,
          password,
        }, {
          headers: {
            'chosen_s_d': chosen_s_d
          },
        });
        
        console.log(response.status);
        if (response.status === 201) {
          const token = response.data.token;
          localStorage.setItem("token", token);
          setToken(token);
          if(chosen_s_d==='student')
          {
            navigate('/');
          }
          else if(chosen_s_d==='driver')
          {
            navigate('/d_homepage');
          }
        } 
        else if (response.status === 401) {
          alert("Invalid username or password");
        }
        else {
          alert("Invalid username or password");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing your request.");
      }
    };

return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <div>
          <label>
            Role:
            <select name="role" onChange={handleInputChange} value={formData.role}>
              <option value="student">Student</option>
              <option value="driver">Driver</option>
            </select>
          </label>
        </div>
      <input
        type="text"
        placeholder="ID"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
