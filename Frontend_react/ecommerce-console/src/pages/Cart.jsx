import { useEffect, useState } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/cart');
      setCart(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        setCart({ items: [], totalAmount: 0 });
      } else {
        setError('Failed to fetch cart.');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    const originalCart = { ...cart };
    setCart({
      ...cart,
      items: cart.items.filter((item) => item.productId !== productId),
    });

    try {
      await api.delete(`/api/cart/remove/${productId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
      alert('Failed to remove item');
      setCart(originalCart);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const response = await api.post('/api/orders/checkout');
      const newOrderId = response.data.orderId;
      navigate(`/payments?orderId=${newOrderId}`);
    } catch (err) {
      alert('Checkout failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <div className="empty-state mono">Loading your cart...</div>;
  if (error) return <div className="status-box">ERROR: {error}</div>;

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="empty-state">
        <h2 className="section-title">Your bag is empty</h2>
        <button onClick={() => navigate('/products')} className="mt-4">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Bag</h2>
        <span className="mono section-meta">TOTAL: {formatCurrency(cart.totalAmount)}</span>
      </div>

      <div className="card">
        {cart.items.map((item) => (
          <div key={item.productId} className="cart-item">
            <div className="cart-item-info">
              <h3 className="cart-item-title">{item.productName}</h3>
              <div className="mono cart-item-price">UNIT_PRICE: {formatCurrency(item.priceAtAdd)}</div>
            </div>
            <div className="mono section-meta">QTY: {item.qty}</div>
            <div className="mono" style={{ fontWeight: 700 }}>
              {formatCurrency(item.subtotal)}
            </div>
            <button
              onClick={() => removeItem(item.productId)}
              title="Remove Item"
              className="cart-remove-btn"
            >
              &times;
            </button>
          </div>
        ))}

        <div className="cart-footer">
          <button onClick={handleCheckout} disabled={checkoutLoading}>
            {checkoutLoading ? '...' : 'PROCEED_TO_CHECKOUT'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
