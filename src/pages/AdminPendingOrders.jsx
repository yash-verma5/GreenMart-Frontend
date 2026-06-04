// src/pages/AdminPendingOrders.jsx
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/config';
import { toast } from 'react-toastify';

const AdminPendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch pending orders and enrich with customer details
  const fetchPendingOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/pending`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        throw new Error(`Error fetching pending orders: ${res.status}`);
      }
      const ordersData = await res.json();
      console.log('Fetched pending orders:', ordersData);

      // Enrich each order with customer details
      const ordersWithUser = await Promise.all(
        ordersData.map(async (order) => {
          try {
            const userRes = await fetch(`${API_BASE_URL}/users/${order.userId}`, {
              headers: { 'Content-Type': 'application/json' },
            });
            if (!userRes.ok) {
              throw new Error(`Error fetching user details: ${userRes.status}`);
            }
            const userData = await userRes.json();
            return { ...order, user: userData };
          } catch (err) {
            console.error(err);
            return order;
          }
        })
      );
      setOrders(ordersWithUser);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  // Handler to mark an order as delivered
  const handleMarkAsDelivered = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status/delivered`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to mark as delivered: ${res.status}`);
      }
      const updatedOrder = await res.json();
      console.log('Updated order:', updatedOrder);
      toast.success('Order marked as delivered successfully!');
      // Refresh the pending orders list
      fetchPendingOrders();
    } catch (err) {
      console.error(err);
      toast.error(`Error marking order as delivered: ${err.message}`);
    }
  };

  // Helper to format dates
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Loading pending orders...</p>
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
      <h2>Pending Orders</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.id} className="card mb-3">
            <div className="card-header">
              <strong>Order Date:</strong> {formatDate(order.createdAt)}
            </div>
            <div className="card-body">
              <p>
                <strong>Shipping Address:</strong> {order.address}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{order.amount}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              {order.user && (
                <div className="d-flex align-items-center mb-3">
                  {order.user.imagePath ? (
                    <img
                      src={order.user.imagePath}
                      alt={order.user.name}
                      className="rounded-circle me-2"
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-secondary me-2"
                      style={{ width: '40px', height: '40px' }}
                    ></div>
                  )}
                  <span>
                    <strong>Customer:</strong> {order.user.name}
                  </span>
                </div>
              )}
              {order.orderItems && order.orderItems.length > 0 ? (
                <>
                  <p className="mb-1"><strong>Products:</strong></p>
                  <ul className="list-group">
                    {order.orderItems.map((item) => (
                      <li key={item.id} className="list-group-item">
                        {item.productName} (x{item.quantity})
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>No order items found.</p>
              )}
            </div>
            <div className="card-footer">
              <button 
                className="btn btn-success btn-sm"
                onClick={() => handleMarkAsDelivered(order.id)}
              >
                Mark as Delivered
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No pending orders found.</p>
      )}
    </div>
  );
};

export default AdminPendingOrders;
