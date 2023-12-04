import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

const StudentProfile = () => {
  const token = localStorage.getItem("token");
  const [studentData, setStudentData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudentData(response.data.studentData);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    if (token) {
      fetchStudentData();
    }
  }, [token]);

  const handleEdit = (field, value) => {
    setEditedData((prevData) => ({
     ...prevData,
     [field]: value,
    }));
   };
  

  const handleUpdate = () => {
    // Check if any edited data is empty or undefined
      const isAnyFieldEmpty = Object.values(editedData).some(
        value => value == null || value === '' || value === undefined
      );

      if (isAnyFieldEmpty) {
        console.log('Please fill in all fields before updating.');
        return;
      }

    


      // Update the edited data in the backend
      axios
        .put('http://localhost:8080/api/profile/update', editedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          // Update the local studentData state with the updated data
          setStudentData(response.data.studentData);
          setEditing(false);
          console.log(response.data.studentData);
          setEditedData({});
        })
        .catch(error => {
          console.error('Error updating student data:', error);
        });
  };
  const navigate = useNavigate();
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile?')) {
      try {
        // Delete the student profile in the backend
        await axios.delete('http://localhost:8080/api/profile/delete', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Redirect or perform other actions after deletion
        console.log('Profile deleted successfully');
        localStorage.removeItem('token');
        navigate('/'); 
      } catch (error) {
        console.error('Error deleting student profile:', error);
      }
    }
  };
  

  return (
    <div>
      <h1>Student Profile</h1>
      {studentData.map(student => (
        <div key={student.SID}>
          <p>Student ID: {student.SID}</p>
          <p>First Name: {editing ? <input type="text" value={editedData.FirstName} onChange={(e) => handleEdit('FirstName', e.target.value)} /> : student.FirstName}</p>
          <p>Last Name: {editing ? <input type="text" value={editedData.LastName } onChange={(e) => handleEdit('LastName', e.target.value)} /> : student.LastName}</p>
          <p>Email: {editing ? <input type="text" value={editedData.Email} onChange={(e) => handleEdit('Email', e.target.value)} /> : student.Email}</p>
          <p>Phone Number: {editing ? <input type="text" value={editedData.PhoneNo} onChange={(e) => handleEdit('PhoneNo', e.target.value)} /> : student.PhoneNo}</p>
            <p>Pincode: {editing ? <input type="text" value={editedData.pincode } onChange={(e) => handleEdit('pincode', e.target.value)} /> : student.pincode}</p>
          {editing ? <button onClick={handleUpdate}>Update</button> : <button onClick={() => setEditing(true)}>Edit</button>}
          <button onClick={handleDelete}>Delete Profile</button>
        </div>
      ))}
    </div>
  );
};

export default StudentProfile;
