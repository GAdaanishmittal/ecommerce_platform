import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import { formatCurrency } from '../utils/formatters';

const Payments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [orderAmount, setOrderAmount] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id) => {
    try {
      const response = await api.get(`/api/orders/${id}`);
      if (response.data && response.data.totalAmount) {
        setOrderAmount(response.data.totalAmount);
      }
    } catch (err) {
      console.error('Could not fetch order details', err);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/api/payments', {
        orderId: parseInt(orderId, 10),
        paymentMode: 'Razorpay',
      });

      const data = response.data;

      if (data.status === 'SUCCESS' || data.transactionId) {
        const dateStr = data.transactionDate ? new Date(data.transactionDate).toLocaleString() : new Date().toLocaleString();
        setMessage(
          <div className="mono">
            <div>PAYMENT_EXECUTED</div>
            <div>REF: {data.paymentId || data.transactionId || 'DEMO_MODE'}</div>
            <div>DATE: {dateStr}</div>
            <div className="section-meta mt-4">REDIRECTING_TO_LOGS...</div>
          </div>
        );
        setLoading(false);
        setTimeout(() => navigate('/orders'), 1800);
        return;
      }

      if (data.razorpayOrderId) {
        if (!data.razorpayKeyId && !data.key) {
          throw new Error('Razorpay Key ID missing from backend response.');
        }
        const keyId = data.razorpayKeyId || data.key;

        const options = {
          key: keyId,
          amount: data.amount ? data.amount : ((orderAmount || data.totalAmount) * 100),
          currency: 'INR',
          name: 'SYS_REVENUE',
          description: `ORDER_ID: ${orderId}`,
          order_id: data.razorpayOrderId,
          handler: async (paymentResponse) => {
            try {
              setLoading(true);
              const verifyResp = await api.post('/api/payments/verify', {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                orderId: parseInt(orderId, 10),
              });

              const verifyData = verifyResp.data;
              if (verifyData.status === 'SUCCESS' || verifyData.paymentStatus === 'SUCCESS') {
                const dateStr = verifyData.transactionDate ? new Date(verifyData.transactionDate).toLocaleString() : new Date().toLocaleString();
                setMessage(
                  <div className="mono">
                    <div>VERIFICATION_SUCCESS</div>
                    <div>GATEWAY_ID: {verifyData.paymentId}</div>
                    <div>INTERNAL_ID: {verifyData.transactionId}</div>
                    <div>DATE: {dateStr}</div>
                    <div>AMOUNT: {formatCurrency(verifyData.amount)}</div>
                    <div className="section-meta mt-4">REDIRECTING_TO_LOGS...</div>
                  </div>
                );
                setTimeout(() => navigate('/orders'), 2200);
              } else {
                setMessage('STATUS: VERIFIED');
                setTimeout(() => navigate('/orders'), 1000);
              }
            } catch (verifyErr) {
              console.error(verifyErr);
              setError('PAYMENT_VERIFICATION_FAILED');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: user?.email || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          theme: {
            color: '#000000',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (responseFail) => {
          setError(`Payment Failed: ${responseFail.error.description}`);
          setLoading(false);
        });
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Payment initialization failed.');
      setLoading(false);
    }
  };

  return (
    <div className="payment-shell">
      <div className="card">
        <div className="section-header">
          <h2 className="section-title">Checkout Session</h2>
        </div>

        <form onSubmit={handlePayment} className="stack">
          <div className="form-group">
            <Input
              label="Order_ID"
              type="number"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
              placeholder="ID"
            />
          </div>

          {orderAmount && (
            <div className="payment-total">
              <span className="mono section-meta">TOTAL_DUE</span>
              <div className="mono">{formatCurrency(orderAmount)}</div>
            </div>
          )}

          <button type="submit" disabled={loading || !orderId}>
            {loading ? '...' : 'EXECUTE_PAYMENT'}
          </button>
        </form>
      </div>

      {message && (
        <div className="status-box mt-4">
          <div className="mono">SUCCESS</div>
          <div className="mt-4">{message}</div>
        </div>
      )}

      {error && (
        <div className="status-box mt-4">
          <div className="mono">FAILURE</div>
          <div className="mt-4">{error}</div>
        </div>
      )}
    </div>
  );
};

export default Payments;
