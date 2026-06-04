// src/pages/VendorAddProduct.jsx
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VendorAddProduct = () => {
  // Form state for new product
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(''); // will store selected category ID
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imagePath, setImagePath] = useState('');

  // State for categories dropdown
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  // Fetch categories on mount
  useEffect(() => {
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
        toast.error('Failed to load categories');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!name || name.length < 3 || name.length > 200) {
      toast.error('Product name must be between 3 and 200 characters.');
      return;
    }
    if (!categoryId) {
      toast.error('Please select a category.');
      return;
    }
    if (!price) {
      toast.error('Price is required.');
      return;
    }
    if (!quantity) {
      toast.error('Quantity is required.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('User not authenticated.');
      return;
    }

    // Build the payload
    const payload = {
      name,
      categoryId, // category ID from the dropdown
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      imagePath,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Product created:', data);
      toast.success('Product added successfully!');
      navigate('/vendor-dashboard');
    } catch (err) {
      console.error('Error creating product:', err);
      toast.error(`Failed to add product: ${err.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Name*</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category*</label>
          <select
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            rows="3"
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Price*</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter product price"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Quantity*</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter product quantity"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Image Path</label>
          <input
            type="text"
            className="form-control"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            placeholder="Enter image URL (optional)"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default VendorAddProduct;
