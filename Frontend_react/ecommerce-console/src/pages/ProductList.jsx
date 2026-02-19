import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/products/ProductCard';
import { useAuth } from '../context/AuthContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/products');
      const data = Array.isArray(response.data) ? response.data : [];
      data.sort((a, b) => (a.productName || '').localeCompare(b.productName || ''));
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products: ' + (err.response?.data?.message || err.message || 'Unknown error'));
      if (err.response?.status === 401) {
        setError('Session expired. Please logout and login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      await api.post('/api/cart/add', { productId, qty: 1 });
      alert('Added to cart');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="empty-state mono">Loading products...</div>;
  if (error) {
    return (
      <div className="status-box">
        {error}
        <div className="section-actions mt-4">
          <button onClick={fetchProducts} className="secondary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Directory</h2>
        <div className="section-actions">
          <span className="mono section-meta">INDEX: {products.length}</span>
          {isAdmin && (
            <button onClick={() => navigate('/products/add')}>+ NEW</button>
          )}
          <button onClick={fetchProducts} className="secondary">
            SYNC
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="empty-state mono">No products found</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard
              key={p.productId}
              product={p}
              onAddToCart={addToCart}
              canEdit={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
