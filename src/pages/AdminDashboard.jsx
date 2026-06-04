// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/config';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // State for pending products
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [pendingError, setPendingError] = useState(null);

  // State for product categories
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  // Fetch pending products
  const fetchPendingProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/pending`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Error fetching pending products: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched pending products:', data);
      setPendingProducts(data);
    } catch (err) {
      console.error(err);
      setPendingError(err.message);
    } finally {
      setLoadingPending(false);
    }
  };

  // Fetch product categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched categories:', data);
      setCategories(data);
    } catch (err) {
      console.error(err);
      setCategoriesError(err.message);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchPendingProducts();
    fetchCategories();
  }, []);

  // Handler to update product status (approve or reject)
  const handleUpdateStatus = async (productId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }
      const response = await fetch(
        `${API_BASE_URL}/products/${productId}/status?status=${newStatus}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }
      const updatedProduct = await response.json();
      console.log('Updated product:', updatedProduct);
      toast.success(`Product ${newStatus.toLowerCase()} successfully!`);
      // Refresh pending products list after updating status
      fetchPendingProducts();
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error(`Error updating product status: ${error.message}`);
    }
  };

  // Helper to format dates
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="container mt-5">
      <h2>Pending Products</h2>
      {loadingPending ? (
        <p>Loading pending products...</p>
      ) : pendingError ? (
        <div className="alert alert-danger" role="alert">
          {pendingError}
        </div>
      ) : pendingProducts.length > 0 ? (
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
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleUpdateStatus(product.id, 'APPROVED')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleUpdateStatus(product.id, 'REJECTED')}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No pending products found.</p>
      )}

      <h2>Product Categories</h2>
      {loadingCategories ? (
        <p>Loading categories...</p>
      ) : categoriesError ? (
        <div className="alert alert-danger" role="alert">
          {categoriesError}
        </div>
      ) : categories.length > 0 ? (
        <div className="row">
          {categories.map((category) => (
            <div key={category.id} className="col-md-4 mb-3">
              <Link
                to={`/products/category/${category.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="card h-100">
                  {category.imagePath && (
                    <img
                      src={category.imagePath}
                      className="card-img-top"
                      alt={category.name}
                      style={{ objectFit: 'cover', height: '200px' }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{category.name}</h5>
                    <p className="card-text">{category.description}</p>
                  </div>
                  <div className="card-footer">
                    <small className="text-muted">
                      {category.productCount} products
                    </small>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="col-12">
          <p>No categories available.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
