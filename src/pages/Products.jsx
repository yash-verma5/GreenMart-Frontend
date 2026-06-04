// src/pages/Products.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Axios instance with base URL configured
import { toast } from 'react-toastify';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch products. If keyword is provided, use the search endpoint.
  const fetchProducts = async (searchKeyword = '') => {
    setLoading(true);
    try {
      let res;
      if (searchKeyword.trim() !== '') {
        res = await api.get(`/products/search?keyword=${encodeURIComponent(searchKeyword)}`);
      } else {
        // Adjust the endpoint if needed (e.g., fetch all products)
        res = await api.get(`/products`);
      }
      setProducts(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form submission for searching products
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(keyword);
  };

  return (
    <div className="container mt-5">
      <h2>Products</h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              // Wrap the entire card in a Link to make it clickable.
              <div key={product.id} className="col-md-4 mb-3">
                <Link
                  to={`/products/${product.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="card h-100">
                    {product.imagePath && (
                      <img
                        src={product.imagePath}
                        alt={product.name}
                        className="card-img-top"
                        style={{ objectFit: 'cover', height: '200px' }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">{product.description}</p>
                      {product.price && (
                        <p className="card-text">
                          <strong>Price:</strong> ₹{product.price}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
