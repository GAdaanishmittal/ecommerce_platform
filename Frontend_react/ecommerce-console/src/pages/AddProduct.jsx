import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    sku: '',
    productDescription: '',
    basePrice: '',
    stockQty: '',
    categoryId: '',
    picture: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/api/categories'),
          api.get('/api/products'),
        ]);

        const catData = Array.isArray(catRes.data) ? catRes.data : [];
        catData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        setCategories(catData);

        const products = Array.isArray(prodRes.data) ? prodRes.data : [];
        const nextId = products.length > 0 ? Math.max(...products.map((p) => p.productId || 0)) + 1 : 1;

        setFormData((prev) => ({
          ...prev,
          sku: `PROD-${nextId.toString().padStart(3, '0')}`,
        }));
      } catch (err) {
        console.error('Failed to fetch initial data', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.productName || !formData.sku || !formData.basePrice || !formData.categoryId) {
        throw new Error('Please fill all required fields (Name, SKU, Price, Category)');
      }

      const payload = {
        productName: formData.productName,
        sku: formData.sku,
        productDescription: formData.productDescription || null,
        description: formData.productDescription || null,
        basePrice: parseFloat(formData.basePrice),
        price: parseFloat(formData.basePrice),
        stockQty: parseInt(formData.stockQty, 10) || 0,
        quantity: parseInt(formData.stockQty, 10) || 0,
        categoryId: parseInt(formData.categoryId, 10),
        category: {
          categoryId: parseInt(formData.categoryId, 10),
        },
        picture: formData.picture || null,
      };

      await api.post('/api/products', payload);
      setSuccess('Product added successfully');
      setTimeout(() => navigate('/products'), 1200);
    } catch (err) {
      console.error('Error adding product:', err);
      let errorMsg = 'Failed to add product';
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          errorMsg = data;
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.errors && Array.isArray(data.errors)) {
          errorMsg = data.errors.map((entry) => entry.defaultMessage || entry).join(', ');
        } else if (typeof data === 'object') {
          errorMsg = JSON.stringify(data);
        }
      } else {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-shell">
      <button onClick={() => navigate('/products')} className="back-link mono">
        &larr; Back to directory
      </button>

      <div className="editor-form">
        <div className="section-header">
          <h2 className="section-title">New Entry</h2>
        </div>

        {error && <div className="status-box mb-4">ERR: {error}</div>}
        {success && <div className="status-box mb-4">STATUS: {success}</div>}

        <form onSubmit={handleSubmit} className="stack">
          <div className="grid-wide">
            <Input
              label="Name"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="NAME"
              required
            />
            <Input
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="SKU"
              required
            />
          </div>

          <div className="form-group">
            <label className="field-label">Category *</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
              <option value="">SELECT</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-two">
            <Input
              label="Price (INR)"
              type="number"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
            />
            <Input
              label="Stock"
              type="number"
              name="stockQty"
              value={formData.stockQty}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          <Input
            label="Image URL"
            name="picture"
            value={formData.picture}
            onChange={handleChange}
            placeholder="https://..."
          />

          <TextArea
            label="Description"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            placeholder="DESC"
            rows="4"
          />

          <button type="submit" disabled={loading} className="w-full">
            {loading ? '...' : 'GENERATE'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
