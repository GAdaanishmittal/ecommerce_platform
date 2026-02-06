# Ecommerce API Reference Guide

Complete API documentation with endpoints, request/response formats, and examples.

---

## 📋 Table of Contents

1. [Server Information](#server-information)
2. [Authentication](#authentication)
3. [Products API](#products-api)
4. [Categories API](#categories-api)
5. [Cart API](#cart-api)
6. [Orders API](#orders-api)
7. [Payments API](#payments-api)
8. [Reviews API](#reviews-api)
9. [Quick Reference](#quick-reference)

---

## Server Information

| Property | Value |
|----------|-------|
| **Base URL** | `http://localhost:8080` |
| **Port** | `8080` |
| **Protocol** | HTTP/HTTPS |
| **Content-Type** | `application/json` |

---

## Authentication

### 1. Register User

**Endpoint:** `POST /auth/register`

**Description:** Register a new user account with optional role selection

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Main Street, City",
  "role": "CUSTOMER"
}
```

**Field Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid email address |
| `password` | string | Yes | Password (min 6 characters recommended) |
| `phone` | string | No | Contact phone number |
| `address` | string | No | User address |
| `role` | string | No | User role: "CUSTOMER" or "ADMIN" (defaults to "CUSTOMER") |

**Response:** `200 OK`
```json
"User registered successfully"
```

**cURL Example:**
```bash
# Register as Customer (default)
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "pass123",
    "phone": "9876543210",
    "address": "Customer Street",
    "role": "CUSTOMER"
  }'

# Register as Admin
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

---

### 2. Login

**Endpoint:** `POST /auth/login`

**Description:** Login and receive JWT token

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjMyMTQ2NDAwLCJleHAiOjE2MzIxNTAwMDB9.signature
```

**Usage:** Store this token and include it in all authenticated requests:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

## Products API

### 1. List All Products

**Endpoint:** `GET /api/products`

**Description:** Get all available products

**Authentication:** Not required

**Response:** `200 OK`
```json
[
  {
    "productId": 1,
    "productName": "iPhone 15",
    "productDescription": "Latest Apple smartphone",
    "sku": "IPH15-128",
    "picture": "https://example.com/iphone15.jpg",
    "basePrice": 79999.00,
    "stockQty": 50,
    "categoryId": 1,
    "categoryName": "Electronics"
  }
]
```

**cURL Example:**
```bash
curl http://localhost:8080/api/products
```

---

### 2. Get Products by Category

**Endpoint:** `GET /api/products/category/{categoryId}`

**Description:** Filter products by category

**Authentication:** Not required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `categoryId` | Long | Category ID |

**cURL Example:**
```bash
curl http://localhost:8080/api/products/category/1
```

---

### 3. Search Products

**Endpoint:** `GET /api/products/search`

**Description:** Search products by keyword

**Authentication:** Not required

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `keyword` | string | Search term |

**cURL Example:**
```bash
curl "http://localhost:8080/api/products/search?keyword=iPhone"
```

---

### 4. Filter Products

**Endpoint:** `GET /api/products/filter`

**Description:** Advanced product filtering

**Authentication:** Not required

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `keyword` | string | Search term (optional) |
| `categoryId` | Long | Category filter (optional) |
| `minPrice` | Double | Minimum price (optional) |
| `maxPrice` | Double | Maximum price (optional) |
| `sort` | string | Sort order (optional) |

**cURL Example:**
```bash
curl "http://localhost:8080/api/products/filter?categoryId=1&minPrice=1000&maxPrice=50000&keyword=phone"
```

---

### 5. Create Product (ADMIN)

**Endpoint:** `POST /api/products`

**Description:** Create a new product

**Authentication:** Required (ADMIN role)

**Request Body:**
```json
{
  "productName": "MacBook Pro",
  "productDescription": "16-inch Apple laptop",
  "sku": "MBP16-512",
  "picture": "https://example.com/macbook.jpg",
  "basePrice": 199999.00,
  "stockQty": 20,
  "categoryId": 1
}
```

**Response:** `200 OK`
```json
{
  "productId": 5,
  "productName": "MacBook Pro",
  "basePrice": 199999.00,
  ...
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "productName": "MacBook Pro",
    "productDescription": "16-inch Apple laptop",
    "sku": "MBP16-512",
    "basePrice": 199999.00,
    "stockQty": 20,
    "categoryId": 1
  }'
```

---

## Categories API

### 1. List All Categories

**Endpoint:** `GET /api/categories`

**Description:** Get all product categories

**Authentication:** Not required

**Response:** `200 OK`
```json
[
  {
    "categoryId": 1,
    "name": "Electronics",
    "description": "Electronic items and gadgets",
    "picture": "https://example.com/electronics.jpg"
  }
]
```

**cURL Example:**
```bash
curl http://localhost:8080/api/categories
```

---

### 2. Create Category (ADMIN)

**Endpoint:** `POST /api/categories`

**Description:** Create a new product category

**Authentication:** Required (ADMIN role)

**Request Body:**
```json
{
  "name": "Books",
  "description": "Books and literature",
  "picture": "https://example.com/books.jpg"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "name": "Books",
    "description": "Books and literature"
  }'
```

---

## Cart API

### 1. Get Cart

**Endpoint:** `GET /api/cart`

**Description:** Get current user's shopping cart

**Authentication:** Required (USER/ADMIN)

**Response:** `200 OK`
```json
{
  "cartId": 1,
  "items": [
    {
      "productId": 1,
      "productName": "iPhone 15",
      "qty": 2,
      "priceAtAdd": 79999.00,
      "subtotal": 159998.00
    }
  ],
  "totalAmount": 159998.00
}
```

**cURL Example:**
```bash
curl http://localhost:8080/api/cart \
  -H "Authorization: Bearer USER_TOKEN"
```

---

### 2. Add to Cart

**Endpoint:** `POST /api/cart/add`

**Description:** Add product to cart

**Authentication:** Required (USER/ADMIN)

**Request Body:**
```json
{
  "productId": 1,
  "qty": 2
}
```

**Response:** `200 OK`
```json
{
  "cartId": 1,
  "items": [...],
  "totalAmount": 159998.00
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{
    "productId": 1,
    "qty": 2
  }'
```

---

### 3. Remove from Cart

**Endpoint:** `DELETE /api/cart/remove/{productId}`

**Description:** Remove product from cart

**Authentication:** Required (USER/ADMIN)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `productId` | Long | Product ID to remove |

**cURL Example:**
```bash
curl -X DELETE http://localhost:8080/api/cart/remove/1 \
  -H "Authorization: Bearer USER_TOKEN"
```

---

## Orders API

### 1. Checkout

**Endpoint:** `POST /api/orders/checkout`

**Description:** Place an order from cart items

**Authentication:** Required (USER/ADMIN)

**Response:** `200 OK`
```json
{
  "orderId": 1,
  "items": [
    {
      "productName": "iPhone 15",
      "qty": 2,
      "priceAtPurchase": 79999.00,
      "subtotal": 159998.00
    }
  ],
  "totalAmount": 159998.00,
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "orderDate": "2024-01-15T10:30:00",
  "shippingAddress": "123 Main Street"
}
```

**Field Descriptions:**
| Field | Description |
|-------|-------------|
| `status` | **Shipment status**: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED |
| `paymentStatus` | **Payment status**: PENDING, SUCCESS, FAILED |

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/orders/checkout \
  -H "Authorization: Bearer USER_TOKEN"
```

---

### 2. Get My Orders

**Endpoint:** `GET /api/orders/my`

**Description:** Get current user's order history

**Authentication:** Required (USER/ADMIN)

**Response:** `200 OK`
```json
[
  {
    "orderId": 1,
    "totalAmount": 159998.00,
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "orderDate": "2024-01-15T10:30:00",
    "items": [...]
  }
]
```

**Note:** `status` = shipment status, `paymentStatus` = payment status (separate fields)

**cURL Example:**
```bash
curl http://localhost:8080/api/orders/my \
  -H "Authorization: Bearer USER_TOKEN"
```

---

### 3. Get All Orders (ADMIN)

**Endpoint:** `GET /api/orders/all`

**Description:** Get all orders in the system

**Authentication:** Required (ADMIN role)

**cURL Example:**
```bash
curl http://localhost:8080/api/orders/all \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### 4. Update Order Status (ADMIN)

**Endpoint:** `PUT /api/orders/{orderId}/status`

**Description:** Update order status

**Authentication:** Required (ADMIN role)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `orderId` | Long | Order ID |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | New status: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED |

**cURL Example:**
```bash
curl -X PUT "http://localhost:8080/api/orders/1/status?status=SHIPPED" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Payments API

### 1. Pay for Order

**Endpoint:** `POST /api/payments`

**Description:** Process payment for an order (mock payment gateway)

**Authentication:** Required (USER/ADMIN)

**Request Body:**
```json
{
  "orderId": 1,
  "paymentMode": "CARD"
}
```

**Payment Modes:**
- `CARD` - Credit/Debit card
- `UPI` - UPI payment
- `COD` - Cash on Delivery

**Response:** `200 OK`
```json
{
  "transactionId": 1,
  "amount": 159998.00,
  "paymentMode": "CARD",
  "paymentStatus": "SUCCESS",
  "paymentGatewayRef": "TXN_1234567890",
  "transactionDate": "2024-01-15T10:35:00"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{
    "orderId": 1,
    "paymentMode": "CARD"
  }'
```

---

## Reviews API

### 1. Get Product Reviews

**Endpoint:** `GET /api/reviews/{productId}`

**Description:** Get all reviews for a product

**Authentication:** Not required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `productId` | Long | Product ID |

**Response:** `200 OK`
```json
[
  {
    "reviewId": 1,
    "rating": 5,
    "comment": "Excellent product!",
    "userEmail": "user@example.com",
    "createdAt": "2024-01-15T12:00:00"
  }
]
```

**cURL Example:**
```bash
curl http://localhost:8080/api/reviews/1
```

---

### 2. Add Review

**Endpoint:** `POST /api/reviews`

**Description:** Add a review for a product

**Authentication:** Required (USER/ADMIN)

**Request Body:**
```json
{
  "productId": 1,
  "rating": 5,
  "comment": "Great product, highly recommended!"
}
```

**Field Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `productId` | Long | Yes | Product to review |
| `rating` | int | Yes | Rating (1-5 stars) |
| `comment` | string | No | Review text |

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{
    "productId": 1,
    "rating": 5,
    "comment": "Amazing product!"
  }'
```

---

## Quick Reference

### Authentication Flow

```
1. Register:    POST /auth/register → "User registered successfully"
2. Login:       POST /auth/login    → JWT Token
3. Use Token:   Add header "Authorization: Bearer {token}" to all protected requests
```

### Endpoint Summary

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/auth/register` | POST | ❌ | - | Register user |
| `/auth/login` | POST | ❌ | - | Login & get token |
| `/api/products` | GET | ❌ | - | List products |
| `/api/products` | POST | ✅ | ADMIN | Create product |
| `/api/products/category/{id}` | GET | ❌ | - | Products by category |
| `/api/products/search` | GET | ❌ | - | Search products |
| `/api/products/filter` | GET | ❌ | - | Filter products |
| `/api/categories` | GET | ❌ | - | List categories |
| `/api/categories` | POST | ✅ | ADMIN | Create category |
| `/api/cart` | GET | ✅ | USER | Get cart |
| `/api/cart/add` | POST | ✅ | USER | Add to cart |
| `/api/cart/remove/{id}` | DELETE | ✅ | USER | Remove from cart |
| `/api/orders/checkout` | POST | ✅ | USER | Place order |
| `/api/orders/my` | GET | ✅ | USER | My orders |
| `/api/orders/all` | GET | ✅ | ADMIN | All orders |
| `/api/orders/{id}/status` | PUT | ✅ | ADMIN | Update order status |
| `/api/payments` | POST | ✅ | USER | Pay for order |
| `/api/reviews/{id}` | GET | ❌ | - | Get reviews |
| `/api/reviews` | POST | ✅ | USER | Add review |

### HTTP Status Codes

| Code | Meaning | When it occurs |
|------|---------|----------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation failed or invalid input |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions (e.g., USER trying ADMIN endpoint) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

---

## Testing with Streamlit

The project includes a Streamlit web interface for easy API testing:

```bash
# Navigate to frontend directory
cd frontend

# Run Streamlit app
streamlit run streamlit_app.py
```

Access at: `http://localhost:8501`

Features:
- User registration with role selection (CUSTOMER/ADMIN)
- Login and token management
- All API endpoints in organized tabs
- Automatic token injection
- Response visualization

---

## Postman Collection

### Import Steps:
1. Open Postman
2. Create new collection "Ecommerce API"
3. Add environment variables:
   - `baseUrl`: `http://localhost:8080`
   - `token`: (auto-set after login)

### Auto-save Token:
In Login request's "Tests" tab:
```javascript
pm.environment.set("token", pm.response.text());
```

### Authorization:
In collection settings:
- Type: Bearer Token
- Token: `{{token}}`

---

**Need Help?** Check the main [README.md](./README.md) for detailed explanations of concepts and architecture.
