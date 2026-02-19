import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
        qty: 1
      });
      navigate('/cart');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error || !product) return <div>{error || 'Product not found'}</div>;

  return (
    <div>
      <button onClick={() => navigate('/products')} className="secondary mb-4">&larr; Back to Products</button>
      
      <div className="product-detail-container">
        <div className="product-detail-image">
          {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.productName} />
          ) : (
              <span style={{ color: 'var(--text-secondary)', fontSize: '1.5rem' }}>No Image Available</span>
          )}
        </div>
        
        <div className="product-detail-info">
          <h1>{product.productName}</h1>
          <div className="product-detail-price">₹{product.basePrice || product.price}</div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {product.description || product.productDescription}
          </p>
          
          <div className="product-meta">
            <p><strong>Category:</strong> {product.categoryName || product.category?.categoryName || 'General'}</p>
            <p><strong>Stock:</strong> {product.stockQty || product.quantity}</p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={addToCart}
              disabled={adding}
              className="add-to-cart-btn"
              style={{ flex: 2 }}
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button 
              onClick={() => navigate(`/products/${id}/edit`)}
              className="secondary"
              style={{ flex: 1, padding: '1rem' }}
            >
              Edit Product
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section Placeholder - could integrate Reviews component here */}
    </div>
  );
};

export default ProductDetail;
