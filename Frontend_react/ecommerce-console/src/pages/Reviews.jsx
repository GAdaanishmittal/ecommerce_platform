import { useState } from 'react';
import api from '../api/client';

const Reviews = () => {
  const [productId, setProductId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state for adding review
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  const fetchReviews = async (pId) => {
    if (!pId) return;
    setLoading(true);
    setError(null);
    setReviews([]);
    try {
      const response = await api.get(`/api/reviews/${pId}`);
      setReviews(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch reviews. Check Product ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReviews(productId);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitMsg('');
    try {
      await api.post('/api/reviews', {
        productId: parseInt(productId),
        rating: parseInt(rating),
        comment
      });
      setSubmitMsg('Review added successfully!');
      setComment('');
      // Refresh list
      fetchReviews(productId);
    } catch (err) {
      alert('Failed to add review: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Product Reviews</h2>

      {/* Search Section */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="number"
            placeholder="Enter Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            style={{ flex: 1, padding: '10px' }}
          />
          <button type="submit" disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            {loading ? 'Loading...' : 'Get Reviews'}
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Reviews List */}
        <div>
          <h3>Reviews for Product #{productId || '...'}</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          {reviews.length === 0 && !loading && productId && !error && (
            <p style={{ color: '#666' }}>No reviews found.</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {reviews.map((r, idx) => (
              <div key={idx} style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <strong>User: {r.userEmail || 'Anonymous'}</strong>
                  <span style={{ color: '#f39c12' }}>{'★'.repeat(r.rating)}</span>
                </div>
                <p style={{ margin: 0 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Add Review Form */}
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0 }}>Write a Review</h3>
          <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Rating</label>
              <select 
                value={rating} 
                onChange={(e) => setRating(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              >
                {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows="4"
                style={{ width: '100%', padding: '8px', resize: 'vertical' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={submitLoading || !productId}
              style={{ padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              {submitLoading ? 'Submitting...' : 'Submit Review'}
            </button>
            {submitMsg && <p style={{ color: 'green', margin: '5px 0 0 0' }}>{submitMsg}</p>}
            {!productId && <p style={{ fontSize: '0.8em', color: '#666' }}>Select a product first to review.</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
