import React from "react";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Pages/Navbar";  // ✅ Ensure Navbar exists
import "../components/css/Dashboard.css";  // ✅ Ensure correct path

const Dashboard = () => {

  const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }
  return (
    <div>
      <Navbar />
      <div className="tagline">
        <h1>Welcome to Green Mart</h1>

        <h1>Welcome, {user.email}</h1>
            <p>Your role: {user.role}</p>
      </div>
     
      
      <footer>
        <div>📞 Contact Info</div>
        <div>📩 Newsletter</div>
      </footer>
    </div>
  );
};

export default Dashboard;
