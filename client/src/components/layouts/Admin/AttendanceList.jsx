import React, { useState, useEffect } from 'react';
import "../../../assets/attendence-style/attentdenceList.css"
import AdminSidePanel from "./AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import axios from 'axios';

const AttendanceList = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [editableRows, setEditableRows] = useState({});



  useEffect(() => {
    fetch('/api/admin/attendance')
      .then(response => response.json())
      .then(data => setAttendanceData(data))
      .catch(error => console.error('Error fetching attendance:', error));
  }, []);

  const filteredData = attendanceData.filter(record => {
    const matchDate = record?.date?.includes(searchDate);
    const matchName = record?.name?.toLowerCase().includes(searchName.toLowerCase());
    const matchMonth = selectedMonth ? record?.month?.includes(selectedMonth) : true;
    return matchDate && matchName && matchMonth;
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const day = date.getDate();
    
    return `${day} ${month} ${year}`;
  }

  const handleTimeInChange = (e, id) => {
    const updatedData = attendanceData.map((record) => {
      if (record._id === id) {
        return { ...record, timeIn: e.target.value };
      }
      return record;
    });
    setAttendanceData(updatedData);
  };

  const handleTimeOutChange = (e, id) => {
    const updatedData = attendanceData.map((record) => {
      if (record._id === id) {
        return { ...record, timeOut: e.target.value };
      }
      return record;
    });
    setAttendanceData(updatedData);
  };

  const handleStatusChange = (e, id) => {
    const updatedData = attendanceData.map((record) => {
      if (record._id === id) {
        return { ...record, status: e.target.value };
      }
      
      return record;
    });
    setAttendanceData(updatedData);
  };

  const handleUpdate =async(record) => {
    const updatedEditableRows = { ...editableRows };
    updatedEditableRows[record._id] = !editableRows[record._id];
    setEditableRows(updatedEditableRows);
  
    try {
      const { date, month, status, timeIn,timeOut } = attendanceData.find(
        (data) => data._id === record._id
      );
  
      const updatedRecord = {
        date, 
        month,
        status, 
        timeIn,
        totalHrs: "8",
        timeOut
      };
      console.log("updatedRecord",updatedRecord);
  
      const response = await axios.put(`/attendance/${record._id}`, {
        date,
        month,
        timeIn,
        timeOut,
        totalHrs: "8",
        status
      });
  
      console.log("Response:", response);
  
      toast.notify(response.data.msg, {
        position: "top",
      });
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.notify("Can not Update Attendance", {
          position: "top",
        });
        console.error("Server Error:", error.response.data); // Log the server error response
      } else {
        console.error("Network Error:", error); // Log other types of errors
      }
    }
  };
  

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/attendance/${id}`);
      console.log(response.data.msg); // Log the success message

      // Remove the deleted record from the state
      setAttendanceData(attendanceData.filter(record => record._id !== id));

      toast.notify(response.data.msg, {
        position: "top",
      });
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.notify("Can not delete Attendance", {
          position: "top",
        });
        console.error("Server Error:", error.response.data); // Log the server error response
      } else {
        console.error("Network Error:", error); // Log other types of errors
      }
    }
  };


  return (
    <div style={{ display: 'flex' }}>
      <AdminSidePanel />
      <div>
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>Attendance Records</h2>

        {/* Search Inputs */}
        <div style={{ marginBottom: '10px', marginLeft: "100px", marginTop: "20px" }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{width:"200px",height:"40px",padding:"5px"}}
          >
            <option value="">Select Month</option>
            {monthNames.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by Date"
            value={searchDate}
            onChange={e => setSearchDate(e.target.value)}
            style={{width:"200px",height:"40px",padding:"5px",marginLeft: "10px"}}
          />
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            style={{width:"200px",height:"40px",padding:"5px",marginLeft: "10px"}}
          />
        </div>

        {/* Table */}
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(record => (
              <tr key={record._id}>
                <td>{formatDate(record.date)}</td>
                <td>{record.name}</td>
                {editableRows[record._id] ? (
              <>
                <td>
                  <input
                    type="text"
                    value={record.timeIn}
                    onChange={(e) => handleTimeInChange(e, record._id)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={record.timeOut}
                    onChange={(e) => handleTimeOutChange(e, record._id)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={record.status}
                    onChange={(e) => handleStatusChange(e, record._id)}
                  />
                </td>
                <td>
                  <button
                    style={{
                      backgroundColor: 'green',
                      border: 'none',
                      borderRadius: '5px',
                      color: 'white',
                      padding: '5px',
                    }}
                    onClick={() => handleUpdate(record)}
                  >
                    Update
                  </button>
                </td>
              </>
            ) : (
              <>
                <td>{record.timeIn}</td>
                <td>{record.timeOut}</td>
                <td>{record.status}</td>
                <td>
                  <button
                    style={{ backgroundColor: 'green', border: 'none', borderRadius: '5px', color: 'white', padding: '5px' }}
                    onClick={() => {
                      const updatedEditableRows = { ...editableRows };
                      updatedEditableRows[record._id] = !editableRows[record._id];
                      setEditableRows(updatedEditableRows);
                    }}
                  >
                    {editableRows[record._id] ? "Update" : "Edit"}
                  </button>
                </td>
              </>
            )}
               
                <td>
                  <button
                   style={{ backgroundColor: 'red', border: 'none', borderRadius: '5px', color: 'white', padding: '5px' }}
                   onClick={() => handleDelete(record._id)}
                   >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
