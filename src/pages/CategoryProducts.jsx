// src/pages/CategoryProducts.jsx
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/config';
import { useParams, Link } from 'react-router-dom';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/products/category/${categoryId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching products: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched products:', data);
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [categoryId]);

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Loading products...</p>
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
      <h2>Products for Category</h2>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="col-md-4 mb-3">
  <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div className="card h-100">
      {product.imagePath && (
        <img
          src={product.imagePath}
          className="card-img-top"
          alt={product.name}
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
          <div className="col-12">
            <p>No products found for this category.</p>
          </div>
        )}
      </div>
      <Link to="/" className="btn btn-secondary mt-3">Back to Home</Link>
    </div>
  );
};

export default CategoryProducts;
