import React, { useState } from 'react';
import EmpSidePanel from './EmpSidePanel';
import "toasted-notes/src/styles.css";
import toast from "toasted-notes";
import axios from 'axios';

const AttendanceApplication = () => {

  const id = localStorage.getItem("userId");
  const emname = localStorage.getItem("userName");
  const [name, setName] = useState(emname);
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/attendance-apply", {
        userId: id,
        name: name,
        date: date,
        role:role,
        reason:reason
      });

      toast.notify(response.data.msg, {
        position: "top",
      });
      // setCheckInSuccess(true);
      // history.push(`/attendence-checkout/${id}`); // Redirect to the home page
    } catch (error) {
      if (error.response.status === 400) {
        toast.notify("Application Already Taken", {
          position: "top",
        });
      
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <EmpSidePanel />
      <form
        onSubmit={handleSubmit}
        style={{
          width: '700px',
          height: '100vh',
          boxShadow: '0px 0px 20px rgb(212, 212, 212)',
          padding: '30px',
          borderRadius: '8px',
          marginLeft: '100px',
          marginTop: '30px',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Attendance Application Form</h2>
        <div style={{ marginBottom: '15px' }}>
          <label>Employee Name:</label>
          <input type='text' value={name} onChange={handleNameChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Role:</label>
          <select value={role} onChange={handleRoleChange} style={{ width: '100%', padding: '8px' }}>
            <option value=''>Select Role</option>
            <option value='Manager'>Manager</option>
            <option value='Employee'>Employee</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Date:</label>
          <input type='date' value={date} onChange={handleDateChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Reason:</label>
          <textarea value={reason} onChange={handleReasonChange} style={{ width: '100%', padding: '8px', minHeight: '100px' }} />
        </div>
        <button type='submit' style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>Submit</button>
      </form>
    </div>
  );
};

export default AttendanceApplication;
