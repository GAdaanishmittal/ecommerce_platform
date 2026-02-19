import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

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
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/api/categories'),
          api.get('/api/products')
        ]);
        
        setCategories(catRes.data);
        
        // Calculate next ID for SKU
        const products = Array.isArray(prodRes.data) ? prodRes.data : [];
        const nextId = products.length > 0 
          ? Math.max(...products.map(p => p.productId || 0)) + 1 
          : 1;
        
        setFormData(prev => ({
          ...prev,
          sku: `PROD-${nextId.toString().padStart(3, '0')}`
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
      // Validate inputs
      if (!formData.productName || !formData.sku || !formData.basePrice || !formData.categoryId) {
        throw new Error('Please fill in all required fields (Name, SKU, Price, Category)');
      }

      const payload = {
        productName: formData.productName,
        sku: formData.sku,
        productDescription: formData.productDescription || null,
        description: formData.productDescription || null, 
        basePrice: parseFloat(formData.basePrice),
        price: parseFloat(formData.basePrice), 
        stockQty: parseInt(formData.stockQty) || 0,
        quantity: parseInt(formData.stockQty) || 0,
        categoryId: parseInt(formData.categoryId), // Flat ID
        category: {
          categoryId: parseInt(formData.categoryId) // Nested object
        },
        imageUrl: formData.imageUrl || null
      };

      console.log('Sending payload:', payload);
      await api.post('/api/products', payload);
      setSuccess('Product added successfully!');
      setTimeout(() => navigate('/products'), 1500);
    } catch (err) {
      console.error('Error adding product:', err);
      
      // Handle detailed validation errors if provided by the backend
      let errorMsg = 'Failed to add product';
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          errorMsg = data;
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.errors && Array.isArray(data.errors)) {
          // Spring Boot often returns errors array
          errorMsg = data.errors.map(e => e.defaultMessage || e).join(', ');
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
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <button onClick={() => navigate('/products')} className="secondary mb-4">&larr; Back to Products</button>
      
      <div className="card">
        <h2 className="mb-4">Add New Product</h2>
        
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
              <label className="form-label">Product Name *</label>
              <input
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="e.g. Wireless Headphones"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">SKU *</label>
              <input
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="PROD-123"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
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
              <label className="form-label">Price (₹) *</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input
                type="number"
                name="stockQty"
                value={formData.stockQty}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              placeholder="Describe the product..."
              rows="4"
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
