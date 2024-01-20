import React, { Component } from "react";
import { Consumer } from "../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../assets/add-emp/addEmp.css";
import AdminSidePanel from "./Admin/AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

class AddEmployee extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      name: "",
      address: "",
      phoneNo: "",
      role: "Select Role",
      team: "Select Team",
      gender: "Select Value",
      doj: "",
      disabled: false,

      // error
      errors: {
        email: "",
        name: "",
        address: "",
        phoneNo: "",
      },
    };
  }

  componentDidMount = async () => { };
  onSelectGender = (gender) => this.setState({ gender });
  onTeamSelect = (team) => this.setState({ team });
  onRoleSelect = (role) => this.setState({ role });

  validateForm = () => {
    let isValid = true;
    let errors = {};

    // Name validation
    if (!/^[A-Za-z.\s]+$/.test(this.state.name)) {
      isValid = false;
      errors.name = "Name must have String";
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(this.state.email)) {
      isValid = false;
      errors.email = "Invalid email address";
    }

    // Address validation
    if (!/^[A-Za-z0-9.,\s]+$/.test(this.state.address)) {
      isValid = false;
      errors.address = "Address must have  string";
    }


    // Phone number validation
    if (!/^\d{11}$/.test(this.state.phoneNo)) {
      isValid = false;
      errors.phoneNo = "Phone number must have exactly 11 digits";
    }

    this.setState({ errors });
    return isValid;
  };

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    if (this.validateForm()) {
      // disable signup btn
      this.setState({
        disabled: true,
      });

      const { email, name, address, phoneNo, role, team, doj, gender } =
        this.state;

      try {
        const newUser = await axios.post("/api/admin/addEmployee", {
          email,
          name,
          address,
          gender,
          phoneNo,
          role,
          team,
          doj,
        });

        toast.notify("Added new employee", {
          position: "top-right",
        });

        console.log("created acc successfully: ", newUser.data);
        this.props.history.push(`/editEmpProfile/${newUser.data._id}`);
      } catch (err) {
        // enable signup btn
        this.setState({
          disabled: false,
        });

        console.log("ERROR: ", err.response.data.msg);
        this.setState({ error: err.response.data.msg });
      }
    }
  };

  onChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });

    // Clear the corresponding validation error
    let errors = { ...this.state.errors };
    errors[name] = "";
    this.setState({ errors });
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user, dispatch, token } = value;
          if (token === undefined) token = "";

          if (token) {
            if (user.role !== "admin") return <Redirect to="/" />;
            return (
              <Spring
                from={{
                  transform: "translate3d(1000px,0,0) ",
                }}
                to={{
                  transform: "translate3d(0px,0,0) ",
                }}
                config={{ friction: 20 }}
              >
                {(props) => (
                  <>
                    <div className="row m-0">
                      <div className="col-2 p-0 leftPart">
                        <AdminSidePanel />
                      </div>
                      <div
                        className="col"
                        style={{
                          display: "flex ",
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <div style={props}>
                          <form
                            className="addEmpForm"
                            onSubmit={this.onSubmit.bind(this, dispatch)}
                          >
                            <h3 className="">ADD EMPLOYEE</h3>
                            <hr />

                            <div className="row">
                              <div className="col">
                                <label htmlFor="name">Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  className="form-control"
                                  placeholder="Employee Name"
                                  onChange={this.onChange}
                                  required
                                />
                                {this.state.errors.name && (
                                  <div className="text-danger">
                                    {this.state.errors.name}
                                  </div>
                                )}

                              </div>
                              <div className="col">
                                <label htmlFor="email">Email</label>
                                <input
                                  type="email"
                                  name="email"
                                  className="form-control mb-3 "
                                  placeholder="Employee Email"
                                  onChange={this.onChange}
                                  required
                                />
                                {this.state.errors.email && (
                                  <div className="text-danger">
                                    {this.state.errors.email}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="row">
                              <div className="col">
                                <label htmlFor="address">Address</label>
                                <textarea
                                  name="address"
                                  id="address"
                                  rows="1"
                                  className="form-control mb-3 "
                                  placeholder="Employee Address"
                                  onChange={this.onChange}
                                  required
                                />
                                {this.state.errors.address && (
                                  <div className="text-danger">
                                    {this.state.errors.address}
                                  </div>
                                )}
                              </div>
                              <div className="col">
                                <label htmlFor="phoneNo">Phone No.</label>
                                <input
                                  type="number"
                                  name="phoneNo"
                                  className="form-control mb-3 "
                                  placeholder="Employee Phone"
                                  onChange={this.onChange}
                                  required
                                />
                                {this.state.errors.phoneNo && (
                                  <div className="text-danger">
                                    {this.state.errors.phoneNo}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="row">
                              <div className="col">
                                <label>Team</label>
                                <div className="dropdown">
                                  <button
                                    style={{
                                      width: "355px",
                                      border: "1px solid #B2ACAB",
                                    }}
                                    className="btn btn-light dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    {this.state.team}
                                  </button>
                                  <div
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuButton"
                                  >
                                    <li
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item"
                                      onClick={() =>
                                        this.onTeamSelect("Administration")
                                      }
                                    >
                                      Administration
                                    </li>
                                    <li
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item"
                                      onClick={() => this.onTeamSelect("IT")}
                                    >
                                      IT
                                    </li>
                                    <li
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item"
                                      onClick={() =>
                                        this.onTeamSelect("Marketing")
                                      }
                                    >
                                      Marketing
                                    </li>
                                  </div>
                                </div>
                              </div>
                              <div className="col">
                                <label>Role</label>
                                <div className="dropdown">
                                  <button
                                    style={{
                                      width: "355px",
                                      border: "1px solid #B2ACAB",
                                    }}
                                    className="btn btn-light dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    {this.state.role}
                                  </button>
                                  <div
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuButton"
                                  >
                                    <li
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item"
                                      onClick={() => this.onRoleSelect("CEO")}
                                    >
                                      CEO
                                    </li>
                                    <li
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item"
                                      onClick={() =>
                                        this.onRoleSelect("Manager")
                                      }
                                    >
                                      Manager
                                    </li>
                                    <li
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item"
                                      onClick={() =>
                                        this.onRoleSelect("Software Engineer")
                                      }
                                    >
                                      Software Engineer
                                    </li>
                                    <li
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item"
                                      onClick={() =>
                                        this.onRoleSelect("Digital Marketing")
                                      }
                                    >
                                      Digital Marketing
                                    </li>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col">
                                <label htmlFor="doj">Date Of Joining</label>
                                <input
                                  type="date"
                                  name="doj"
                                  className="form-control mb-3"
                                  placeholder="doj"
                                  onChange={this.onChange}
                                  required
                                  min={new Date().toISOString().split('T')[0]} 
                                />

                              </div>
                              <div className="col">
                                <label>Gender</label>
                                <div className="dropdown">
                                  <button
                                    style={{
                                      width: "355px",
                                      border: "1px solid #B2ACAB",
                                    }}
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
                                      style={{ cursor: "pointer" }}
                                      className="dropdown-item"
                                      onClick={() =>
                                        this.onSelectGender("Male")
                                      }
                                    >
                                      Male
                                    </li>
                                    <li
                                      style={{ cursor: "pointer" }}
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
                            <input
                              style={{ width: "150px", marginLeft: "300px" }}
                              disabled={this.state.disabled}
                              type="submit"
                              value="Submit"
                              className="btn btn-primary btn-block "
                            />
                          </form>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Spring>
            );
          } else {
            return <Redirect to="/login" />;
          }
        }}
      </Consumer>
    );
  }
}

export default AddEmployee;
