import React, { useState, useEffect } from "react";
import "../../../assets/attendence-style/attentdenceList.css";
import AdminSidePanel from "./AdminSidePanel";
import axios from "axios";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

const AttendenceApplyList = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    // Fetch attendance data
    fetch("/api/admin/attendance-apply")
      .then((response) => response.json())
      .then((data) => setAttendanceData(data))
      .catch((error) => console.error("Error fetching attendance:", error));
  }, []);

  const filteredData = attendanceData.filter((record) => {
    const matchDate = record.date.includes(searchDate);
    const matchName = record.name
      .toLowerCase()
      .includes(searchName.toLowerCase());

    return matchDate && matchName;
  });

  console.log("filteredData:",filteredData)

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const day = date.getDate();

    return `${day} ${month} ${year}`;
  };

  const handleDelete = async (id) => {
    console.log("id:", id);
    try {
      const response = await axios.delete(`/attendance-apply/${id}`);
      console.log(response.data.msg); 
      toast.notify(response.data.msg, {
        position: "top-right",
      });
      setAttendanceData(attendanceData.filter((record) => record._id !== id));
    } catch (error) {
      console.error("Error while deleting:", error);
    }
  };

  const handleApprove = async (record) => {
    try {
      const response = await axios.post("/attendance", {
        userId: record.userId,
        name: record.name,
        date: record.date,
        month:"December",
        timeIn: "9:00:07 AM",
        timeOut:  "5:00:47 PM",
        totalHrs: "8",
        status: "present",
      });

      toast.notify(response.data.msg, {
        position: "top",
      });
      // setCheckInSuccess(true);
      // history.push(`/attendence-checkout/${id}`); // Redirect to the home page
    } catch (error) {
      if (error.response.status === 400) {
        toast.notify("Check In Already Taken", {
          position: "top",
        });
      
      } else {
        console.error(error);
      }
    }
  };


  return (
    <div style={{ display: "flex" }}>
      <AdminSidePanel />
      <div>
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>
          Attendance Application{" "}
        </h2>

        {/* Search Inputs */}
        <div
          style={{
            marginBottom: "10px",
            marginLeft: "100px",
            marginTop: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Search by Date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            style={{
              width: "200px",
              height: "40px",
              padding: "5px",
              marginLeft: "10px",
            }}
          />
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{
              width: "200px",
              height: "40px",
              padding: "5px",
              marginLeft: "10px",
            }}
          />
        </div>

        {/* Table */}
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Role</th>
              <th>Reason</th>
              <th>Approve</th>
              <th>Reject</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record) => (
              <tr key={record._id}>
                <td>{formatDate(record.date)}</td>
                <td>{record.name}</td>
                <td>{record.role}</td>
                <td>{record.reason}</td>

                <td>
                  <button
                    style={{
                      backgroundColor: "purple",
                      border: "none",
                      borderRadius: "5px",
                      color: "white",
                      padding: "5px",
                    }}
                    onClick={() => handleApprove(record)}
                  >
                    Approve
                  </button>
                </td>
                <td>
                  <button
                    style={{
                      backgroundColor: "red",
                      border: "none",
                      borderRadius: "5px",
                      color: "white",
                      padding: "5px",
                    }}
                    onClick={() => handleDelete(record._id)}
                  >
                    Reject
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

export default AttendenceApplyList;
