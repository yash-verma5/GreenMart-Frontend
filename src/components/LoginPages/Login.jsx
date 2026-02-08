import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import

import axios from "axios";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);

                // Decode token to get user details
                const decodedToken = jwtDecode(response.data.token);
                localStorage.setItem("userRole", decodedToken.role);
                localStorage.setItem("userEmail", decodedToken.sub); // Usually, email is stored under `sub`

                alert("Login successful");
                navigate("/dashboard"); // Redirect to dashboard
            }
        } catch (err) {
            console.error(err);
            alert("Invalid credentials");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
