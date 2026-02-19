import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'CUSTOMER',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        role: isAdmin ? formData.role : 'CUSTOMER',
      };
      await register(payload);
      setSuccess('USER_CREATED_SUCCESSFULLY');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message || 'REGISTRATION_FAILED';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">NEW_UID</h2>
        <p className="auth-subtitle mono">Identity generation module</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@domain.com"
              required
            />
          </div>

          <div className="form-group">
            <Input
              label="Security_Code"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
            />
          </div>

          <div className="grid-two">
            {isAdmin ? (
              <div className="form-group">
                <label className="field-label">Access_Level</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="CUSTOMER">USER</option>
                  <option value="ADMIN">ROOT</option>
                </select>
              </div>
            ) : (
              <div className="form-group">
                <label className="field-label">Access_Level</label>
                <input value="USER" disabled readOnly />
              </div>
            )}
            <div className="form-group">
              <Input
                label="Phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1..."
              />
            </div>
          </div>

          <div className="form-group">
            <Input
              label="Address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street, city, zip"
            />
          </div>

          {error && <div className="status-box mb-4">ERR: {error}</div>}
          {success && <div className="status-box mb-4">STATUS: {success}</div>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? '...' : 'GENERATE'}
          </button>

          <button type="button" className="secondary login-btn mt-4" onClick={() => navigate('/login')}>
            CANCEL
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
