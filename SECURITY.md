# Security Guidelines

## ⚠️ Important: Protecting Sensitive Configuration

This project uses sensitive credentials that should **NEVER** be committed to version control.

### Protected Files

The following files contain sensitive information and are already in `.gitignore`:

- `src/main/resources/application.properties` - Contains database credentials, JWT secrets, Razorpay keys
- `target/classes/application.properties` - Compiled properties

### Setup Instructions

1. **Copy the example file:**
   ```bash
   cp application.properties.example src/main/resources/application.properties
   ```

2. **Update with your actual values:**
   - Database credentials
   - JWT secret (generate using: `openssl rand -base64 64`)
   - Razorpay API keys from https://dashboard.razorpay.com/app/keys

3. **Never commit the real `application.properties` file**

### Razorpay Configuration

#### Getting Your Keys

1. Sign up at https://razorpay.com
2. Go to Dashboard → Settings → API Keys
3. Generate **Test Keys** for development (starts with `rzp_test_`)
4. Use **Live Keys** only for production (starts with `rzp_live_`)

#### Configuration Options

```properties
# Test Mode (Development)
razorpay.key.id=rzp_test_XXXXXXXXXXXXXXXX
razorpay.key.secret=YYYYYYYYYYYYYYYYYY
payment.demo.mode=false

# Demo Mode (No actual Razorpay calls)
payment.demo.mode=true
```

**Demo Mode:**
- `true` - Payments are simulated locally (no Razorpay API calls)
- `false` - Real Razorpay integration (requires valid API keys)

### How to Verify Payment Requests in Razorpay

When `payment.demo.mode=false`:

1. **Initiate Payment:** Use the `/api/payments` endpoint
2. **Check Razorpay Dashboard:** 
   - Go to https://dashboard.razorpay.com/app/orders
   - You'll see the created order with status "Created"
3. **Complete Payment:** Use Razorpay Checkout on frontend or test cards
4. **Verify Payment:** Call `/api/payments/verify` endpoint
5. **Check Status:** View in Dashboard → Payments section

### Test Cards (Razorpay Test Mode)

```
Successful Payment:
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date

Failed Payment:
Card Number: 4000 0000 0000 0002
```

### Admin User Credentials

Default admin user for testing:
```
Email: daanish@example.com
Password: password123
```

**⚠️ Change these credentials in production!**

### Best Practices

1. ✅ Use environment variables for production
2. ✅ Rotate API keys regularly
3. ✅ Use separate keys for test/production
4. ✅ Enable webhook signatures for payment verification
5. ✅ Never log sensitive data (keys, secrets, tokens)
6. ❌ Never commit `application.properties` with real credentials
7. ❌ Never share API keys in public channels

### If Keys Are Accidentally Committed

1. **Immediately revoke** the exposed keys in Razorpay Dashboard
2. Generate new API keys
3. Update your `application.properties`
4. Remove the keys from git history using `git filter-branch` or BFG Repo-Cleaner

## Questions?

For Razorpay support: https://razorpay.com/docs/

