import { useEffect, useState } from 'react';
import api from '../api/client';
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';
import { formatCurrency } from '../utils/formatters';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrder = (id) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/orders/all');
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      setError('ACCESS_DENIED_OR_SYNC_FAIL');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status?status=${newStatus}`);
      fetchAllOrders();
    } catch (err) {
      console.error(err);
      alert('STATUS_UPDATE_FAILED');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const formatOrderDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString();
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const getUserLabel = (order) => {
    if (order.userEmail) return order.userEmail;
    if (order.userId) return `ID:${order.userId}`;
    return null;
  };

  return (
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Master Order Log</h2>
        <span className="mono section-meta">TOTAL: {orders.length}</span>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.orderId} className="order-card">
            <div className="order-header">
              <div>
                <span className="order-id mono">LOG_ID: {order.orderId}</span>
                {getUserLabel(order) ? (
                  <span className="order-date mono">USER: {getUserLabel(order)}</span>
                ) : (
                  <span className="order-date mono">DATE: {formatOrderDate(order.orderDate)}</span>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="status-row">
                  <span className="status-chip status-chip--shipping">SHIP: {order.status || 'PENDING'}</span>
                  <span className="status-chip status-chip--payment">
                    PAY: {order.transactionStatus || (order.paymentMode ? 'INITIATED' : 'PENDING')}
                  </span>
                </div>
                <span className="order-total mono">{formatCurrency(order.totalAmount)}</span>
                <button onClick={() => toggleOrder(order.orderId)} className="secondary mt-4">
                  {expandedOrders[order.orderId] ? 'HIDE_LOGS' : 'VIEW_LOGS'}
                </button>
              </div>
            </div>

            {expandedOrders[order.orderId] && (
              <div className="status-box mb-4">
                <div className="mono" style={{ marginBottom: '0.6rem', fontWeight: 700 }}>
                  TRANSACTION_LOG
                </div>
                {order.paymentMode ? (
                  <div className="grid-two">
                    <div>
                      <span className="detail-label">Internal_ID</span>
                      <div className="mono detail-value">#{order.transactionId || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="detail-label">Gateway_Ref</span>
                      <div className="mono detail-value">{order.transactionRef || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="detail-label">Mode</span>
                      <div className="mono detail-value">{order.paymentMode}</div>
                    </div>
                    <div>
                      <span className="detail-label">Txn_Status</span>
                      <div className="mono detail-value">{order.transactionStatus || 'N/A'}</div>
                    </div>
                  </div>
                ) : (
                  <div className="mono">NO_TRANSACTION_LINKED</div>
                )}
              </div>
            )}

            <div className="section-actions">
              {['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(order.orderId, status)}
                  className={order.status === status ? '' : 'secondary'}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
