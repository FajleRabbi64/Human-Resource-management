import axios from "axios";
import React, { Component } from "react";
import { Consumer } from "../../../context";
import { v4 as uuidv4 } from "uuid";
import { Redirect } from "react-router-dom";
import EmpSidePanel from "./EmpSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import classNames from "classnames";
import { Spring } from "react-spring/renderprops";

export default class Attendence extends Component {
  constructor() {
    super();

    this.state = {
      subject: "",
      fromDate: "",
      toDate: "",
      reason: "",
      attachFile: false,
      attachmentName: "",
      file: "",
      errors: {}
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = async (user, e) => {
    e.preventDefault();
     const subjectPattern = /^[A-Za-z\s]+$/;
     const reasonPattern = /^[A-Za-z\s]+$/;
     const errors = {};
     if (!subjectPattern.test(this.state.subject)) {
       errors.subject = "Subject must have string";
     }
    if (!reasonPattern.test(this.state.reason)) {
       errors.reason = "Reason must have string";
     }
     if (Object.keys(errors).length > 0) {
       this.setState({ errors });
       return;
     }

    const fromDate = new Date(this.state.fromDate);
    const toDate = new Date(this.state.toDate);
    const durationInDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));
     
    console.log("durationInDays:",durationInDays);

    if (durationInDays < 3) {
      errors.fromDate = "Duration must be at least 3 days";
      errors.toDate = "Duration must be at least 3 days";
    }

    if (!this.state.file && durationInDays >= 3) {
      toast.notify("File upload is required for durations less than 3 days", {
        position: "top-right",
      });
      this.setState({ errors });
      return;
    }
   
    console.log("File:",this.state.file);

     this.setState({ errors: {} });
     if (this.state.file) {
      const data = new FormData();
      data.append("file", this.state.file);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
    try {
        const fileUploadRes = await axios.post(
          "/api/users/uploadfile",
          data,
          config
        );
        this.setState({ attachmentName: fileUploadRes.data.filename });
      } catch (err) {
        console.log(err);
      }
    }

    const request = {
      title: "leave request",
      reqId: uuidv4(),
      empId: user._id,
      empName: user.name,
      gender: user.gender,
      empRole: user.role,
      empTeam: user.team,
      subject: this.state.subject,
      empEmail: user.email,
      date: new Date(),
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      reason: this.state.reason,
      attachmentName: this.state.attachmentName,
      approved: false,
      ticketClosed: false,
    };
    const res = await axios.put("/api/users/applyLeave", {
      request,
    });

    toast.notify("Successfully submitted Leave request", {
      position: "top-right",
    });
    this.props.history.push("/myRequests");
  };

  onFileChange = (e) => {
    try {
      console.log(e.target.files[0]);
      this.setState({
        file: e.target.files[0],
        attachmentName: e.target.files[0].name,
      });
    } catch (e) {
      console.log(e);
    }
  };

  clearFile = (e) => {
    e.preventDefault();
    console.log("clearing...");
    this.fileInput.value = "";
    this.setState({ file: "", attachmentName: "" });
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;
          const token = localStorage.getItem("auth-token");
          if (!token) return <Redirect to="/login" />;

          if (user && user.role === "admin") return <Redirect to="/" />;

          return (
            <Spring
              // from={{ opacity: 0 }}
              // to={{ opacity: 1 }}
              // config={{ duration: 300 }}
              from={{
                transform: "translate3d(1000px,0,0) ",
              }}
              to={{
                transform: "translate3d(0px,0,0) ",
              }}
              config={{ friction: 20 }}
            >
              {(props) => (
                <div className="row m-0">
                  {/* left part */}
                  <div className="col-2 p-0 leftPart">
                    <EmpSidePanel />
                  </div>

                  {/* right part */}
                  <div
                    className="col rightPart container"
                    style={{
                      display: "flex ",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <div style={props}>
                      <form
                        style={{ minWidth: "900px" }}
                        className="addEmpForm"
                        onSubmit={this.onSubmit.bind(this, user)}
                      >
                        <h2>Apply for Leave</h2>
                        <hr />

                        <div className="row">
                          <div className="col">
                            <div className="row">
                              <div className="col">
                                <div className="form-group">
                                  <label htmlFor="subject">Subject</label>
                                  <input
                                    required
                                    type="text"
                                    name="subject"
                                    className="form-control"
                                    id="subject"
                                    value={this.state.subject}
                                    onChange={this.onChange}
                                  />
                                   {this.state.errors.subject && (
                                    <div className="text-danger">
                                      {this.state.errors.subject}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col">
                                <div className="form-group">
                                  <label htmlFor="fromDate">From</label>
                                  <input
                                    required
                                    type="date"
                                    name="fromDate"
                                    className="form-control"
                                    id="fromDate"
                                    value={this.state.fromDate}
                                    onChange={this.onChange}
                                    min={new Date().toISOString().split('T')[0]} 
                                  />
                                </div>
                              </div>
                              <div className="col">
                                <div className="form-group">
                                  <label htmlFor="toDate">To</label>
                                  <input
                                    required
                                    type="date"
                                    name="toDate"
                                    className="form-control"
                                    id="toDate"
                                    value={this.state.toDate}
                                    onChange={this.onChange}
                                     min={new Date().toISOString().split('T')[0]} 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 2nd col */}
                          <div className="col">
                            <div className="form-group">
                              <label htmlFor="reason">Reason</label>
                              <textarea
                                required
                                type="text"
                                name="reason"
                                className="form-control"
                                id="reason"
                                rows="5"
                                value={this.state.reason}
                                onChange={this.onChange}
                              />
                               {this.state.errors.reason && (
                                <div className="text-danger">
                                  {this.state.errors.reason}
                                </div>
                              )}
                            </div>

                            {/* attachment */}
                            <div className="form-group">
                              <div className="row">
                                <div className="col-11">
                                  <p
                                    className="text-secondary"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      this.setState({
                                        attachFile: !this.state.attachFile,
                                      })
                                    }
                                  >
                                    Attachment (if any){" "}
                                    <i
                                      className={classNames("fa", {
                                        "fa-caret-down": !this.state.attachFile,
                                        "fa-caret-up": this.state.attachFile,
                                      })}
                                    ></i>
                                  </p>
                                  {this.state.attachFile ? (
                                    <div className="input-group mb-3">
                                      <div className="custom-file">
                                        <input
                                          type="file"
                                          id="file"
                                          className="custom-file-input"
                                          onChange={this.onFileChange}
                                          ref={(ref) => (this.fileInput = ref)}
                                        />
                                        <label
                                          className="custom-file-label"
                                          htmlFor="file"
                                        >
                                          {this.state.attachmentName
                                            ? this.state.attachmentName
                                            : "Upload file"}
                                        </label>
                                      </div>
                                      <div className="input-group-append">
                                        <span
                                          style={{ cursor: "pointer" }}
                                          onClick={this.clearFile}
                                          className="input-group-text"
                                          id="file"
                                        >
                                          Clear
                                        </span>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <input
                          type="submit"
                          className="btn btn-primary"
                          value="Submit"
                        />
                      </form>
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
