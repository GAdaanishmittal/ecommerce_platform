import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';

const ProductForm = ({ initialData = {}, onSubmit, loading, error, success, categories = [] }) => {
  const [formData, setFormData] = useState({
    productName: '',
    sku: '',
    productDescription: '',
    basePrice: '',
    stockQty: '',
    categoryId: '',
    picture: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        productName: initialData.productName || '',
        sku: initialData.sku || '',
        productDescription: initialData.productDescription || initialData.description || '',
        basePrice: initialData.basePrice || initialData.price || '',
        stockQty: initialData.stockQty || initialData.quantity || '',
        categoryId: initialData.categoryId || (initialData.category ? initialData.category.categoryId : '') || '',
        picture: initialData.picture || initialData.imageUrl || ''
      });
    }
  }, [initialData]);

  const validate = () => {
    const errors = {};
    if (!formData.productName.trim()) errors.productName = 'Product Name is required';
    if (!formData.sku.trim()) errors.sku = 'SKU is required';
    if (!formData.basePrice) errors.basePrice = 'Price is required';
    if (parseFloat(formData.basePrice) <= 0) errors.basePrice = 'Price must be greater than 0';
    if (!formData.categoryId) errors.categoryId = 'Category is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <Input
          label="Name"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          error={validationErrors.productName}
          required
        />
        <Input
          label="SKU"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          error={validationErrors.sku}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Category *</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">SELECT</option>
            {categories.map(cat => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
          <Input
            label="Price (INR)"
          name="basePrice"
          type="number"
          step="0.01"
          value={formData.basePrice}
          onChange={handleChange}
          error={validationErrors.basePrice}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <Input
          label="Stock"
          name="stockQty"
          type="number"
          value={formData.stockQty}
          onChange={handleChange}
        />
        <Input
          label="Image URL"
          name="picture"
          value={formData.picture}
          onChange={handleChange}
        />
      </div>

      <TextArea
        label="Description"
        name="productDescription"
        value={formData.productDescription}
        onChange={handleChange}
        rows={4}
      />

      <div style={{ marginTop: '1rem' }}>
        {error && <div style={{ marginBottom: '1rem', border: '1px solid var(--text-primary)', padding: '1rem', fontSize: '0.75rem' }}>ERROR: {error}</div>}
        <Button type="submit" disabled={loading} fullWidth>
          {loading ? '...' : 'SAVE'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
