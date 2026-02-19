import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from 'react-router-dom';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import { AuthProvider, useAuth } from './context/AuthContext';

import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Payments from './pages/Payments';
import Reviews from './pages/Reviews';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import './App.css';

/* ---------- Protected route wrapper ---------- */
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

/* ---------- Nav layout ---------- */
const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <div className="app-container">
      <nav className="app-nav">
        <div className="nav-links">
          <Link to="/products" className="nav-brand">
            Ecommerce Console
          </Link>
          <Link to="/products" className={getLinkClass('/products')}>Products</Link>
          <Link to="/categories" className={getLinkClass('/categories')}>Categories</Link>
          <Link to="/cart" className={getLinkClass('/cart')}>Cart</Link>
          <Link to="/orders" className={getLinkClass('/orders')}>Orders</Link>
          <Link to="/payments" className={getLinkClass('/payments')}>Pay</Link>
          <Link to="/reviews" className={getLinkClass('/reviews')}>Reviews</Link>
        </div>
        
        <div className="nav-user">
          {user && (
            <span className="user-email">
              {user.email}
            </span>
          )}
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
};

/* ---------- App ---------- */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected pages */}
          <Route path="/products" element={<ProtectedRoute><Layout><ProductList /></Layout></ProtectedRoute>} />
          <Route path="/products/add" element={<ProtectedRoute><Layout><AddProduct /></Layout></ProtectedRoute>} />
          <Route path="/products/:id" element={<ProtectedRoute><Layout><ProductDetail /></Layout></ProtectedRoute>} />
          <Route path="/products/:id/edit" element={<ProtectedRoute><Layout><EditProduct /></Layout></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><Layout><Categories /></Layout></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Layout><Cart /></Layout></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Layout><Orders /></Layout></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><Layout><Payments /></Layout></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><Layout><Reviews /></Layout></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
