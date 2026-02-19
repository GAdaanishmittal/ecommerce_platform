import { useEffect, useState } from 'react';
import api from '../api/client';

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
      setCategories(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading categories...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Categories</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {categories.map((cat) => (
          <div key={cat.categoryId} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
             {/* Placeholder for image if picture URL is valid, else fallback */}
             <div style={{ height: '150px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cat.picture ? (
                    <img src={cat.picture} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                         onError={(e) => {e.target.onerror = null; e.target.style.display='none'; e.target.parentNode.innerText = cat.name;}}
                    />
                ) : (
                    <span style={{ fontSize: '1.2em', color: '#888' }}>{cat.name}</span>
                )}
             </div>
            <div style={{ padding: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{cat.name}</h3>
              <p style={{ margin: 0, color: '#666' }}>{cat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
