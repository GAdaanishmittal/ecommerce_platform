import React, { useEffect, useState } from 'react';
import api from '../api/client';
import ErrorMessage from '../components/ui/ErrorMessage';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      const data = Array.isArray(response.data) ? response.data : [];
      data.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="empty-state mono">Loading categories...</div>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">Categories</h2>
        <span className="mono section-meta">COUNT: {categories.length}</span>
      </div>

      {categories.length === 0 ? (
        <div className="empty-state mono">No categories available</div>
      ) : (
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.categoryId} className="category-card">
              <div className="category-media">
                {cat.picture ? (
                  <img src={cat.picture} alt={cat.name} onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  <span className="mono section-meta">NULL_IMG</span>
                )}
              </div>
              <div className="category-copy">
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
