import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmpSidePanel from "./EmpSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import "../../../assets/attendence-style/attendence.css";
import { useHistory } from "react-router-dom";

const AttendenceCheckout = () => {
  const { userId } = useParams();
  const history = useHistory();
  const [attendanceData, setAttendanceData] = useState({});
  const [totalHrs, setTotalHrs] = useState();
  const [status, setStatus] = useState("Pending");
  const [timeDifference, setTimeDifference] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/attendance/${userId}`);
        setAttendanceData(response.data.attendance);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId]);

  const { _id, timeIn, date, month } = attendanceData;

  const [currentTime, setCurrentTime] = useState(timeIn);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    calculateTimeDifference();
  }, [timeIn, currentTime]);

  const calculateTimeDifference = () => {
    const startDate = new Date(`2000-01-01 ${timeIn}`);
    const endDate = new Date(`2000-01-01 ${currentTime}`);
    const difference = endDate.getTime() - startDate.getTime();

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeDifference(`${hours} hours, ${minutes} minutes, ${seconds} seconds`);
    setTotalHrs(hours);

    if (hours >= 8) {
      setStatus("present");
    } else {
      setStatus("absent");
    }
  };

  console.log("time diff:", timeDifference);

  const updateAttendanceRecord = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/attendance/${_id}`, {
        date: date,
        month: month,
        timeIn: timeIn,
        timeOut: currentTime,
        totalHrs: totalHrs,
        status: status,
      });

      toast.notify(response.data.msg, {
        position: "top",
      });
     
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
    <div className="atten-container">
      <EmpSidePanel />
      <form className="atten-form" onSubmit={updateAttendanceRecord}>
        <h3 style={{ textAlign: "center" }}>SEE YOU TOMOROW IN OFFICE</h3>
        <div className="clock-analog">
          <div className="clock-digital">
            <div className="time">{currentTime}</div>
          </div>
        </div>
        <button className="atten-btn" type="submit">
          CHECK OUT
        </button>
      </form>
    </div>
  );
};

export default AttendenceCheckout;
