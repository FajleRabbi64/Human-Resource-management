import axios from "axios";
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Spring } from "react-spring/renderprops";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import { Consumer } from "../../../context";
import LoanDetailsCard from "./LoanDetailsCard";

export default class EditEmpProfile extends Component {
  constructor() {
    super();
    this.state = {
      //form
      id: "",
      name: "",
      phoneNo: "",
      email: "",
      gender: "",
      address: "",
      role: "",
      team: "",
      doj: "",

      // teams and roels
      teamList: [],
      roleList: [],

      // sal details
      basicPay: "",
      totalLeaves: "",
      travelAllowance: "",
      medicalAllowance: "",
      bonus: "",
      salary: "",

      // loan details
      empLoanHistory: [],
      attendanceData: [],
      filteredAttendanceData: [],
    };
  }

  componentDidMount = async () => {


    const userId = this.props.match.params.id;
    axios.get('/api/admin/attendance')
      .then(response => {
        this.setState({ attendanceData: response.data }, () => {
          this.filterAttendanceData(); // Call filter function after data is loaded
        });
      })
      .catch(error => {
        console.error('Error fetching attendance:', error);
      });

    const userData = await axios.get(`/api/admin/getUserData/${userId}`);
    const userSalData = await axios.get(
      `/api/admin/getUserSalDetails/${userId}`
    );
    const teamAndRoleList = await axios.get("/api/admin/getTeamsAndRoles");
    const empLoanHistory = await axios.get(
      `/api/admin/getEmpLoanHistory/${userId}`
    );

    this.setState({
      // form
      id: userData.data._id,
      name: userData.data.name,
      address: userData.data.address,
      gender: userData.data.gender,
      email: userData.data.email,
      role: userData.data.role,
      team: userData.data.team,
      phoneNo: userData.data.phoneNo,
      objective: userData.data.objective,
      doj: userData.data.doj,

      // sal details
      basicPay: userSalData.data.basicPay,
      totalLeaves: userSalData.data.totalLeaves,
      travelAllowance: userSalData.data.travelAllowance,
      medicalAllowance: userSalData.data.medicalAllowance,
      bonus: userSalData.data.bonus,
      salary: userSalData.data.salary,

      // loan details
      empLoanHistory: empLoanHistory.data,

    });


    // Check if one year has passed since joining
    const dojDate = new Date(this.state.doj);
    const currentDate = new Date();
    const yearDiff = currentDate.getFullYear() - dojDate.getFullYear();

    if (yearDiff >= 1) {
      // Calculate the new basic pay with 25% increment
      let currentBasicPay = parseFloat(this.state.basicPay);

      // Apply a 25% increment for each year after the first year
      for (let i = 1; i <= yearDiff; i++) {
        currentBasicPay *= 1.25;
      }

      // Update the state with the new basic pay
      this.setState({
        basicPay: currentBasicPay,
      });

      // Recalculate salary with the new basic pay
      const totalSal =
        currentBasicPay +
        parseInt(this.state.travelAllowance) +
        parseInt(this.state.medicalAllowance) +
        parseInt(this.state.bonus);
      this.setState({
        salary: totalSal,
      });
    }
    if (this.state.filteredAttendanceData.length > 0) {
      let currentBasicPay = parseFloat(this.state.basicPay);
      const newBasicPay = currentBasicPay - (currentBasicPay/ 30) * this.state.filteredAttendanceData.length;
      const totalSal =
        newBasicPay +
        parseInt(this.state.travelAllowance) +
        parseInt(this.state.medicalAllowance) +
        parseInt(this.state.bonus);

      this.setState({
        basicPay: newBasicPay,
        salary: totalSal,
      });
    }
  };

  filterAttendanceData = () => {
    const userId = this.props.match.params.id;
    const { attendanceData } = this.state;
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const absent = "absent"
    const filteredData = attendanceData.filter(item => {
      return item.userId === userId && item.month === currentMonth && item.status == absent;
    });

    this.setState({
      filteredAttendanceData: filteredData,
    });
  };


  onDelete = async () => {
    try {
      const adminId = localStorage.getItem("userId");
      const deletedEmp = await axios.delete(
        `/api/admin/delete/${this.state.id}`,
        {
          data: {
            adminId: adminId,
          },
        }
      );

      toast.notify("Deleted profile successfully", {
        position: "top-right",
      });

      console.log("deleted: ", deletedEmp.data);
      this.props.history.push("/viewEmployees");
    } catch (e) {
      console.log("Error", e);
    }
  };

  updateProfile = async (e) => {
    e.preventDefault();

    const updatedUser = {
      name: this.state.name,
      email: this.state.email,
      gender: this.state.gender,
      address: this.state.address,
      role: this.state.role,
      phoneNo: this.state.phoneNo,
      team: this.state.team,
      objective: this.state.objective,
      doj: this.state.doj,
    };

    try {
      const res = await axios.post("/api/users/updateProfile", {
        user: updatedUser,
        id: this.state.id,
      });

      toast.notify("Updated profile", {
        position: "top-right",
      });

      console.log(res.data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  updateSalDetails = async () => {
    const updatedSal = {
      basicPay: this.state.basicPay,
      totalLeaves: this.state.totalLeaves,
      travelAllowance: this.state.travelAllowance,
      medicalAllowance: this.state.medicalAllowance,
      bonus: this.state.bonus,
      salary: this.state.salary,
    };

    const res = await axios.put(
      `/api/admin/updateSalaryDetails/${this.state.id}`,
      {
        salDetails: updatedSal,
      }
    );

    toast.notify("Updated salary details", {
      position: "top-right",
    });

    const dojDate = new Date(this.state.doj);
    const currentDate = new Date();
    const yearDiff = currentDate.getFullYear() - dojDate.getFullYear();
    console.log('Year Difference:', yearDiff);


    if (yearDiff >= 1) {
      // Increment basicPay by 25%
      const newBasicPay = parseFloat(this.state.basicPay) * 1.25;
      this.setState({ basicPay: newBasicPay });

      // Recalculate salary
      const totalSal =
        newBasicPay +
        parseInt(this.state.travelAllowance) +
        parseInt(this.state.medicalAllowance) +
        parseInt(this.state.bonus);
      this.setState({ salary: totalSal });
    }
    this.props.history.push("/viewEmployees");
  };

  onSelectGender = (gender) => this.setState({ gender });

  onTeamSelect = (team) => this.setState({ team });

  onRoleSelect = (role) => this.setState({ role });

  onCalSal = (e) => {
    e.preventDefault();
    let totalSal = 0;
    const { basicPay, totalLeaves, travelAllowance, medicalAllowance, bonus } =
      this.state;

    totalSal =
      parseInt(basicPay) +
      parseInt(travelAllowance) +
      parseInt(medicalAllowance) +
      parseInt(bonus);

    const perDaySal = totalSal / 30;
    if (totalLeaves > 3) {
      totalSal -= parseInt((totalLeaves - 3) * perDaySal);
    }
    this.setState({ salary: totalSal });
  };

  onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

  onMarkAsPaid = async (loanDetails) => {
    console.log("loan details: ", loanDetails);
    try {
      const paidLoan = await axios.put("/api/admin/loanPaid", {
        loanId: loanDetails._id,
        empId: loanDetails.empId,
        reqId: loanDetails.reqId,
      });

      toast.notify("Successfully marked loan as paid", {
        position: "top-right",
      });

      // update state to refresh data on this page
      let empLoanHistory = this.state.empLoanHistory;

      empLoanHistory.forEach((loan) => {
        if (loan.reqId === loanDetails.reqId) {
          loan.loanRepaid = true;
        }
      });

      this.setState({
        empLoanHistory,
      });

      console.log("marked as paid: ", paidLoan.data);
    } catch (e) {
      console.log(e);
    }
  };

  onUpdateLoanDetails = async () => { };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    const filteredAttendanceData = this.state.filteredAttendanceData;
    return (
      <Consumer>
        {(value) => {
          let { user } = value;

          const token = localStorage.getItem("auth-token");

          if (!token) return <Redirect to="/login" />;
          if (user && user.role !== "admin")
            return <Redirect to="/empDashBoard" />;

          return (
            <Spring
              from={{ opacity: 0 }}
              to={{ opacity: 1 }}
              config={{ duration: 300 }}
            >
              {(props) => (
                <div className="container" style={props}>
                  <div className="row m-0">
                    {/* col 1*/}
                    <div className="col">
                      <div className="row">
                        {/* profile details */}
                        <div className="col">
                          <form
                            className="addEmpForm"
                            onSubmit={this.updateProfile.bind(this)}
                          >
                            <h3>Employee Profile</h3>
                            <hr />

                            <div className="row">
                              <div className="col">
                                {/* name */}
                                <label htmlFor="name">Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  className="form-control"
                                  value={this.state.name}
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              <div className="col">
                                {/* email */}
                                <label htmlFor="email">Email</label>
                                <input
                                  type="email"
                                  name="email"
                                  value={this.state.email}
                                  className="form-control mb-3 "
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="row">
                              <div className="col">
                                {/* address */}
                                <label htmlFor="address">Address</label>
                                <textarea
                                  name="address"
                                  value={this.state.address}
                                  id="address"
                                  rows="1"
                                  className="form-control mb-3 "
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              <div className="col">
                                {/* phone no */}
                                <label htmlFor="phoneNo">Phone No.</label>
                                <input
                                  type="number"
                                  value={this.state.phoneNo}
                                  name="phoneNo"
                                  className="form-control mb-3 "
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="row">
                              {/* team */}
                              <div className="col">
                                <label htmlFor="team">Team</label>
                                <div className="dropdown">
                                  <button
                                    className="btn btn-light dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    {this.state.team}
                                  </button>
                                </div>
                              </div>

                              {/* role */}
                              <div className="col">
                                <label htmlFor="role">Role</label>
                                <div className="dropdown mb-3">
                                  <button
                                    className="btn btn-light dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    {this.state.role}
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              {/* doj */}
                              <div className="col">
                                <label htmlFor="doj">Date Of Joining</label>
                                <input
                                  type="date"
                                  name="doj"
                                  value={this.state.doj}
                                  className="form-control mb-3 "
                                  onChange={this.onChange}
                                  required
                                />
                              </div>

                              {/* gender */}
                              <div className="col">
                                <div className="col">
                                  <label>Gender</label>
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-light dropdown-toggle"
                                      type="button"
                                      id="dropdownMenuButton"
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      {this.state.gender}
                                    </button>
                                    <div
                                      className="dropdown-menu"
                                      aria-labelledby="dropdownMenuButton"
                                    >
                                      <li
                                        className="dropdown-item"
                                        onClick={() =>
                                          this.onSelectGender("Male")
                                        }
                                      >
                                        Male
                                      </li>
                                      <li
                                        className="dropdown-item"
                                        onClick={() =>
                                          this.onSelectGender("Female")
                                        }
                                      >
                                        Female
                                      </li>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <input
                              disabled={this.state.disabled}
                              type="submit"
                              value="Submit"
                              className="btn btn-primary btn-block "
                            />
                          </form>
                        </div>
                      </div>

                      <div className="row mb-5">
                        {/* emp loan history */}
                        <div className="col">
                          {this.state.empLoanHistory.length ? (
                            <form
                              className="addEmpForm"
                              style={{ height: "460px", overflowY: "scroll" }}
                            >
                              <h3>Employee Loan History</h3>
                              <hr />

                              {this.state.empLoanHistory.map((loan) => (
                                <LoanDetailsCard
                                  key={loan.reqId}
                                  isAdmin={
                                    user && user.role === "admin" ? true : false
                                  }
                                  loanDetails={loan}
                                  onGetDate={this.onGetDate}
                                  onMarkAsPaid={this.onMarkAsPaid}
                                />
                              ))}
                            </form>
                          ) : // <div className="addEmpForm">
                            //   <h3>No loan history available</h3>
                            // </div>
                            null}
                        </div>
                      </div>
                    </div>

                    {/* salary details col2 */}
                    <div className="col">
                      <form className="addEmpForm">
                        <h3>Employee Salary Details</h3>
                        <hr />
                        <div className="form-group">
                          <label htmlFor="basicPay">Basic Pay</label>
                          <input
                            name="basicPay"
                            type="number"
                            className="form-control"
                            id="basicPay"
                            value={this.state.basicPay}
                            onChange={this.onChange}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="travelAllowance">
                            Travel Allowance
                          </label>
                          <input
                            name="travelAllowance"
                            type="number"
                            className="form-control"
                            id="travelAllowance"
                            value={this.state.travelAllowance}
                            onChange={this.onChange}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="medicalAllowance">
                            Medical Allowance
                          </label>
                          <input
                            name="medicalAllowance"
                            type="number"
                            className="form-control"
                            id="medicalAllowance"
                            value={this.state.medicalAllowance}
                            onChange={this.onChange}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="bonus">Bonus</label>
                          <input
                            name="bonus"
                            type="number"
                            min="0"
                            className="form-control"
                            id="bonus"
                            value={this.state.bonus}
                            onChange={this.onChange}
                          />
                        </div>

                        <p>Total leaves: {this.state.totalLeaves}</p>

                        <div className="input-group mb-3">
                          <input
                            type="text"
                            className="form-control"
                            disabled={true}
                            defaultValue={this.state.salary}
                            aria-label="Recipient's username"
                            aria-describedby="button-addon2"
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-primary"
                              type="button"
                              id="button-addon2"
                              onClick={this.onCalSal}
                            >
                              Calculate Salary
                            </button>
                          </div>
                        </div>

                        <input
                          type="button"
                          className="btn btn-primary btn-block"
                          onClick={this.updateSalDetails}
                          value="Update Salary Details"
                        />
                      </form>
                    </div>

                    {/* option col 3 */}
                    <div className="col-1 mt-5">
                      <input
                        className="btn btn-danger"
                        type="button"
                        value="Delete profile"
                        onClick={this.onDelete}
                      />

                      <Link to="/statistics">
                        <input
                          className="btn btn-primary mt-3"
                          type="button"
                          value="Go to Dashboard"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </Spring>
          );
        }}
      </Consumer>
    );
  }
}
