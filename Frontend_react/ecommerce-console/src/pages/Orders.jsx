import React, { useEffect, useState } from 'react';
import api from '../api/client';
import ErrorMessage from '../components/ui/ErrorMessage';
import { formatCurrency } from '../utils/formatters';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrder = (id) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

  if (loading) return <div className="empty-state mono">Loading orders...</div>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Order History</h2>
        <span className="mono section-meta">TOTAL_LOGS: {orders.length}</span>
      </div>

      {orders.length === 0 ? (
        <p className="empty-state mono">EMPTY_LOG</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id mono">ID: {order.orderId}</span>
                  <span className="order-date mono">
                    DATE:{' '}
                    {order.orderDate
                      ? (() => {
                          try {
                            const d = Array.isArray(order.orderDate)
                              ? new Date(order.orderDate[0], order.orderDate[1] - 1, order.orderDate[2])
                              : new Date(order.orderDate);
                            return isNaN(d.getTime()) ? '...' : d.toLocaleDateString();
                          } catch {
                            return '...';
                          }
                        })()
                      : '...'}
                  </span>
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
                    {expandedOrders[order.orderId] ? 'HIDE_DETAILS' : 'SHOW_DETAILS'}
                  </button>
                </div>
              </div>

              {expandedOrders[order.orderId] && (
                <div className="stack mt-4">
                  {order.paymentMode ? (
                    <div className="status-box">
                      <div className="mono" style={{ marginBottom: '0.6rem', fontWeight: 700 }}>
                        TRANSACTION_LOG
                      </div>
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
                    </div>
                  ) : (
                    <div className="status-box mono">NO_TRANSACTION_DATA_AVAILABLE</div>
                  )}

                  <div className="mono section-meta">ORDER_ITEMS</div>
                  <table className="order-items-table">
                    <tbody>
                      {order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ textTransform: 'uppercase' }}>{item.productName}</td>
                          <td className="mono" style={{ textAlign: 'center' }}>
                            x{item.qty}
                          </td>
                          <td className="mono" style={{ textAlign: 'right' }}>
                            {formatCurrency(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
