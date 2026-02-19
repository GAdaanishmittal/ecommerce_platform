import React, { useState } from 'react';
import api from '../api/client';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import ErrorMessage from '../components/ui/ErrorMessage';

const Reviews = () => {
  const [productId, setProductId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        productId: parseInt(productId, 10),
        rating: parseInt(rating, 10),
        comment,
      });
      setSubmitMsg('Review added successfully');
      setComment('');
      fetchReviews(productId);
    } catch (err) {
      alert('Failed to add review: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Review Logs</h2>
      </div>

      <div className="card mb-4">
        <form onSubmit={handleSearch} className="review-search">
          <Input
            type="number"
            placeholder="PRODUCT_ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? '...' : 'QUERY'}
          </button>
        </form>
      </div>

      <div className="reviews-layout">
        <div className="card">
          <h3 className="section-title">Entries [#{productId || '...'}]</h3>
          {error && <ErrorMessage message={error} />}

          {reviews.length === 0 && !loading && productId && !error && (
            <p className="mono section-meta mt-4">NULL_SET</p>
          )}

          <div className="review-list">
            {reviews.map((r, idx) => (
              <div key={idx} className="review-item">
                <div className="section-actions">
                  <strong className="mono section-meta">USER: {r.userEmail || 'ANON'}</strong>
                  <span className="mono section-meta">RATING: {r.rating}/5</span>
                </div>
                <p className="mt-4">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="review-entry">
          <h3 className="section-title">NEW_ENTRY</h3>
          <form onSubmit={handleSubmitReview} className="stack">
            <div className="form-group">
              <label className="field-label">Rating</label>
              <select value={rating} onChange={(e) => setRating(e.target.value)}>
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>{num}_STARS</option>
                ))}
              </select>
            </div>
            <TextArea
              label="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows="4"
            />
            <button type="submit" disabled={submitLoading || !productId}>
              {submitLoading ? '...' : 'SUBMIT'}
            </button>
            {submitMsg && <p className="mono section-meta">STATUS: {submitMsg}</p>}
            {!productId && <p className="mono section-meta">IDENTIFY PRODUCT TO INITIATE REVIEW</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
