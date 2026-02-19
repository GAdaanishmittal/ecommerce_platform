import { useEffect, useState } from 'react';
import api from '../api/client';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders/my');
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-4">Loading orders...</div>;
  if (error) return <div className="text-center mt-4" style={{ color: 'var(--error-color)' }}>{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center" style={{ color: 'var(--text-secondary)' }}>No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order.orderId}</span>
                  <span className="order-date">{new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="order-status" style={{ marginRight: '1rem' }}>{order.status}</span>
                  <span className="order-total">Total: ₹{order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
              
              <table className="order-items-table">
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ width: '60%' }}>{item.productName}</td>
                      <td style={{ width: '20%', textAlign: 'center' }}>x{item.qty}</td>
                      <td style={{ width: '20%', textAlign: 'right' }}>₹{item.subtotal?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
