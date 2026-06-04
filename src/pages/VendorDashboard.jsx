// src/pages/VendorDashboard.jsx
import { useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/config';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const VendorDashboard = () => {
  const { authData } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authData || !authData.id) {
      setError('Vendor not authenticated.');
      setLoadingProducts(false);
      setLoadingPending(false);
      return;
    }
    
    const vendorId = authData.id; // or authData.vendorId if that's your property name
    const token = localStorage.getItem('token');

    // Fetch all vendor products
    fetch(`${API_BASE_URL}/products/vendor/${vendorId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching products: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched vendor products:', data);
        setProducts(data);
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoadingProducts(false);
      });

    // Fetch pending products for this vendor
    fetch(`${API_BASE_URL}/products/vendor/${vendorId}/pending`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching pending products: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched pending products:', data);
        setPendingProducts(data);
        setLoadingPending(false);
      })
      .catch((err) => {
        console.error(err);
        // We don't want to override the products error if one exists,
        // so just log the error and set loadingPending to false.
        setLoadingPending(false);
      });
  }, [authData]);

  if (loadingProducts || loadingPending) {
    return (
      <div className="container mt-5">
        <p>Loading your products and pending orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Your Products</h2>
      {products.length > 0 ? (
        <div className="table-responsive mb-5">
          <table className="table table-striped">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price (₹)</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.imagePath ? (
                      <img
                        src={product.imagePath}
                        alt={product.name}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <Link 
                      to={`/vendor/product/${product.id}`} 
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>You have no products listed.</p>
      )}

      <h2>Pending Products</h2>
      {pendingProducts.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price (₹)</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.imagePath ? (
                      <img
                        src={product.imagePath}
                        alt={product.name}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <Link 
                      to={`/vendor/product/${product.id}`} 
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No pending products at the moment.</p>
      )}
    </div>
  );
};

export default VendorDashboard;
