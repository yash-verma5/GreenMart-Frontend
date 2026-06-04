// src/pages/Login.jsx
import { useState, useContext } from 'react';
import { API_BASE_URL } from '../services/config';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/authService';
import {jwtDecode} from 'jwt-decode';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Call the login service to get the token
      const data = await login(email, password);
      console.log('Login response:', data);

      // Check that the token exists
      if (!data?.token) {
        throw new Error("No token found in response");
      }
      
      // 2. Save the token (in localStorage)
      localStorage.setItem('token', data.token);
      
      // 3. Decode the token to extract roles
      const decodedToken = jwtDecode(data.token);
      console.log('Decoded token:', decodedToken);
      const rolesArray = (decodedToken.roles || []).map(roleObj => roleObj.authority);
      console.log('User roles:', rolesArray);

      // 4. Fetch the full user details using the token from /users/me
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user details, status: " + response.status);
      }
      const userData = await response.json();
      console.log('User data from /users/me:', userData);
      
      // 5. Update AuthContext with the full user data
      setAuthData(userData);
      
      // 6. Show a success toast message
      toast.success('Login successful!');
      
      // 7. Navigate based on the token's roles
      if (rolesArray.includes('ROLE_ADMIN')) {
        navigate('/admin-dashboard');
      } else if (rolesArray.includes('ROLE_VENDOR')) {
        navigate('/vendor-dashboard');
      } else if (rolesArray.includes('ROLE_CUSTOMER')) {
        navigate('/'); // Home page for customers
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card border-success shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4 text-success">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input 
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input 
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-success">
                Login
              </button>
            </div>
          </form>
          <p className="text-center mt-3">
            Don’t have an account? <Link to="/register" className="text-success">Register here</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
