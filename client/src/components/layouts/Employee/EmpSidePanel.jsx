import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../../assets/side-panel-styles/sidePanel.css";
import AlertCard from "./AlertCard";
import logo from "../../../assets/logo.jpg"

export default class EmpSidePanel extends Component {
  constructor() {
    super();

    this.state = {
      alerts: [],
    };
  }

  componentDidMount = async () => {
    const id = localStorage.getItem("userId");
    const alerts = await axios.get(`/api/users/getAlerts/${id}`);

    // console.log(alerts.data);

    this.setState({ alerts: alerts.data });
  };

  onDeleteAlert = async (reqId) => {
    console.log("deleting...: ", reqId);
    const id = localStorage.getItem("userId");
    const deletedAlert = await axios.put("/api/users/deleteAlert", {
      reqId,
      id,
    });
    console.log("deleted alert: ", deletedAlert.data);
  };

  render() {
    const currLocation = window.location.href.split("#/")[1];

    return (
      <div style={{height:"1000px",boxShadow:"0px 0px 20px rgb(187, 187, 187)"}}>
           <img src={logo} style={{marginTop:"30px",height:"120px",width:"150px",marginLeft:"30px" ,marginBottom:"30px"}} />
          {/* view my requests */}
          <Link to="/myRequests" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-ticket-alt mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "myRequests" ? <b>Dashboard</b> : "Dashboard"}
            </li>
          </Link>

          {/* view my requests */}
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-ticket-alt mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "profile" ? <b>Profile</b> : "Profile"}
            </li>
          </Link>
          
      
      
        {/* timesheet*/}

        <Link to="/attendence" style={{ textDecoration: "none" }}>
          <li className="list-group-item text-dark border-0 my-1 myList">
            <i className="fas fa-clock mr-4" style={{ fontSize: "20px" }}></i>{" "}
            {currLocation === "attendence" ? <b>Apply Leave </b> : "Apply Leave"}
          </li>
        </Link>

        {/* send requests */}
        <ul className="list-group">
          <Link to="/otherRequest" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-paper-plane mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "otherRequest" ? (
                <b>Loan</b>
              ) : (
                "Loan"
              )}
            </li>
          </Link>

        

          {/* sal details*/}
          <Link to="/mySalDetails" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-money-check-alt mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "mySalDetails" ? (
                <b>Salary Details</b>
              ) : (
                "Salary Details"
              )}
            </li>
          </Link>

              {/* sal details*/}
              <Link to="/attendence-em" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-money-check-alt mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "mySalDetails" ? (
                <b>Attentdence</b>
              ) : (
                "Attentdence"
              )}
            </li>
          </Link>


          
              {/* sal details*/}
              <Link to="/attendence-application" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-money-check-alt mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "mySalDetails" ? (
                <b>Attendece Apply</b>
              ) : (
                "Attendece Apply"
              )}
            </li>
          </Link>

          {/* company info */}
          <Link to="/companyInfo" style={{ textDecoration: "none" }}>
            <li className="list-group-item text-dark border-0 my-1 myList">
              <i
                className="fas fa-info-circle mr-4"
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {currLocation === "companyInfo" ? (
                <b>Company Info</b>
              ) : (
                "Company Info"
              )}
            </li>
          </Link>
        </ul>

        {this.state.alerts.length
          ? this.state.alerts.map((msg, index) => (
              <AlertCard
                key={index}
                data={msg}
                onDeleteAlert={this.onDeleteAlert}
              />
            ))
          : null}
      </div>
    );
  }
}
