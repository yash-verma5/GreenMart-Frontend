// src/pages/AdminAddCategory.jsx
import { useState } from 'react';
import { API_BASE_URL } from '../services/config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminAddCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imagePath, setImagePath] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name || name.length < 2 || name.length > 50) {
      toast.error('Category name must be between 2 and 50 characters.');
      return;
    }
    if (!imagePath) {
      toast.error('Category image is required.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('User not authenticated.');
      return;
    }

    // Build the payload according to CreateCategoryRequestDto
    const payload = {
      name,
      description,
      imagePath
    };

    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log('Category created:', data);
      toast.success('Category created successfully!');
      // Navigate to admin dashboard or categories list after success
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Error creating category:', err);
      toast.error(`Failed to create category: ${err.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Category Name*</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter category description"
            rows="3"
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Category Image URL*</label>
          <input
            type="text"
            className="form-control"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            placeholder="Enter image URL"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Category
        </button>
      </form>
    </div>
  );
};

export default AdminAddCategory;
