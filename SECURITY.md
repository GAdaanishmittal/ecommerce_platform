# Security Guidelines

## ⚠️ IMPORTANT: Before Committing to GitHub

This document outlines security best practices for this project.

## 🔐 Credentials and Secrets

### DO NOT Commit:

1. **Database Passwords** - Never commit real database credentials
2. **JWT Secret Keys** - Use strong, randomly generated keys
3. **API Keys** - Any third-party API keys should be in environment variables
4. **Personal Information** - Email addresses, phone numbers, etc.

### Current Security Status

✅ **Protected Files:**
- `application.properties` - Contains database credentials and JWT secret
- `.env` files - Environment-specific configurations
- `application-local.properties`, `application-dev.properties`, `application-prod.properties`

These files are already in `.gitignore` (except the main application.properties which you should be careful with).

### What You Should Do:

1. **Before First Commit:**
   - Review `src/main/resources/application.properties`
   - Replace real credentials with placeholder values OR use environment variables
   - Ensure JWT secret is a strong, randomly generated value (not committed)

2. **Use Environment Variables (Recommended):**

   Instead of hardcoding values, use environment variables:

   ```properties
   spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/ecommerce_db}
   spring.datasource.username=${DB_USERNAME:postgres}
   spring.datasource.password=${DB_PASSWORD}
   jwt.secret=${JWT_SECRET}
   jwt.expiration=${JWT_EXPIRATION:3600000}
   ```

3. **For Local Development:**
   - Copy `application.properties.example` to `application.properties`
   - Add your local credentials
   - Never commit the actual `application.properties`

4. **For Production:**
   - Use environment variables or a secrets manager (AWS Secrets Manager, Azure Key Vault, etc.)
   - Never store secrets in version control

## 🔑 JWT Secret Key Generation

Generate a secure JWT secret key:

### Using OpenSSL:
```bash
openssl rand -base64 64
```

### Using Online Tools:
- Use a secure random string generator
- Minimum 256 bits (32 characters)

## 🛡️ Additional Security Recommendations

### 1. Database Security
- Use strong passwords
- Restrict database access to specific IPs
- Use SSL/TLS for database connections in production

### 2. HTTPS
- Always use HTTPS in production
- Never send JWT tokens over HTTP

### 3. Password Security
- Passwords are encrypted using BCrypt (implemented in AuthService)
- Never log or display passwords

### 4. API Security
- JWT tokens expire after 1 hour (configurable)
- Role-based access control (CUSTOMER vs ADMIN)
- Protected endpoints require authentication

### 5. Input Validation
- All user inputs are validated using @Valid annotations
- Custom validation for business rules

## 📋 Pre-Commit Checklist

Before committing to GitHub:

- [ ] Review all changed files
- [ ] Ensure no passwords or secrets are in code
- [ ] Check application.properties for sensitive data
- [ ] Verify .gitignore includes all necessary exclusions
- [ ] Test that the application runs with example configuration
- [ ] Update documentation if needed

## 🚨 If You Accidentally Commit Secrets

If you accidentally commit sensitive information:

1. **DO NOT** just delete it in a new commit (it's still in history)
2. **Immediately rotate** the exposed credentials
3. Use `git filter-branch` or BFG Repo-Cleaner to remove from history
4. Force push the cleaned history (if repository is not shared yet)
5. Inform your team if the repository was already shared

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 🔍 Security Audit

Run these checks regularly:

```bash
# Check for hardcoded secrets (example patterns)
git grep -i "password\s*="
git grep -i "secret\s*="
git grep -i "api_key"

# Maven dependency check for vulnerabilities
mvn org.owasp:dependency-check-maven:check
```

## 📞 Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email the maintainers directly
3. Provide detailed information about the vulnerability
4. Allow reasonable time for a fix before public disclosure

---

**Remember:** Security is everyone's responsibility. When in doubt, ask!
