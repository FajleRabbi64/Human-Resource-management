import React, { Component } from "react";
import { Provider } from "./context";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ContactUs from "./components/layouts/ContactUs";
import PageNotFound from "./components/layouts/PageNotFound";
import About from "./components/layouts/About";

import "./App.css";
import Header from "./components/layouts/Header";
import AddEmployee from "./components/layouts/AddEmployee";
import Profile from "./components/layouts/Profile";
import EmpDashboard from "./components/layouts/EmpDashboard";
import Attendence from "./components/layouts/Employee/Attendence";
import ViewRequests from "./components/layouts/Admin/View Requests/ViewRequests";
import MyRequests from "./components/layouts/Employee/MyRequests";
import OtherRequests from "./components/layouts/Employee/OtherRequests";
import ViewEmployees from "./components/layouts/Admin/ViewEmployees";
import EditEmpProfile from "./components/layouts/Admin/EditEmpProfile";
import MySalDetails from "./components/layouts/Employee/MySalDetails";
import Payroll from "./components/layouts/Admin/Payroll";
import Statistics from "./components/layouts/Admin/Stats/Statistics";
import Options from "./components/layouts/Admin/Options";
import ViewSingleRequest from "./components/layouts/Employee/ViewSingleRequest";
import CompanyInfo from "./components/layouts/Employee/CompanyInfo";
import ActiveLoans from "./components/layouts/Admin/ActiveLoans";
import ForgetPassword from "./components/auth/ForgetPassword";
import ResetPassword from "./components/auth/ResetPassword";
import AttendanceForm from "./components/layouts/Employee/AttendanceForm";
import AttendanceList from "./components/layouts/Admin/AttendanceList";
import AttendenceCheckout from "./components/layouts/Employee/AttendenceCheckout";
import AttendenceApplication from "./components/layouts/Employee/AttendenceApplication";
import AttendenceApplyList from "./components/layouts/Admin/AttendenceApplyList";
import PrivateRoute from "./PrivateRoute";



export default class App extends Component {
  render() {
    return (
      <Provider>
        <Router>
          <div>
            <Header branding="HRMS" />

            <Switch>
              {/* general */}
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/forget/password" component={ForgetPassword} />
 

              <Route exact path="/contactus" component={ContactUs} />
              {/* <Route exact path="/about" component={About} /> */}

              {/* emp related */}
              <Route exact path="/resetPassword" component={ResetPassword} />
              <Route exact path="/profile" component={Profile} />
              {/* <Route exact path="/attendence-em" component={AttendanceForm} /> */}

              <PrivateRoute exact path="/attendence-em" component={AttendanceForm} />
              <PrivateRoute exact path="/attendence-application" component={AttendenceApplication} />
              <PrivateRoute exact path="/attendence-checkout/:userId" component={AttendenceCheckout} />
              <PrivateRoute exact path="/attendence" component={Attendence} />

              {/* <Route exact path="/attendence-application" component={AttendenceApplication} /> */}
              {/* <Route exact path="/attendence-checkout/:userId" component={AttendenceCheckout} /> */}
              {/* <Route exact path="/attendence" component={Attendence} /> */}
              <Route exact path="/myRequests" component={MyRequests} />
              <Route exact path="/empDashboard" component={EmpDashboard} />
              <Route exact path="/otherRequest" component={OtherRequests} />
              <Route exact path="/mySalDetails" component={MySalDetails} />
              <Route exact path="/companyInfo" component={CompanyInfo} />
              <Route
                exact
                path="/viewSingleRequest/:title/:reqId"
                component={ViewSingleRequest}
              />

              {/* admin related */}
              <Route exact path="/" component={Statistics} />
              <Route exact path="/add" component={AddEmployee} />
              <Route exact path="/viewRequests" component={ViewRequests} />
              <Route exact path="/statistics" component={Statistics} />
              <Route exact path="/options" component={Options} />
              <PrivateRoute exact path="/attentdence-list" component={AttendanceList} />
              {/* <Route exact path="/attentdence-list" component={AttendanceList} /> */}
              {/* <Route exact path="/attentdence-application-list" component={AttendenceApplyList} /> */}
              <PrivateRoute exact path="/attentdence-application-list" component={AttendenceApplyList} />
              <Route exact path="/payroll" component={Payroll} />
              <Route exact path="/viewEmployees" component={ViewEmployees} />
              <Route exact path="/activeLoans" component={ActiveLoans} />
              <Route
                exact
                path="/editEmpProfile/:id"
                component={EditEmpProfile}
              />
              <Route component={PageNotFound} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
