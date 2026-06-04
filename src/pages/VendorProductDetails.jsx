// src/pages/VendorProductDetails.jsx
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/config';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VendorProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For restock
  const [restockQuantity, setRestockQuantity] = useState(0);

  // For reviews
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);

  // Fetch product details
  useEffect(() => {
    fetch(`${API_BASE_URL}/products/${productId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching product details: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched product details:', data);
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [productId]);

  // Fetch reviews for this product and calculate average rating
  useEffect(() => {
    fetch(`${API_BASE_URL}/reviews/product/${productId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching reviews: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched reviews:', data);
        setReviews(data);
        if (data.length > 0) {
          const total = data.reduce((sum, review) => sum + review.rating, 0);
          setAvgRating(total / data.length);
        } else {
          setAvgRating(null);
        }
      })
      .catch((err) => console.error(err));
  }, [productId]);

  // Handler to restock the product
  const handleRestock = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }
      const response = await fetch(
        `${API_BASE_URL}/products/${productId}/restock?quantity=${restockQuantity}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to restock: ${response.status}`);
      }
      const updatedProduct = await response.json();
      setProduct(updatedProduct);
      toast.success('Product restocked successfully!');
    } catch (error) {
      console.error("Error restocking product:", error);
      toast.error(`Error restocking product: ${error.message}`);
    }
  };

  // Helper function to render stars for a given rating value
  const renderStars = (ratingValue) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        style={{
          fontSize: '1.2rem',
          color: star <= ratingValue ? 'gold' : 'gray',
        }}
      >
        {star <= ratingValue ? '★' : '☆'}
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Loading product details...</p>
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
      <h2>Product Details</h2>
      {product ? (
        <>
          <div className="row">
            {/* Left Side: Smaller product image */}
            <div className="col-md-4">
              {product.imagePath ? (
                <img
                  src={product.imagePath}
                  alt={product.name}
                  className="img-fluid"
                  style={{ objectFit: 'cover', maxHeight: '300px', width: '100%' }}
                />
              ) : (
                <p>No Image</p>
              )}
            </div>
            {/* Right Side: Product details and restock option */}
            <div className="col-md-8">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              {product.price && (
                <p>
                  <strong>Price:</strong> ₹{product.price}
                </p>
              )}
              <p>
                <strong>Available Quantity:</strong> {product.quantity}
              </p>
              <p>
                <strong>Status:</strong> {product.status}
              </p>
              <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                Back
              </button>

              <hr />

              {/* Restock Section */}
              <div>
                <h4>Restock Product</h4>
                <div className="mb-3">
                  <label htmlFor="restockQuantity" className="form-label">
                    Quantity to Add:
                  </label>
                  <input
                    type="number"
                    id="restockQuantity"
                    className="form-control"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(e.target.value)}
                    min="1"
                  />
                </div>
                <button className="btn btn-primary" onClick={handleRestock}>
                  Restock
                </button>
              </div>

              <hr />

              {/* Reviews Section */}
              <div>
                <h4>Reviews</h4>
                {avgRating !== null ? (
                  <div>
                    <strong>Average Rating: </strong>
                    {renderStars(Math.round(avgRating))} <span>({avgRating.toFixed(1)})</span>
                  </div>
                ) : (
                  <div>No reviews yet.</div>
                )}
                {reviews.length > 0 && (
                  <ul className="list-group mt-3">
                    {reviews.map((review) => (
                      <li key={review.id} className="list-group-item">
                        <div>{renderStars(review.rating)}</div>
                        <div>
                          <strong>Comment:</strong> {review.comment}
                        </div>
                        <div>
                          <small>
                            Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
};

export default VendorProductDetails;
