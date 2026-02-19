import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/ui/Input';

const Login = () => {
  const [email, setEmail] = useState('daanish@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/products');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Login failed. Check credentials.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">EC_SYS</h2>
        <p className="auth-subtitle mono">Unauthorized access prohibited</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <Input
              label="Identity"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="uid@domain.com"
              required
            />
          </div>

          <div className="form-group">
            <Input
              label="Passcode"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

          {error && <div className="status-box mb-4">ERR: {error}</div>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? '...' : 'AUTHENTICATE'}
          </button>

          <div className="mt-4 text-center">
            <Link to="/createuser" className="mono section-meta">
              GENERATE_NEW_IDENTITY
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
