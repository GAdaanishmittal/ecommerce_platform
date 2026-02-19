import { useEffect, useState } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

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
      // Handle 404 cleanly (user has no cart yet)
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
    // Optimistic UI update
    const originalCart = { ...cart };
    setCart({
        ...cart,
        items: cart.items.filter(item => item.productId !== productId)
    });

    try {
      await api.delete(`/api/cart/remove/${productId}`);
      // Success, no need to refetch if we trust optimistic update, 
      // but strictly getting fresh calculation is safer for totals
      fetchCart(); 
    } catch (err) {
      console.error(err);
      alert('Failed to remove item');
      setCart(originalCart); // Revert on error
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const response = await api.post('/api/orders/checkout');
      // Redirect to Payments page with pre-filled Order ID
      const newOrderId = response.data.orderId;
      navigate(`/payments?orderId=${newOrderId}`); 
    } catch (err) {
      alert('Checkout failed: ' + (err.response?.data?.message || err.message));
    } finally {
        setCheckoutLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your cart...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  
  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  if (isEmpty) {
    return (
        <div className="text-center mt-4" style={{ padding: '4rem 2rem' }}>
            <h2>Your cart is empty</h2>
            <button onClick={() => navigate('/products')} className="mt-4">
                Browse Products
            </button>
        </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Shopping Cart</h2>
      
      <div>
          {cart.items.map((item) => (
            <div key={item.productId} className="cart-item">
                <div className="cart-item-info">
                    <h3 className="cart-item-title">{item.productName}</h3>
                    <div className="cart-item-price">Price: ₹{item.priceAtAdd?.toFixed(2)}</div>
                </div>
                <div className="cart-item-qty">
                    Qty: {item.qty}
                </div>
                <div className="cart-item-subtotal">
                    ₹{item.subtotal?.toFixed(2)}
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
      </div>

      <div className="cart-footer">
        <div className="cart-total">Total: ₹{cart.totalAmount?.toFixed(2)}</div>
        <button 
          onClick={handleCheckout}
          disabled={checkoutLoading}
          style={{ 
              fontSize: '1.25rem',
              padding: '1rem 2rem',
              minWidth: '250px'
          }}
        >
          {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
};

export default Cart;
