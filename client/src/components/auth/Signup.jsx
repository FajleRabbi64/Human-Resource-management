import React, { Component } from "react";
import { Consumer } from "../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import loginAvatar from "../../assets/login-signup-styles/loginAvatar.png";
import "../../assets/login-signup-styles/login-signup.css";
// import notes from "../../assets/images/notes.svg";
import notes from "../../assets/images/authentication.png";
import styles from "./singup/styles.module.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

class Signup extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      passwordCheck: "",
      name: "",
      error: "",
      disabled: false,

      // validation
      emailCheck: false,
      password1Check: false,
      password2Check: false,
    };
  }

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable signup btn
    this.setState({
      disabled: true,
    });

    const { email, password, passwordCheck, name } = this.state;

    try {
      const newUser = await axios.post("/api/admin/register", {
        email,
        password,
        passwordCheck,
        name,
      });
      console.log("created account successfully: ", newUser.data);
      // now login the user
      const loggedInUser = await axios.post("/api/admin/login", {
        email,
        password,
      });
      console.log("logged in successfully: ", loggedInUser.data);

      localStorage.setItem("auth-token", loggedInUser.data.token);
      localStorage.setItem("userId", loggedInUser.data.user._id);

      dispatch({
        type: "LOGGED_IN",
        payload: {
          user: loggedInUser.data.user,
          token: loggedInUser.data.token,
        },
      });

      this.props.history.push("/");
    } catch (err) {
      // enable signup btn
      this.setState({
        disabled: false,
      });

      console.log("ERROR: ", err.response.data.msg);
      this.setState({ error: err.response.data.msg });
    }
  };

  onChange = (e) => {
    const { name } = e.target;

    this.setState({ [e.target.name]: e.target.value }, () => {
      if (name === "email") {
        if (this.state.email.includes("@")) {
          if (this.state.email.includes(".")) {
            this.setState({ emailCheck: true });
          } else this.setState({ emailCheck: false });
        } else this.setState({ emailCheck: false });
      } else if (name === "password") {
        if (this.state.password.length >= 6) {
          this.setState({ password1Check: true });
        } else this.setState({ password1Check: false });
      } else if (name === "passwordCheck") {
        if (this.state.password === this.state.passwordCheck) {
          this.setState({ password2Check: true });
        } else this.setState({ password2Check: false });
      }
    });
  };

  render() {
    const { error } = this.state;

    return (
      <Consumer>
        {(value) => {
          let { dispatch, token } = value;
          if (token === undefined) token = "";

          if (!token) {
            return (
              <Spring
                from={{ opacity: 0 }}
                to={{ opacity: 1 }}
                config={{ duration: 300 }}
              >
                {(props) => (
                  <div style={props}>
                    <div className={styles.signup_container}>
                      <div className={styles.signup_form_container}>
                        <div className={styles.left}>
                          <h1>Welcome Back</h1>
                          <Link to="/login">
                            <button type="button" className={styles.white_btn}>
                              Sing in
                            </button>
                          </Link>
                        </div>
                        <div className={styles.right}>
                          <form
                            className={styles.form_container}
                            onSubmit={this.onSubmit.bind(this, dispatch)}
                          >
                            <h1>Create Account</h1>

                            {error ? (
                              <div className="alert alert-danger mt-4">
                                {error}
                              </div>
                            ) : null}

                            <input
                              name="name"
                              type="text"
                              className={styles.input}
                              placeholder="name"
                              onChange={this.onChange}
                            />
                            <input
                              type="email"
                              name="email"
                              className={styles.input}
                              placeholder="Email id"
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

                          <input
                              name="passwordCheck"
                              type="password"
                              className={styles.input}
                              placeholder="Re-enter password"
                              onChange={this.onChange}
                              required
                            />
                            <button type="submit" className={styles.green_btn}>
                              Sing Up
                            </button>
                          </form>
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

export default Signup;
