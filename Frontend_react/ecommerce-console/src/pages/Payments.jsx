import { useState, useEffect } from 'react';
import api from '../api/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  // Load Razorpay SDK handled in previous useEffect
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch Order Details when orderId changes
  useEffect(() => {
    if (orderId) {
        fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id) => {
      try {
          // Trying standard endpoint for order details
          const response = await api.get(`/api/orders/${id}`);
          if (response.data && response.data.totalAmount) {
              setOrderAmount(response.data.totalAmount);
          }
      } catch (err) {
          console.error("Could not fetch order details", err);
          // Don't block payment flow, just ignore specific amount display if fail
      }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      // Step 1: Initialize Payment
      const response = await api.post('/api/payments', {
        orderId: parseInt(orderId),
        paymentMode: 'Razorpay'
      });

      const data = response.data;
      
      // Update amount if backend returned it fresh
      if (data.amount) {
          // Razorpay returns amount in paise usually, or backend might normalize
          // we use it for display reference if needed
      }

      // Handle "Demo Mode" or Mock response instantly
      if (data.status === 'SUCCESS' || data.transactionId) {
          setMessage(`Payment Successful! Transaction Ref: ${data.transactionId || 'Demo Mode'}`);
          setLoading(false);
          return;
      }

      // Handle Razorpay Flow
      if (data.razorpayOrderId) {
          if (!data.razorpayKeyId && !data.key) {
               throw new Error("Razorpay Key ID missing from backend response.");
          }
          const keyId = data.razorpayKeyId || data.key; 

          const options = {
            key: keyId,
            amount: data.amount ? data.amount : ( (orderAmount || data.totalAmount) * 100), 
            currency: 'INR',
            name: "Ecommerce Console",
            description: `Order #${orderId}`,
            order_id: data.razorpayOrderId,
            handler: async function (response) {
                try {
                    // Step 3: Verify Payment
                    const verifyResp = await api.post('/api/payments/verify', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: parseInt(orderId) 
                    });
                    
                    const verifyData = verifyResp.data;
                    if (verifyData.status === 'SUCCESS' || verifyData.paymentStatus === 'SUCCESS') {
                        const dateStr = verifyData.transactionDate ? new Date(verifyData.transactionDate).toLocaleString() : 'Just now';
                        setMessage(
                            <div>
                                <h3 style={{ margin: '0 0 10px 0', color: '#27ae60' }}>Payment Successful!</h3>
                                <p><strong>Transaction ID:</strong> {verifyData.paymentId || verifyData.transactionId}</p>
                                <p><strong>Date:</strong> {dateStr}</p>
                                <p><strong>Amount:</strong> ₹{verifyData.amount || verifyData.totalAmount}</p>
                            </div>
                        );
                    } else {
                         setMessage('Payment Verified.');
                    }
                } catch (verifyErr) {
                    console.error(verifyErr);
                    setError('Payment verification failed on server.');
                }
            },
            prefill: {
                name: user?.email || '', 
                email: user?.email || '',
                contact: user?.phone || ''
            },
            theme: {
                color: "#3399cc"
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response){
             setError(`Payment Failed: ${response.error.description}`);
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
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Secure Checkout</h2>
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
          <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Order ID</label>
              <input 
                type="number" 
                value={orderId} 
                onChange={(e) => setOrderId(e.target.value)} 
                required 
                placeholder="Enter Order ID"
                style={{ width: '100%', padding: '12px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            {orderAmount && (
                <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px', textAlign: 'center' }}>
                    <span style={{ color: '#666' }}>Assessed Total:</span>
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#2c3e50' }}>
                        ₹{parseFloat(orderAmount).toFixed(2)}
                    </div>
                </div>
            )}
            
            <button 
                type="submit" 
                disabled={loading || !orderId}
                style={{ 
                    padding: '14px', 
                    backgroundColor: loading ? '#bdc3c7' : '#27ae60', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: loading ? 'wait' : 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    marginTop: '10px'
                }}
            >
              {loading ? 'Processing...' : `Pay ${orderAmount ? '₹'+orderAmount : 'with Razorpay'}`}
            </button>
          </form>
      </div>

      {message && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>
            <strong>Success!</strong> {message}
          </div>
      )}
      
      {error && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
            <strong>Error:</strong> {error}
          </div>
      )}
    </div>
  );
};

export default Payments;
