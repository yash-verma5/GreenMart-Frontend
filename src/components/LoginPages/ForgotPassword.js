import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/forgot-password`, { email });
      setMessage('If that email is registered, you will receive a password reset link soon.');
    } catch (err) {
      console.error(err);
      setMessage('Error: Unable to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      <div className="extra-links">
        <p>
          <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
            Return to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
