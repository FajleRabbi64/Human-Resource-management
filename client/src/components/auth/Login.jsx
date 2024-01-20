import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Consumer } from "../../context";
import { Spring } from "react-spring/renderprops";
// import loginSVG from "../../assets/login-signup-styles/login3.svg";
import loginAvatar from "../../assets/login-signup-styles/loginAvatar.png";
import "../../assets/login-signup-styles/login-signup.css";
// import authentication from "../../assets/images/authentication.svg";
import authentication from "../../assets/images/login.png";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import line from "../../assets/line.png";
import styles from "./styles.module.css";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      error: "",
      disabled: false,
    };
  }

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable loggin btn
    this.setState({
      disabled: true,
    });

    const { email, password } = this.state;

    try {
      // check in both MODELS since we dont know whether its admin or emp
      let loggedInUser;

      try {
        loggedInUser = await axios.post(`/api/admin/login`, {
          email,
          password,
        });
      } catch (e) {
        loggedInUser = await axios.post(`/api/users/login`, {
          email,
          password,
        });
      }

      console.log("logged in successfully: ", loggedInUser.data);

      localStorage.setItem("auth-token", loggedInUser.data.token);
      localStorage.setItem("userId", loggedInUser.data.user._id);
      localStorage.setItem("userName", loggedInUser.data.user.name);

      dispatch({
        type: "LOGGED_IN",
        payload: {
          user: loggedInUser.data.user,
          token: loggedInUser.data.token,
        },
      });
      if (email === "admin@gmail.com") this.props.history.push("/");
      else this.props.history.push("/empDashBoard");
    } catch (err) {
      // enable login btn
      this.setState({
        disabled: false,
      });

      console.log("ERROR: ", err);
      this.setState({ error: err.response.data.msg });
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <Consumer>
        {(value) => {
          let { dispatch, token } = value;
          if (token === undefined) token = "";
          const { error } = this.state;

          if (!token) {
            return (
              <Spring
                from={{ opacity: 0 }}
                to={{ opacity: 1 }}
                config={{ duration: 300 }}
              >
                {(props) => (
                  <div style={props}>
                    <div className={styles.login_container}>
                      <div className={styles.login_form_container}>
                        <div className={styles.left}>
                          <form
                            className={styles.form_container}
                            onSubmit={this.onSubmit.bind(this, dispatch)}
                          >
                            <h1>Login to Your Account</h1>
                            {error.length ? (
                              <div className="alert alert-danger mt-4">
                                {error}
                              </div>
                            ) : null}

                            <input
                              type="email"
                              name="email"
                              className={styles.input}
                              placeholder="Email"
                              onChange={this.onChange}
                              required
                            />
                            <input
                              name="password"
                              type="password"
                              className={styles.input}
                              placeholder="Password"
                              onChange={this.onChange}
                              required
                            />

                            <button type="submit" className={styles.green_btn}>
                              Sing In
                            </button>
                            <div
                              style={{
                                display: "flex",
                                marginTop: "10px",
                                justifyContent: "center",
                              }}
                            >
                              <p>If forget password please</p>{" "}
                              <Link
                                to="/forget/password"
                                style={{
                                  color: "blue",
                                  marginLeft: "5px",
                                  marginRight: "5px",
                                }}
                              >
                                Click
                              </Link>
                              <p>here</p>
                            </div>
                          </form>
                        </div>
                        <div className={styles.right}>
                          <h1 style={{textAlign:"center"}}>Don't have an account? </h1>
                          <Link to="/signup">
                            <button type="button" className={styles.white_btn}>
                              Sing Up
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Spring>
            );
          } else {
            return <Redirect to="/" />;
          }
        }}
      </Consumer>
    );
  }
}

export default Login;
