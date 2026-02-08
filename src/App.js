import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './App.css';
import './css/BrowseProducts.css';
import './css/ProductDetails.css';
import './css/VendorDetails.css';

// Lazy load components (React Specialist)
const Home = lazy(() => import('./components/Pages/Home'));
const Register = lazy(() => import('./components/LoginPages/Register'));
const Login = lazy(() => import('./components/LoginPages/Login'));
const ForgotPassword = lazy(() => import('./components/LoginPages/ForgotPassword'));
const BrowseProducts = lazy(() => import('./components/UserActions/BrowseProducts'));
const ProductDetails = lazy(() => import('./components/UserActions/ProductDetails'));
const ShoppingCart = lazy(() => import('./components/UserActions/ShoppingCart'));
const AdminLogin = lazy(() => import('./components/LoginPages/AdminLogin'));
const VendorLogin = lazy(() => import('./components/LoginPages/VendorLogin'));
const FruitsCategory = lazy(() => import('./components/category/FruitsCategory1'));
const VegetablesCategory = lazy(() => import('./components/category/VegetablesCategory2'));
const DailyEssentialsCategory = lazy(() => import('./components/category/DailyEssentialsCategory3'));
const UserProfile = lazy(() => import('./components/Pages/UserProfile'));
const VendorDetails = lazy(() => import('./components/Pages/VendorDetails'));
// const UserLogin = lazy(() => import('./components/LoginPages/UserLogin')); // Unused?
const AboutUs = lazy(() => import('./components/Pages/AboutUs'));

function App() {
  const [cart, setCart] = useState([]); // State to store cart items

  // Function to add product to the cart
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <Router>
      <header className="navbar">
        <ul>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/browseProducts">Browse Products</Link></li>
          <li><Link to="/shoppingCart">Shopping Cart</Link></li>
          <li><Link to="/vendorDetails">Vendor Details</Link></li>
          <li><Link to="/aboutUs">About Us</Link></li>
        </ul>
      </header>

      <main className="main-content">
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/browseProducts"
              element={<BrowseProducts addToCart={addToCart} />}
            />
            <Route
              path="/product/:id"
              element={<ProductDetails addToCart={addToCart} />}
            />
            <Route
              path="/shoppingCart"
              element={<ShoppingCart cart={cart} />}
            />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/vendor-login" element={<VendorLogin />} />
            <Route
              path="/fruits"
              element={<FruitsCategory addToCart={addToCart} />}
            />
            <Route
              path="/vegetables"
              element={<VegetablesCategory addToCart={addToCart} />}
            />
            <Route
              path="/daily-essentials"
              element={<DailyEssentialsCategory addToCart={addToCart} />}
            />
            {/* Note: Duplicate path "/" for ShoppingCart removed to avoid conflict with Home */}
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/vendorDetails" element={<VendorDetails />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;