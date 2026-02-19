import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';

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
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch categories
        let categoriesData = [];
        try {
          const catRes = await api.get('/api/categories');
          categoriesData = catRes.data;
          setCategories(categoriesData);
        } catch (catErr) {
          console.error('Failed to fetch categories', catErr);
          // Non-critical, but we should know
        }

        // Fetch product
        try {
          const prodRes = await api.get(`/api/products/${id}`);
          const p = prodRes.data;
          
          setFormData({
            productName: p.productName || '',
            sku: p.sku || '',
            productDescription: p.productDescription || p.description || '',
            basePrice: p.basePrice || p.price || '',
            stockQty: p.stockQty || p.quantity || '',
            categoryId: p.categoryId || p.category?.categoryId || '',
            imageUrl: p.imageUrl || ''
          });
        } catch (prodErr) {
          console.error('Failed to fetch product', prodErr);
          const msg = prodErr.response?.data?.message || prodErr.response?.data || prodErr.message;
          setError(`Failed to load product: ${typeof msg === 'object' ? JSON.stringify(msg) : msg}`);
        }
      } catch (err) {
        console.error('General error in EditProduct', err);
        setError('An unexpected error occurred');
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
        throw new Error('Please fill in all required fields (Name, SKU, Price, Category)');
      }

      const payload = {
        productId: parseInt(id),
        productName: formData.productName,
        sku: formData.sku,
        productDescription: formData.productDescription || null,
        description: formData.productDescription || null, 
        basePrice: parseFloat(formData.basePrice),
        price: parseFloat(formData.basePrice), 
        stockQty: parseInt(formData.stockQty) || 0,
        quantity: parseInt(formData.stockQty) || 0,
        categoryId: parseInt(formData.categoryId),
        category: {
          categoryId: parseInt(formData.categoryId)
        },
        imageUrl: formData.imageUrl || null
      };

      await api.put(`/api/products/${id}`, payload);
      setSuccess('Product updated successfully!');
      setTimeout(() => navigate(`/products/${id}`), 1500);
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-4">Loading product data...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <button onClick={() => navigate(-1)} className="secondary mb-4">&larr; Back</button>
      
      <div className="card">
        <h2 className="mb-4">Edit Product</h2>
        
        {error && (
          <div style={{ color: 'var(--error-color)', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ color: 'var(--success-color)', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="productName" className="form-label">Product Name *</label>
              <input
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sku" className="form-label">SKU *</label>
              <input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="categoryId" className="form-label">Category *</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="basePrice" className="form-label">Price (₹) *</label>
              <input
                id="basePrice"
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="stockQty" className="form-label">Stock Quantity</label>
              <input
                id="stockQty"
                type="number"
                name="stockQty"
                value={formData.stockQty}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl" className="form-label">Image URL</label>
            <input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="productDescription" className="form-label">Description</label>
            <textarea
              id="productDescription"
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              rows="4"
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
          >
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
