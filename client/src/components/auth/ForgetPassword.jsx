import React, { useState } from 'react';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/api/admin/forgotPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg) {
          setMessage('Mail sent. Check your email.');
          setEmail(''); // Clear the email input
        } else {
          setMessage('Error sending email.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('Mail can not sent, Please try again.');
      });
  };

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginTop: '80px' }}>Forget Password</h3>

      <form
        onSubmit={handleSubmit}
        style={{
          borderRadius: '5px',
          width: '400px',
          marginLeft: '500px',
          marginTop: '30px',
          padding: '20px',
          boxShadow: '0px 0px 20px rgb(187, 187, 187)',
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
        <button type="submit" className="btn btn-primary">
          Send Reset Link
        </button>
      </form>

      {message && <div style={{ textAlign: 'center', marginTop: '10px' }}>{message}</div>}
    </div>
  );
};

export default ForgetPassword;
