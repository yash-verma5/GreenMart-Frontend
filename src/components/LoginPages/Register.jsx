import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("User");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!termsAccepted) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    console.log({ email, password, address, phone, role });

    // Redirect to different login pages based on role
    if (role === "Admin") {
      navigate("/admin-login");
    } else if (role === "Vendor") {
      navigate("/vendor-login");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required />
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" required />
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" required />

        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
          <option value="Vendor">Vendor</option>
        </select>

        <div className="terms-container">
          <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} required />
          <label>I agree to the Terms and Conditions</label>
        </div>

        <button type="submit">Register</button>
      </form>

      <p className="login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
