import React, { useState } from "react";

const ResetPassword = () => {
  //   const [token, setToken] = useState('');
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  //   const handleTokenChange = (e) => {
  //     setToken(e.target.value);
  //   };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/api/admin/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, newPassword, confirmPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.msg); // Handle response from server
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <h3 style={{ textAlign: "center", marginTop: "80px" }}>Reset Password</h3>

      <form
        onSubmit={handleSubmit}
        style={{
          borderRadius: "5px",
          width: "400px",
          marginLeft: "500px",
          marginTop: "30px",
          padding: "20px",
          boxShadow: "0px 0px 20px rgb(187, 187, 187)",
        }}
      >
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={email}
            onChange={handleEmailChange}
          />
        </div>

        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            className="form-control"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Reset Password
        </button>
      </form>

      {message && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>{message}</div>
      )}
    </div>
  );
};

export default ResetPassword;
