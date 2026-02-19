import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
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
      alert('Added to cart!');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="text-center mt-4">Loading products…</div>;
  if (error)
    return (
      <div className="text-center mt-4" style={{ color: 'var(--error-color)' }}>
        {error}{' '}
        <button onClick={fetchProducts} className="secondary" style={{ marginLeft: '8px' }}>
          Retry
        </button>
      </div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Products ({products.length})</h2>
        <div className="flex gap-2">
          <button onClick={() => navigate('/products/add')}>+ Add Product</button>
          <button onClick={fetchProducts} className="secondary">Refresh</button>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-center" style={{ color: 'var(--text-secondary)' }}>No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div key={p.productId} className="card product-card">
              <div className="product-image-placeholder">
                {p.imageUrl ? (
                  <img 
                    src={p.imageUrl} 
                    alt={p.productName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
                  />
                ) : (
                  <span>No Image</span>
                )}
              </div>
              
              <Link to={`/products/${p.productId}`} className="product-title">
                {p.productName}
              </Link>
              
              <div className="product-price">₹{p.basePrice?.toFixed(2)}</div>
              
              {p.productDescription && (
                <div className="product-desc">
                  {p.productDescription.length > 60 
                    ? p.productDescription.substring(0, 60) + '...' 
                    : p.productDescription}
                </div>
              )}
              
              <div className="product-actions">
                <div className="flex gap-2">
                  <button onClick={() => addToCart(p.productId)} style={{ flex: 2 }}>
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => navigate(`/products/${p.productId}/edit`)} 
                    className="secondary" 
                    style={{ flex: 1, padding: '0.6em' }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
