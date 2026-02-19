# 👤 Frontend Developer Agent - Implementation Task Prompt

## 🎯 Mission Brief

You are tasked with building the React/Next.js frontend for a fully-functional ecommerce platform. The backend is **COMPLETE** and production-ready. Your job is to create an amazing user-facing application that integrates with the backend APIs.

---

## 📦 Project Context

**Backend Status:** ✅ Complete  
**Payment System:** ✅ Complete with Razorpay integration  
**Transaction Tracking:** ✅ Complete with timestamps  
**API Base URL:** `http://localhost:8080`  
**Documentation:** Available in project root  

---

## 🎯 Core User Features to Implement

### 1. Authentication System (Critical)
- [ ] Login page with email/password form
- [ ] Registration page with address input
- [ ] JWT token storage (localStorage/cookies)
- [ ] Protected routes (redirect unauthenticated users to login)
- [ ] Logout functionality with token cleanup
- [ ] Remember me / persistent login
- [ ] Password validation (min 6 characters)
- [ ] Email validation

**API Endpoints:**
```
POST /auth/register
POST /auth/login
```

---

### 2. Product Browsing & Discovery (High Priority)
- [ ] Homepage with featured products
- [ ] Product listing page with pagination
- [ ] Product filtering by category
- [ ] Product search functionality
- [ ] Product detail page with:
  - [ ] Images gallery
  - [ ] Price display
  - [ ] Description
  - [ ] Ratings & reviews
  - [ ] Stock availability
- [ ] Category menu/sidebar navigation
- [ ] Sort products (price, rating, newest)

**API Endpoints:**
```
GET /products
GET /products/{id}
GET /categories
GET /reviews/product/{id}
```

---

### 3. Shopping Cart System (High Priority)
- [ ] Add to cart button on product pages
- [ ] View cart page showing:
  - [ ] Product list
  - [ ] Quantity selectors
  - [ ] Remove item buttons
  - [ ] Cart total calculation
  - [ ] Proceed to checkout button
- [ ] Cart persistence (localStorage)
- [ ] Cart item count in header
- [ ] Update quantity in cart
- [ ] Empty cart state

**API Endpoints:**
```
GET /cart
POST /cart/items
PUT /cart/items/{id}
DELETE /cart/items/{id}
```

---

### 4. Checkout Process (High Priority)
- [ ] Shipping address form with validation
- [ ] Order review page showing:
  - [ ] Order items list
  - [ ] Shipping address
  - [ ] Total amount
  - [ ] Payment method selection
- [ ] Order creation
- [ ] Loading states during checkout

**API Endpoints:**
```
POST /orders
GET /orders/{id}
```

---

### 5. Payment Integration - Razorpay (CRITICAL)
This is the main task! Full payment system ready on backend.

**Features to implement:**
- [ ] Load Razorpay checkout script
- [ ] Handle payment initiation
  - [ ] Show loading during payment processing
  - [ ] Call backend `/payments` endpoint
  - [ ] Get Razorpay order ID
- [ ] Display Razorpay modal
- [ ] Handle payment success callback
- [ ] Verify payment with backend
  - [ ] Call `/payments/verify` endpoint
  - [ ] Send razorpay signatures
  - [ ] Handle verification response
- [ ] Display payment confirmation with:
  - [ ] ✅ **Transaction ID** (NEW)
  - [ ] ✅ **Transaction Date & Time** (NEW)
  - [ ] Amount paid
  - [ ] Payment status
  - [ ] Order number
- [ ] Show receipt/download invoice
- [ ] Handle payment failures gracefully
- [ ] Support demo mode for testing

**Key Response Fields:**
```json
{
  "transactionDate": "2026-02-13T14:35:22.123456",  // ✅ NEW - show this!
  "transactionId": "5",                            // ✅ NEW - show this!
  "amount": 199.98,
  "paymentId": "pay_xyz123"
}
```

**API Endpoints:**
```
POST /payments (initiate)
POST /payments/verify (confirm)
GET /payments/status/{orderId}
GET /payments/config
```

---

### 6. Order Management (Medium Priority)
- [ ] View order history page
- [ ] Order detail page showing:
  - [ ] Order items
  - [ ] Order status
  - [ ] Payment status
  - [ ] Shipping address
  - [ ] Order date
- [ ] Order tracking (status updates)
- [ ] Cancel order (if permitted)
- [ ] Download invoice
- [ ] Reorder functionality

**API Endpoints:**
```
GET /orders
GET /orders/{id}
GET /orders/{id}/status
```

---

### 7. User Profile (Medium Priority)
- [ ] View profile information
- [ ] Edit profile (email, phone, address)
- [ ] Change password
- [ ] View order history (link from orders page)
- [ ] Account settings

**API Endpoints:**
```
GET /user/profile
PUT /user/profile
```

---

### 8. Reviews & Ratings (Low Priority)
- [ ] View product reviews on product detail
- [ ] Display star ratings
- [ ] Add review form (for purchased items)
- [ ] Filter reviews by rating

**API Endpoints:**
```
GET /reviews/product/{id}
POST /reviews
```

---

## 🎨 UI/UX Requirements

### Design System
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Consistent color scheme
- [ ] Professional typography
- [ ] Intuitive navigation

### Components to Create
- [ ] Header/Navigation bar
- [ ] Footer
- [ ] Product card
- [ ] Shopping cart sidebar/modal
- [ ] Payment modal
- [ ] Loading spinner
- [ ] Error messages
- [ ] Success toast notifications
- [ ] Order status badge
- [ ] Price formatter
- [ ] Date formatter

### Pages to Build
- [ ] Home page
- [ ] Login page
- [ ] Register page
- [ ] Product listing page
- [ ] Product detail page
- [ ] Shopping cart page
- [ ] Checkout page
- [ ] Payment page
- [ ] Order confirmation page
- [ ] Order history page
- [ ] User profile page
- [ ] 404 page

---

## 🔐 Authentication & Security

- [ ] Store JWT token securely
- [ ] Add token to all authenticated requests
- [ ] Handle token expiration
- [ ] Redirect to login on 401 response
- [ ] Clear token on logout
- [ ] HTTPS ready (for production)
- [ ] Input validation before API calls
- [ ] XSS protection
- [ ] CSRF protection (if applicable)

**Header format:**
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 🧪 Testing & Quality

- [ ] Test all authentication flows
- [ ] Test product browsing (pagination, filtering)
- [ ] Test cart operations (add, remove, update)
- [ ] **Test payment flow end-to-end** ⭐
  - [ ] Test payment initiation
  - [ ] Test Razorpay modal display
  - [ ] Test payment verification
  - [ ] Test confirmation display with timestamp
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test responsive design on mobile
- [ ] Test form validation
- [ ] Test edge cases (empty cart, out of stock, etc.)

---

## 📱 Technical Stack Recommended

```json
{
  "framework": "React 18+ or Next.js 14+",
  "stateManagement": "Context API / Redux / Zustand",
  "httpClient": "Axios or TanStack Query (React Query)",
  "styling": "Tailwind CSS or Material-UI",
  "forms": "React Hook Form",
  "validation": "Zod or Yup",
  "payment": "Razorpay JS SDK",
  "testing": "Jest + React Testing Library",
  "deployment": "Vercel or Netlify"
}
```

---

## 🔌 API Integration Points

### Authentication Flow
```
Register/Login → Store JWT → Use in Headers → Protected Routes
```

### Shopping Flow
```
Browse Products → Add to Cart → View Cart → Checkout → Payment → Confirmation
```

### Payment Flow (Important!)
```
Checkout → Create Order → Initiate Payment (POST /payments)
  → Show Razorpay Modal → User Completes Payment
  → Verify Payment (POST /payments/verify)
  → Display Confirmation with Transaction Details ✅
  → Redirect to Order Confirmation
```

---

## 📊 Performance Targets

- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] Smooth animations (60fps)
- [ ] Lazy loading for product images
- [ ] Code splitting for routes
- [ ] Optimized bundle size

---

## 🚀 Deployment

### Development
- Local backend: `http://localhost:8080`
- Dev server: `npm start`

### Staging/Production
- Update API_BASE_URL in config
- Set JWT secret if needed
- Enable HTTPS
- Configure Razorpay keys
- Test payment flow with real test keys

---

## 📚 Documentation & Resources

**Available in project root:**
1. `FRONTEND_DEVELOPMENT_PROMPT.md` - Complete API reference
2. `PAYMENT_QUICK_START.md` - Payment integration guide
3. `PAYMENT_INTEGRATION_FIX.md` - Technical details
4. `API_REFERENCE.md` - Full API documentation
5. `IMPLEMENTATION_COMPLETE.md` - Project status

**External Resources:**
- Razorpay Docs: https://razorpay.com/docs/
- React Docs: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/

---

## 🎓 Key Points for Frontend Dev

1. **JWT Token Management:** Essential for all API calls
2. **Error Handling:** Show user-friendly messages for all errors
3. **Loading States:** Always show loading during API calls
4. **Response Handling:** Always check response.status and handle both success/error
5. **Transaction Details:** Display transactionDate and transactionId from payment response
6. **Responsive Design:** Mobile first approach
7. **Form Validation:** Validate before sending to backend
8. **Token Expiration:** Handle 401 responses gracefully
9. **Cart Persistence:** Keep cart in localStorage
10. **Payment Testing:** Test with demo mode first, then real Razorpay

---

## ✅ Success Criteria

- [ ] All authentication flows working
- [ ] Product browsing fully functional
- [ ] Shopping cart working correctly
- [ ] Checkout process complete
- **[ ] Payment integration fully working with Razorpay** ⭐
- **[ ] Payment confirmation showing transaction ID and date/time** ⭐
- [ ] Order confirmation page displays all details
- [ ] User can view order history
- [ ] All pages responsive on mobile
- [ ] Error handling comprehensive
- [ ] No console errors
- [ ] Performance meets targets
- [ ] Testing complete

---

## 📋 Development Checklist

### Phase 1: Setup & Auth (Week 1)
- [ ] Project setup (Create React App / Next.js)
- [ ] Development environment ready
- [ ] API base URL configured
- [ ] Login page implementation
- [ ] Registration page implementation
- [ ] JWT token management
- [ ] Protected routes implementation

### Phase 2: Product & Cart (Week 2)
- [ ] Product listing page
- [ ] Product detail page
- [ ] Shopping cart implementation
- [ ] Category filtering
- [ ] Product search
- [ ] Cart persistence

### Phase 3: Checkout & Payment (Week 3) ⭐
- [ ] Checkout page
- [ ] Razorpay integration
- [ ] Payment initiation
- [ ] Payment verification
- [ ] **Confirmation page with transaction details**
- [ ] Error handling for payments

### Phase 4: Orders & Polish (Week 4)
- [ ] Order history page
- [ ] User profile page
- [ ] Reviews system
- [ ] Responsive design optimization
- [ ] Testing & bug fixes
- [ ] Performance optimization

---

## 🆘 Support & Communication

**Questions about API?**
- Check `FRONTEND_DEVELOPMENT_PROMPT.md` first
- Check `API_REFERENCE.md` for endpoint details
- Backend team can provide additional context

**Payment Integration Help?**
- Reference `PAYMENT_QUICK_START.md`
- Check Razorpay documentation
- Test with demo mode first

**Issues or Blockers?**
- Document the issue clearly
- Provide error messages and stack traces
- Note which API endpoint is causing issues

---

## 🎯 Final Notes

1. **Backend is ready** - Focus on frontend implementation
2. **Payment system complete** - Just integrate Razorpay on frontend
3. **Transaction tracking active** - Show transaction ID and date to users
4. **Demo mode available** - Test payment without real Razorpay
5. **Documentation thorough** - Everything you need is documented

---

**Start with authentication, then product browsing, then payment integration.**

**Good luck! 🚀**

---

**Created:** February 13, 2026  
**Backend Status:** ✅ Production Ready  
**Estimated Timeline:** 4 weeks  
**Team Size:** 1-2 frontend developers

