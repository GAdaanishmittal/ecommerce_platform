import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="app-nav">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/products" className="nav-brand">
          CONSOLE
        </Link>
      </div>
      
      <div className="nav-links">
        <Link to="/products" className={getLinkClass('/products')}>Products</Link>
        <Link to="/categories" className={getLinkClass('/categories')}>Categories</Link>
        <Link to="/cart" className={getLinkClass('/cart')}>Bag</Link>
        <Link to="/orders" className={getLinkClass('/orders')}>Orders</Link>
        {user?.roles?.includes('ROLE_ADMIN') && (
          <Link to="/admin/orders" className={getLinkClass('/admin/orders')}>Admin</Link>
        )}
      </div>
      
      <div className="nav-user">
        {user && (
          <span className="user-email">
            {user.email}
          </span>
        )}
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
