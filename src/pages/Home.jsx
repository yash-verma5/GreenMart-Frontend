// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/config';
import { Link } from 'react-router-dom';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Adjust the URL if needed.
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching categories: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched categories:', data);
        setCategories(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2>Welcome to GreenMart</h2>
      <p>Your one-stop shop for fresh, organic products.</p>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        {categories.length > 0 ? (
          categories.map((category) => (
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
          ))
        ) : (
          <div className="col-12">
            <p>No categories available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
