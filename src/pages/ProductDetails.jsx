// src/pages/ProductDetails.jsx
import { useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../services/config';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const ProductDetails = () => {
  const { productId } = useParams(); // extract productId from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // States for the review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // States for reviews and average rating
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);

  // Get current user from AuthContext
  const { authData } = useContext(AuthContext);

  // Determine if purchase/review options should be shown.
  // They will be shown only if a user is logged in as a CUSTOMER.
  const showPurchaseOptions = authData && authData.role === "CUSTOMER";

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

  // Fetch reviews for this product and calculate the average rating
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

  // Determine if the current user has already submitted a review for this product
  const currentUserId = authData?.id || authData?.userId;
  const hasReviewed = currentUserId
    ? reviews.some((review) => String(review.userId) === String(currentUserId))
    : false;

  // Handler to add the product to the cart
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }
      const response = await fetch(
        `${API_BASE_URL}/cart/add/${productId}?quantity=${quantity}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to add to cart: ${response.status}`);
      }
      toast.success('Product added to cart!');
    } catch (err) {
      console.error(err);
      toast.error(`Failed to add to cart: ${err.message}`);
    }
  };

  // Handler to submit a review for the product
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (hasReviewed) {
      toast.error('You have already submitted a review for this product.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }
      // Build the review payload
      const reviewPayload = {
        productId: productId,
        rating: parseInt(rating, 10),
        comment: comment,
      };

      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reviewPayload),
      });
      if (!response.ok) {
        throw new Error(`Failed to submit review: ${response.status}`);
      }
      const result = await response.json();
      console.log("Review submitted:", result);
      toast.success("Review submitted successfully!");
      // Clear the review form
      setRating(5);
      setComment('');
      // Re-fetch reviews to update the average rating and review list
      fetch(`${API_BASE_URL}/reviews/product/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setReviews(data);
          if (data.length > 0) {
            const total = data.reduce((sum, review) => sum + review.rating, 0);
            setAvgRating(total / data.length);
          } else {
            setAvgRating(null);
          }
        });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(`Failed to submit review: ${error.message}`);
    }
  };

  // Helper function to render stars for a given rating value
  const renderStars = (ratingValue) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        style={{
          fontSize: '1.5rem',
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
      {product ? (
        <>
          <div className="row">
            <div className="col-md-6">
              {product.imagePath && (
                <img
                  src={product.imagePath}
                  alt={product.name}
                  className="img-fluid"
                  style={{ objectFit: 'cover', maxHeight: '400px', width: '100%' }}
                />
              )}
            </div>
            <div className="col-md-6">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              {product.price && (
                <p>
                  <strong>Price:</strong> ₹{product.price}
                </p>
              )}
              {/* Display average rating if available */}
              <div className="mb-3">
                <strong>Average Rating: </strong>
                {avgRating ? (
                  <>
                    {renderStars(Math.round(avgRating))}
                    <span> ({avgRating.toFixed(1)})</span>
                  </>
                ) : (
                  <span>No ratings yet</span>
                )}
              </div>
              {/* Only show purchase options if logged in as CUSTOMER */}
              {showPurchaseOptions && (
                <>
                  <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">
                      Quantity:
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      className="form-control"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                    />
                  </div>
                  <button className="btn btn-primary" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Add Review Section */}
          {showPurchaseOptions && (
            <div className="mt-5">
              <h3>Add a Review</h3>
              {hasReviewed ? (
                <p>You have already submitted a review for this product.</p>
              ) : (
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-3">
                    <label className="form-label">Rating:</label>
                    <div>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => setRating(star)}
                          style={{
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: star <= rating ? 'gold' : 'gray',
                          }}
                        >
                          {star <= rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="comment" className="form-label">
                      Comment:
                    </label>
                    <textarea
                      id="comment"
                      className="form-control"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-success">
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          )}
        </>
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
};

export default ProductDetails;
