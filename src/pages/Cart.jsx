// src/pages/Cart.jsx
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/config';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // Will hold cart items enriched with price and available quantity
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');

  // Get the token from localStorage (assumes the user is logged in)
  const token = localStorage.getItem('token');

  // Function to fetch cart data and enrich each item with its product price and available quantity
  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch cart, status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Cart response:", data);

      // data.cartItems is expected to be an array of cart items
      if (data.cartItems && Array.isArray(data.cartItems)) {
        const itemsWithDetails = await Promise.all(
          data.cartItems.map(async (item) => {
            try {
              const prodRes = await fetch(`${API_BASE_URL}/products/${item.productId}`);
              if (!prodRes.ok) {
                throw new Error(`Error fetching product details for ${item.productId}: ${prodRes.status}`);
              }
              const productData = await prodRes.json();
              // Correct the quantity if it exceeds available stock
              const correctedQuantity = Math.min(item.quantity, productData.quantity);
              return { 
                ...item, 
                price: productData.price, 
                availableQuantity: productData.quantity,
                quantity: correctedQuantity
              };
            } catch (prodErr) {
              console.error(prodErr);
              return { ...item, price: 0, availableQuantity: 0 };
            }
          })
        );
        setCartItems(itemsWithDetails);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the cart when the component mounts
  useEffect(() => {
    fetchCart();
  }, []);

  // Handler to update a cart item's quantity
  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/update/${cartItemId}`, {
        method: 'PUT', // or 'POST' depending on your backend implementation
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });
      if (!response.ok) {
        throw new Error(`Error updating cart item: ${response.status}`);
      }
      toast.success('Cart updated successfully!');
      fetchCart(); // Refresh cart after updating
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error(`Error updating cart item: ${err.message}`);
    }
  };

  // Handler to remove a cart item
  const handleRemoveItem = async (cartItemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/remove/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error removing item: ${response.status}`);
      }
      toast.success('Item removed from cart!');
      fetchCart(); // Refresh cart after removal
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error(`Error removing item: ${err.message}`);
    }
  };

  // Handler to clear the entire cart
  const handleClearCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: 'DELETE', // or 'POST' if your backend uses that method
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error clearing cart: ${response.status}`);
      }
      toast.success('Cart cleared successfully!');
      fetchCart(); // Refresh cart after clearing
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast.error(`Error clearing cart: ${err.message}`);
    }
  };

  // Handler to place an order
  const handlePlaceOrder = async () => {
    try {
      if (!shippingAddress.trim()) {
        toast.error('Please provide a shipping address.');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ address: shippingAddress })
      });
      if (!response.ok) {
        throw new Error(`Failed to place order, status: ${response.status}`);
      }
      const orderData = await response.json();
      console.log("Order placed:", orderData);
      toast.success('Order placed successfully!');
      // Optionally, clear the cart or refresh the cart items
      fetchCart();
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error(`Error placing order: ${err.message}`);
    }
  };

  // Calculate overall cart total using the fetched price and the (possibly corrected) quantity
  const cartTotal = cartItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Loading cart...</p>
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
      <h2>Your Cart</h2>
      {cartItems.length > 0 ? (
        <>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price (₹)</th>
                  <th>Total (₹)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        max={item.availableQuantity}
                        onChange={(e) => {
                          const newVal = parseInt(e.target.value, 10);
                          if (newVal > item.availableQuantity) {
                            toast.error(`Quantity cannot exceed available stock (${item.availableQuantity})`);
                            handleUpdateQuantity(item.id, item.availableQuantity);
                          } else {
                            handleUpdateQuantity(item.id, newVal);
                          }
                        }}
                        style={{ width: '80px' }}
                      />
                    </td>
                    <td>{item.price}</td>
                    <td>{item.price * item.quantity}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h4 className="mt-3">Cart Total: ₹{cartTotal}</h4>
          <button className="btn btn-warning mt-3" onClick={handleClearCart}>
            Clear Cart
          </button>
          {/* Place Order Section */}
          <div className="mt-4">
            <label htmlFor="shippingAddress" className="form-label">
              Shipping Address:
            </label>
            <input
              type="text"
              id="shippingAddress"
              className="form-control"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your shipping address"
            />
            <button className="btn btn-success mt-2" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
