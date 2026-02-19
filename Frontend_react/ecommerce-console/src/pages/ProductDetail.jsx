import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      console.error(err);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    setAdding(true);
    try {
      await api.post('/api/cart/add', {
        productId: product.productId,
        qty: 1,
      });
      navigate('/cart');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="empty-state mono">Loading...</div>;
  if (error || !product) return <div className="status-box">{error || 'Product not found'}</div>;

  return (
    <div className="container">
      <button onClick={() => navigate('/products')} className="back-link mono">
        &larr; Back to directory
      </button>

      <div className="product-detail-container">
        <div className="product-detail-image">
          {product.picture ? (
            <img src={product.picture} alt={product.productName} />
          ) : (
            <div className="mono section-meta">NO_IMAGE</div>
          )}
        </div>

        <div className="product-detail-info">
          <h1>{product.productName}</h1>
          <div className="product-detail-price mono">{formatCurrency(product.basePrice || product.price)}</div>

          <div className="detail-strip">
            {product.description || product.productDescription}
          </div>

          <div className="detail-grid">
            <div>
              <span className="detail-label">Category</span>
              <div className="detail-value mono">{product.categoryName || product.category?.categoryName || 'GENERAL'}</div>
            </div>
            <div>
              <span className="detail-label">Stock</span>
              <div className="detail-value mono">{product.stockQty || product.quantity} UNITS</div>
            </div>
          </div>

          <div className="detail-action-row">
            <button onClick={addToCart} disabled={adding}>
              {adding ? '...' : 'ADD_TO_BAG'}
            </button>
            {isAdmin && (
              <button onClick={() => navigate(`/products/${id}/edit`)} className="secondary">
                EDIT
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
