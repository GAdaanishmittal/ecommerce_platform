import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        setLoading(true);
        setError('');

        try {
          const catRes = await api.get('/api/categories');
          const categoriesData = Array.isArray(catRes.data) ? catRes.data : [];
          categoriesData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          setCategories(categoriesData);
        } catch (catErr) {
          console.error('Failed to fetch categories', catErr);
        }

        const prodRes = await api.get(`/api/products/${id}`);
        const p = prodRes.data;
        setFormData({
          productName: p.productName || '',
          sku: p.sku || '',
          productDescription: p.productDescription || p.description || '',
          basePrice: p.basePrice || p.price || '',
          stockQty: p.stockQty || p.quantity || '',
          categoryId: p.categoryId || p.category?.categoryId || '',
          picture: p.picture || p.imageUrl || '',
        });
      } catch (prodErr) {
        console.error('Failed to fetch product', prodErr);
        const msg = prodErr.response?.data?.message || prodErr.response?.data || prodErr.message;
        setError(`Failed to load product: ${typeof msg === 'object' ? JSON.stringify(msg) : msg}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.productName || !formData.sku || !formData.basePrice || !formData.categoryId) {
        throw new Error('Please fill all required fields (Name, SKU, Price, Category)');
      }

      const payload = {
        productId: parseInt(id, 10),
        productName: formData.productName,
        sku: formData.sku,
        productDescription: formData.productDescription || null,
        description: formData.productDescription || null,
        basePrice: parseFloat(formData.basePrice),
        price: parseFloat(formData.basePrice),
        stockQty: parseInt(formData.stockQty, 10) || 0,
        quantity: parseInt(formData.stockQty, 10) || 0,
        categoryId: parseInt(formData.categoryId, 10),
        category: { categoryId: parseInt(formData.categoryId, 10) },
        picture: formData.picture || null,
      };

      await api.put(`/api/products/${id}`, payload);
      setSuccess('Product updated successfully');
      setTimeout(() => navigate(`/products/${id}`), 1200);
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="empty-state mono">Loading product data...</div>;

  return (
    <div className="editor-shell">
      <button onClick={() => navigate(-1)} className="back-link mono">
        &larr; Back
      </button>

      <div className="editor-form">
        <div className="section-header">
          <h2 className="section-title">Edit Entry</h2>
        </div>

        {error && <div className="status-box mb-4">ERR: {error}</div>}
        {success && <div className="status-box mb-4">STATUS: {success}</div>}

        <form onSubmit={handleSubmit} className="stack">
          <div className="grid-wide">
            <Input
              label="Name"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
            />
            <Input
              label="SKU"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryId" className="field-label">Category *</label>
            <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} required>
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
              id="basePrice"
              type="number"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleChange}
              step="0.01"
              required
            />
            <Input
              label="Stock"
              id="stockQty"
              type="number"
              name="stockQty"
              value={formData.stockQty}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Image URL"
            id="picture"
            name="picture"
            value={formData.picture}
            onChange={handleChange}
          />

          <TextArea
            label="Description"
            id="productDescription"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            rows="4"
          />

          <button type="submit" disabled={saving} className="w-full">
            {saving ? '...' : 'UPDATE'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
