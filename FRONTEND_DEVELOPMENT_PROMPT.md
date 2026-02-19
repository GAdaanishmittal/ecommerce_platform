# Frontend Development Prompt - Ecommerce Platform

## 🎯 Project Overview

You are developing a frontend React/Next.js application for a full-featured ecommerce platform. The backend is a Spring Boot application running on `http://localhost:8080` with complete REST API support.

---

## 📋 Backend API Information

### Base URL
```
http://localhost:8080
```

### Authentication
- **JWT Token-based authentication**
- All authenticated endpoints require: `Authorization: Bearer {jwt_token}`
- Tokens are obtained from `/auth/login` endpoint
- Content-Type: `application/json`

---

## 🔐 Authentication Flow

### 1. Register User
**Endpoint:** `POST /auth/register`

```json
{
  "email": "user@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Main Street, City",
  "role": "CUSTOMER"
}
```

**Response:** `200 OK`
```json
"User registered successfully"
```

---

### 2. Login
**Endpoint:** `POST /auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "role": "CUSTOMER"
  }
}
```

Store the token in `localStorage` or cookie for subsequent requests.

---

## 🛍️ Product Management

### Get All Products
**Endpoint:** `GET /products`

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)

**Response:**
```json
{
  "content": [
    {
      "productId": 1,
      "productName": "Laptop",
      "description": "High-performance laptop",
      "price": 999.99,
      "quantity": 50,
      "imageUrl": "https://...",
      "rating": 4.5,
      "category": {
        "categoryId": 1,
        "categoryName": "Electronics"
      }
    }
  ],
  "totalElements": 100,
  "totalPages": 10,
  "currentPage": 0
}
```

### Get Product by ID
**Endpoint:** `GET /products/{productId}`

**Response:**
```json
{
  "productId": 1,
  "productName": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "quantity": 50,
  "imageUrl": "https://...",
  "rating": 4.5,
  "category": {...},
  "reviews": [...]
}
```

### Create Product (Admin Only)
**Endpoint:** `POST /products`

**Headers:** `Authorization: Bearer {admin_token}`

```json
{
  "productName": "New Product",
  "description": "Product description",
  "price": 99.99,
  "quantity": 100,
  "imageUrl": "https://...",
  "category": {
    "categoryId": 1
  }
}
```

---

## 📂 Categories API

### Get All Categories
**Endpoint:** `GET /categories`

**Response:**
```json
[
  {
    "categoryId": 1,
    "categoryName": "Electronics",
    "description": "Electronic devices"
  }
]
```

### Create Category (Admin Only)
**Endpoint:** `POST /categories`

**Headers:** `Authorization: Bearer {admin_token}`

```json
{
  "categoryName": "New Category",
  "description": "Category description"
}
```

---

## 🛒 Shopping Cart

### Get Cart
**Endpoint:** `GET /cart`

**Headers:** `Authorization: Bearer {user_token}`

**Response:**
```json
{
  "cartId": 1,
  "items": [
    {
      "cartItemId": 1,
      "product": {...},
      "quantity": 2,
      "price": 99.99
    }
  ],
  "totalPrice": 199.98
}
```

### Add Item to Cart
**Endpoint:** `POST /cart/items`

**Headers:** `Authorization: Bearer {user_token}`

```json
{
  "productId": 1,
  "quantity": 2
}
```

### Update Cart Item
**Endpoint:** `PUT /cart/items/{cartItemId}`

**Headers:** `Authorization: Bearer {user_token}`

```json
{
  "quantity": 5
}
```

### Remove Item from Cart
**Endpoint:** `DELETE /cart/items/{cartItemId}`

**Headers:** `Authorization: Bearer {user_token}`

---

## 📦 Orders

### Create Order
**Endpoint:** `POST /orders`

**Headers:** `Authorization: Bearer {user_token}`

```json
{
  "shippingAddress": "123 Main Street, City"
}
```

**Response:**
```json
{
  "orderId": 1,
  "totalAmount": 199.98,
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "orderDate": "2026-02-13T14:30:00",
  "items": [...]
}
```

### Get User Orders
**Endpoint:** `GET /orders`

**Headers:** `Authorization: Bearer {user_token}`

### Get Order by ID
**Endpoint:** `GET /orders/{orderId}`

**Headers:** `Authorization: Bearer {user_token}`

### Get Order Status
**Endpoint:** `GET /orders/{orderId}/status`

**Headers:** `Authorization: Bearer {user_token}`

---

## 💳 Payment Integration (Razorpay)

### Step 1: Initialize Payment
**Endpoint:** `POST /payments`

**Headers:** `Authorization: Bearer {user_token}`

```json
{
  "orderId": 1,
  "paymentMode": "Razorpay"
}
```

**Response (Razorpay Mode):**
```json
{
  "status": "RAZORPAY_ORDER_CREATED",
  "razorpayOrderId": "order_xyz123",
  "razorpayKeyId": "rzp_test_SDxsZtPvXuxnZB",
  "orderId": 1,
  "message": "Complete payment using Razorpay checkout"
}
```

**Response (Demo Mode):**
```json
{
  "status": "SUCCESS",
  "message": "Demo payment completed successfully",
  "orderId": "demo_123"
}
```

### Step 2: Frontend Razorpay Integration

```javascript
// Load Razorpay script
const script = document.createElement('script');
script.src = 'https://checkout.razorpay.com/v1/checkout.js';
document.body.appendChild(script);

// Initialize payment
async function initiatePayment(orderId) {
  const response = await fetch('http://localhost:8080/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      orderId: orderId,
      paymentMode: 'Razorpay'
    })
  });

  const data = await response.json();

  const options = {
    key: data.razorpayKeyId,
    amount: totalAmount * 100, // Amount in paise
    currency: 'INR',
    order_id: data.razorpayOrderId,
    handler: async function(response) {
      // Verify payment
      const verifyResponse = await fetch('http://localhost:8080/payments/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        })
      });

      const verifyData = await verifyResponse.json();
      
      if (verifyData.status === 'SUCCESS') {
        // Payment confirmed - show confirmation
        alert('Payment successful!');
        console.log('Transaction Date:', verifyData.transactionDate);
        console.log('Transaction ID:', verifyData.transactionId);
        // Redirect to order confirmation page
      }
    },
    prefill: {
      email: userEmail,
      contact: userPhone
    }
  };

  const razorpay = new Razorpay(options);
  razorpay.open();
}
```

### Step 3: Payment Verification Response

After successful payment verification, you'll receive:

```json
{
  "status": "SUCCESS",
  "message": "Payment verified and confirmed successfully",
  "orderId": "order_xyz123",
  "paymentId": "pay_xyz123",
  "signature": "signature_hash",
  "transactionDate": "2026-02-13T14:35:22.123456",
  "amount": 199.98,
  "transactionId": "5"
}
```

### Get Payment Status
**Endpoint:** `GET /payments/status/{orderId}`

**Response:**
```json
{
  "orderId": 1,
  "paymentStatus": "SUCCESS",
  "orderStatus": "CONFIRMED",
  "razorpayOrderId": "order_xyz123",
  "totalAmount": 199.98
}
```

### Get Payment Config
**Endpoint:** `GET /payments/config`

**Response:**
```json
{
  "razorpayKeyId": "rzp_test_SDxsZtPvXuxnZB",
  "demoMode": false
}
```

---

## ⭐ Reviews

### Add Review
**Endpoint:** `POST /reviews`

**Headers:** `Authorization: Bearer {user_token}`

```json
{
  "productId": 1,
  "rating": 5,
  "comment": "Great product!"
}
```

### Get Product Reviews
**Endpoint:** `GET /reviews/product/{productId}`

---

## 🎨 Frontend Component Structure

### Recommended Component Hierarchy

```
App
├── AuthContext/Provider
├── ShoppingCartContext/Provider
├── Layout
│   ├── Header (Navigation, Search, Cart Icon)
│   ├── Sidebar (Categories)
│   └── Footer
├── Pages
│   ├── Home
│   ├── ProductListing
│   ├── ProductDetail
│   ├── Cart
│   ├── Checkout
│   ├── PaymentConfirmation
│   ├── OrderHistory
│   ├── Login
│   ├── Register
│   └── UserProfile
└── Components
    ├── ProductCard
    ├── CartItem
    ├── PaymentForm
    ├── RazorpayCheckout
    └── OrderStatusTracker
```

---

## 📱 Key Frontend Features to Implement

### 1. Authentication
- [ ] Login page with email/password
- [ ] Registration page with validation
- [ ] JWT token storage and management
- [ ] Protected routes
- [ ] Logout functionality

### 2. Product Browsing
- [ ] Product listing with pagination
- [ ] Product detail page
- [ ] Category filtering
- [ ] Search functionality
- [ ] Rating display
- [ ] Product image gallery

### 3. Shopping Cart
- [ ] Add to cart
- [ ] View cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Cart total calculation
- [ ] Cart persistence (localStorage)

### 4. Checkout Process
- [ ] Address input form
- [ ] Order review
- [ ] Apply promo codes (if available)
- [ ] Order confirmation

### 5. Payment Integration
- [ ] Razorpay checkout modal
- [ ] Payment loading states
- [ ] Payment success/failure handling
- [ ] Transaction confirmation display
- [ ] Show transaction date and time
- [ ] Receipt generation

### 6. Orders & History
- [ ] View all orders
- [ ] Order status tracking
- [ ] Download invoice
- [ ] Return/cancel order

### 7. User Profile
- [ ] View profile information
- [ ] Edit profile
- [ ] Address management
- [ ] Payment methods (if applicable)

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login user |
| GET | `/products` | No | List products |
| GET | `/products/{id}` | No | Get product details |
| POST | `/products` | Admin | Create product |
| GET | `/categories` | No | List categories |
| POST | `/categories` | Admin | Create category |
| GET | `/cart` | Yes | Get user cart |
| POST | `/cart/items` | Yes | Add item to cart |
| PUT | `/cart/items/{id}` | Yes | Update cart item |
| DELETE | `/cart/items/{id}` | Yes | Remove cart item |
| POST | `/orders` | Yes | Create order |
| GET | `/orders` | Yes | Get user orders |
| GET | `/orders/{id}` | Yes | Get order details |
| POST | `/payments` | Yes | Initiate payment |
| POST | `/payments/verify` | Yes | Verify payment |
| GET | `/payments/status/{orderId}` | Yes | Get payment status |
| GET | `/payments/config` | Yes | Get payment config |
| POST | `/reviews` | Yes | Add review |
| GET | `/reviews/product/{id}` | No | Get product reviews |

---

## 🛡️ Security Guidelines

1. **Never expose JWT tokens** in version control
2. **Always use HTTPS** in production
3. **Validate input** on frontend before sending to backend
4. **Handle errors gracefully** with user-friendly messages
5. **Implement CORS** appropriately for API calls
6. **Use httpOnly cookies** for token storage if possible
7. **Implement rate limiting** for sensitive endpoints
8. **Clear sensitive data** on logout

---

## 🧪 Testing Credentials (Development)

```
Email: demo@example.com
Password: password123
Role: CUSTOMER
```

For Admin testing:
```
Email: admin@example.com
Password: admin123
Role: ADMIN
```

---

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints updated for production
- [ ] JWT token expiration set appropriately
- [ ] CORS configured for production domain
- [ ] Payment gateway credentials updated
- [ ] Error handling for network failures
- [ ] Loading states implemented
- [ ] Responsive design tested
- [ ] SEO optimization
- [ ] Performance optimization (code splitting, lazy loading)

---

## 📞 Support & Documentation

- **API Reference:** See `API_REFERENCE.md`
- **Backend GitHub:** Your repository
- **Razorpay Docs:** https://razorpay.com/docs/
- **React Docs:** https://react.dev/

---

## 🎓 Tech Stack Recommendations

- **Framework:** React 18+ / Next.js 14+
- **State Management:** Context API / Redux / Zustand
- **HTTP Client:** Axios / TanStack Query
- **Styling:** Tailwind CSS / Material-UI
- **Form Management:** React Hook Form
- **Validation:** Zod / Yup
- **Testing:** Jest / Vitest / React Testing Library

---

## 💡 Notes for Developer

1. The backend handles all business logic - frontend is presentation layer
2. Always include JWT token in Authorization header for authenticated endpoints
3. Transaction dates and times are in ISO 8601 format
4. Amount in responses is in INR (Indian Rupees)
5. Demo mode is useful for testing without Razorpay integration
6. All timestamps are in UTC+5:30 (IST) timezone
7. Implement proper error boundaries and error handling
8. Show loading indicators during API calls
9. Implement proper logout mechanism to clear tokens
10. Test payment flow thoroughly with Razorpay test keys

---

**Last Updated:** February 13, 2026
**Version:** 1.0

