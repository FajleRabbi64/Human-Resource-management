import React, { useEffect, useState } from "react";
import axios from "axios";
import EmpSidePanel from "./EmpSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import "../../../assets/attendence-style/attendence.css";
import checkin from "../../../assets/checkin.jpeg";
import { useHistory } from "react-router-dom";
import AttendenceCheckout from "./AttendenceCheckout";

const AttendanceForm = () => {
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [date, setDate] = useState("");
  const [timeIn, setTimeIn] = useState("");
  const [month, setMonth] = useState("");
  const id = localStorage.getItem("userId");
  const name = localStorage.getItem("userName");
  const timeOut = "Pending";
  const totalHrs = "Pending";
  const status = "Pending";
  const history = useHistory(); 

  useEffect(() => {
    const loginTime = new Date();
    const hours = loginTime.getHours();
    const minutes = loginTime.getMinutes();
    const seconds = loginTime.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    const formattedTime = `${hours % 12}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
  
    // setTimeIn(formattedTime);
    setTimeIn(new Date().toLocaleTimeString());
  
    const today = new Date();
    const year = today.getFullYear();
    const monthIndex = today.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(today.getDate()).padStart(2, '0');
  
    const formattedDate = `${year}-${month}-${day}`;
    setDate(formattedDate);
    setMonth(monthNames[monthIndex]);
  }, []);

  const onGetDate = () => {
    const d = new Date();
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    return `${da} ${mo} ${ye}`;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/attendance", {
        userId: id,
        name: name,
        date: date,
        month:month,
        timeIn: timeIn,
        timeOut: timeOut,
        totalHrs: totalHrs,
        status: status,
      });

      toast.notify(response?.data?.msg, {
        position: "top",
      });
      setCheckInSuccess(true);
      history.push(`/attendence-checkout/${id}`); // Redirect to the home page
    } catch (error) {
      if (error?.response?.status === 400) {
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
      {!checkInSuccess ? (
         <form className="atten-form" onSubmit={handleSubmit}>
         <h3 style={{textAlign:"center"}}>WELCOME IN OFFICE</h3>
         <p className="mt-4 " style={{ fontSize: "34px",marginLeft:"100px" }}>
                                 {" "}
                                 <i className="fas fa-calendar-alt"></i>{" "}
                                 {onGetDate()}
                               </p>
         <img className="ateen-img" src={checkin} alt="not found" />
         <button className="atten-btn" type="submit">CHECK IN</button>
       </form>
      ):(
        <AttendenceCheckout />
      )}
   
   </div>
  );
};

export default AttendanceForm;
