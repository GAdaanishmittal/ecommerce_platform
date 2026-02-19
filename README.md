# 🛒 Ecommerce Project - Complete Spring Boot Learning Guide

> **A comprehensive, production-ready e-commerce platform built with Spring Boot 4.x and Java 21**

This documentation has every concept, annotation, and design decision is explained in detail according to the design provided.

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack Explained](#2-technology-stack-explained)
3. [Project Structure & Architecture](#3-project-structure--architecture)
4. [Maven Dependencies Deep Dive](#4-maven-dependencies-deep-dive)
5. [Configuration Files](#5-configuration-files)
6. [Entity Layer - Database Models](#6-entity-layer---database-models)
7. [Repository Layer - Data Access](#7-repository-layer---data-access)
8. [DTO Layer - Data Transfer Objects](#8-dto-layer---data-transfer-objects)
9. [Service Layer - Business Logic](#9-service-layer---business-logic)
10. [Controller Layer - REST API Endpoints](#10-controller-layer---rest-api-endpoints)
11. [Security Implementation](#11-security-implementation)
12. [Exception Handling](#12-exception-handling)
13. [Data Seeder](#13-data-seeder)
14. [Key Workflows Explained](#14-key-workflows-explained)
15. [API Reference](#15-api-reference)
16. [How to Run](#16-how-to-run)
17. [Testing the API](#17-testing-the-api)

---

## 1. Project Overview

### 1.1 What This Project Does

This is a **full-featured e-commerce REST API** that provides:

| Feature | Description |
|---------|-------------|
| **User Authentication** | Register and login with JWT tokens |
| **Role-Based Access** | Customers vs Admins with different permissions |
| **Product Catalog** | Browse, search, and filter products |
| **Category Management** | Organize products into categories |
| **Shopping Cart** | Add, view, and remove items |
| **Order Processing** | Checkout with stock validation |
| **Payment & Transactions** | Mock Stripe-style payment, transaction records |
| **Reviews** | Rate and comment on products |
| **Monitoring** | Actuator health/info/metrics (admin-only) |
| **Caching** | Product list cached for faster reads |

### 1.2 Key Learning Concepts

By studying this project, you will learn:

- ✅ **Spring Boot Basics** - Application setup, auto-configuration
- ✅ **REST API Design** - Controllers, request/response handling
- ✅ **Spring Data JPA** - Entity mapping, repositories, custom queries
- ✅ **Spring Security** - Authentication, authorization, JWT
- ✅ **Layered Architecture** - Controller → Service → Repository pattern
- ✅ **DTO Pattern** - Separating API contracts from internal models
- ✅ **Validation** - Input validation with annotations
- ✅ **Exception Handling** - Global error handling

### 1.3 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Postman/Frontend)                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SECURITY LAYER (JWT Filter)                          │
│         Intercepts requests, validates JWT tokens, sets user context         │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CONTROLLER LAYER                                  │
│    @RestController classes that handle HTTP requests and return responses    │
│    AuthController, ProductController, CartController, OrderController, etc.  │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             SERVICE LAYER                                    │
│   @Service classes containing business logic, validation, data transformation │
│     AuthService, ProductService, CartService, OrderService, etc.             │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            REPOSITORY LAYER                                  │
│  Interfaces extending JpaRepository - Spring generates implementations       │
│    UserRepository, ProductRepository, CartRepository, OrderRepository, etc.  │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               DATABASE                                       │
│                         PostgreSQL / H2 (Development)                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack Explained

### 2.1 Core Technologies

| Technology | Version | What It Is | Why We Use It |
|------------|---------|------------|---------------|
| **Java** | 21 (LTS) | Programming language | Modern features, long-term support |
| **Spring Boot** | 4.0.2 | Application framework | Rapid development, auto-configuration |
| **Maven** | 3.9+ | Build tool | Dependency management, build automation |

### 2.2 Spring Boot Modules

| Module | What It Provides | Key Features |
|--------|------------------|--------------|
| **spring-boot-starter-web** | REST API support | `@RestController`, `@GetMapping`, embedded Tomcat |
| **spring-boot-starter-data-jpa** | Database operations | `@Entity`, `JpaRepository`, Hibernate ORM |
| **spring-boot-starter-security** | Authentication/Authorization | Security filters, password encoding |
| **spring-boot-starter-validation** | Input validation | `@Valid`, `@NotBlank`, `@Min`, `@Max` |

### 2.3 Database

| Database | When Used | Characteristics |
|----------|-----------|-----------------|
| **PostgreSQL** | Production | Persistent, external database server |
| **H2** | Development/Testing | In-memory, auto-created, no setup needed |

### 2.4 Security Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **jjwt-api** | 0.11.5 | JWT token creation/parsing API |
| **jjwt-impl** | 0.11.5 | JWT implementation |
| **jjwt-jackson** | 0.11.5 | JSON serialization for JWT |
| **BCrypt** | Built-in | Password hashing (via Spring Security) |

---

## 3. Project Structure & Architecture

### 3.1 Directory Structure

```
src/main/java/com/ecommerce/
│
├── EcommerceApplication.java          # 🚀 Application entry point
├── DataSeeder.java                    # 🌱 Initial data loader
│
├── controller/                        # 🎮 REST API endpoints
│   ├── AuthController.java            #    Login/Register endpoints
│   ├── ProductController.java         #    Product CRUD endpoints
│   ├── CategoryController.java        #    Category endpoints
│   ├── CartController.java            #    Shopping cart endpoints
│   ├── OrderController.java           #    Order processing endpoints
│   └── ReviewController.java          #    Product review endpoints
│
├── service/                           # 💼 Business logic
│   ├── AuthService.java               #    Authentication logic
│   ├── UserService.java               #    User operations
│   ├── ProductService.java            #    Product operations
│   ├── CategoryService.java           #    Category operations
│   ├── CartService.java               #    Cart operations
│   ├── OrderService.java              #    Order processing
│   └── ReviewService.java             #    Review operations
│
├── repository/                        # 🗄️ Database access interfaces
│   ├── UserRepository.java
│   ├── RoleRepository.java
│   ├── ProductRepository.java
│   ├── ProductCategoryRepository.java
│   ├── CartRepository.java
│   ├── CartItemRepository.java
│   ├── OrderRepository.java
│   ├── OrderItemRepository.java
│   ├── TransactionRepository.java
│   └── ReviewRepository.java
│
├── model/                             # 📦 Database entities
│   ├── User.java
│   ├── Role.java
│   ├── Product.java
│   ├── ProductCategory.java
│   ├── Cart.java
│   ├── CartItem.java
│   ├── Order.java
│   ├── OrderItem.java
│   ├── OrderStatus.java               #    Enum for order states
│   ├── Transaction.java
│   └── Review.java
│
├── dto/                               # 📋 Data Transfer Objects
│   ├── LoginRequest.java              #    Login input
│   ├── RegisterRequest.java           #    Registration input
│   ├── ProductRequest.java            #    Product creation input
│   ├── ProductResponse.java           #    Product output
│   ├── CategoryRequest.java           #    Category creation input
│   ├── CategoryResponse.java          #    Category output
│   ├── CartItemRequest.java          #    Cart item input
│   ├── CartResponse.java              #    Cart output
│   ├── CartItemResponse.java          #    Cart item output
│   ├── OrderResponse.java             #    Order output
│   ├── ReviewRequest.java             #    Review input
│   └── ReviewResponse.java            #    Review output
│
├── security/                          # 🔐 Security configuration
│   ├── SecurityConfig.java            #    Main security configuration
│   ├── JwtService.java                #    JWT token operations
│   ├── JwtAuthenticationFilter.java   #    Request filter for JWT
│   └── CustomUserDetailsService.java  #    Loads user from database
│
└── exception/                         # ⚠️ Error handling
    └── GlobalExceptionHandler.java    #    Catches all exceptions
```

### 3.2 Why This Structure?

| Layer | Responsibility | Benefits |
|-------|---------------|----------|
| **Controller** | HTTP handling only | Thin, testable, follows single responsibility |
| **Service** | Business logic | Reusable, transaction management |
| **Repository** | Data access | Abstraction over database |
| **DTO** | API contract | Decouples internal model from external API |
| **Model** | Database mapping | JPA entities map to tables |
| **Security** | Auth/authz | Centralized security logic |
| **Exception** | Error handling | Consistent error responses |

---

## 4. Maven Dependencies Deep Dive

### 4.1 pom.xml Explained

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <!-- ===== PARENT POM ===== -->
    <!-- Inherits default configurations from Spring Boot -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>4.0.2</version>
        <relativePath/>
    </parent>
    
    <!-- ===== PROJECT COORDINATES ===== -->
    <groupId>com.example</groupId>
    <artifactId>Ecommerce</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>Ecommerce</name>
    
    <properties>
        <java.version>21</java.version>
    </properties>
    
    <dependencies>
        <!-- ========================================== -->
        <!-- WEB & REST API                             -->
        <!-- ========================================== -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--
        WHAT IT PROVIDES:
        - @RestController annotation
        - @RequestMapping, @GetMapping, @PostMapping, etc.
        - @RequestBody, @ResponseBody for JSON handling
        - @PathVariable, @RequestParam for URL parameters
        - Embedded Tomcat server
        - Jackson library for JSON serialization
        -->
        
        <!-- ========================================== -->
        <!-- DATABASE ACCESS (JPA/Hibernate)            -->
        <!-- ========================================== -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <!--
        WHAT IT PROVIDES:
        - @Entity, @Table, @Column annotations
        - @Id, @GeneratedValue for primary keys
        - @OneToMany, @ManyToOne, @ManyToMany relationships
        - JpaRepository interface with CRUD operations
        - Query methods (findByEmail, findByProductNameContaining)
        - @Query for custom JPQL/SQL queries
        - @Transactional for transaction management
        -->
        
        <!-- ========================================== -->
        <!-- DATABASE DRIVERS                           -->
        <!-- ========================================== -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!--
        PostgreSQL JDBC driver for production database.
        scope=runtime means it's only needed at runtime, not compile time.
        -->
        
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!--
        H2 in-memory database for development/testing.
        Data is lost when application stops.
        -->
        
        <!-- ========================================== -->
        <!-- SECURITY                                   -->
        <!-- ========================================== -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <!--
        WHAT IT PROVIDES:
        - SecurityFilterChain for configuring access rules
        - PasswordEncoder (BCrypt) for password hashing
        - AuthenticationManager for login verification
        - @PreAuthorize for method-level security
        - UserDetailsService interface
        -->
        
        <!-- ========================================== -->
        <!-- JWT (JSON Web Tokens)                      -->
        <!-- ========================================== -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <!--
        WHAT IT PROVIDES:
        - Jwts.builder() for creating tokens
        - Jwts.parserBuilder() for validating tokens
        - SignatureAlgorithm for signing (HS256)
        - Claims extraction (subject, expiration, etc.)
        -->
        
        <!-- ========================================== -->
        <!-- VALIDATION                                 -->
        <!-- ========================================== -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <!--
        WHAT IT PROVIDES:
        - @Valid to trigger validation
        - @NotNull, @NotBlank, @NotEmpty
        - @Size, @Min, @Max
        - @Email, @Pattern
        - @Positive, @Negative
        -->
        
        <!-- ========================================== -->
        <!-- DEVELOPER TOOLS                            -->
        <!-- ========================================== -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!--
        WHAT IT PROVIDES:
        - @Getter, @Setter - generates getters/setters
        - @NoArgsConstructor, @AllArgsConstructor
        - @Builder - builder pattern
        - @Data - combines Getter, Setter, ToString, EqualsAndHashCode
        - @RequiredArgsConstructor - constructor for final fields
        NOTE: This project doesn't use Lombok extensively
        -->
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <!--
        WHAT IT PROVIDES:
        - Automatic restart when code changes
        - LiveReload support
        - Disabled in production automatically
        -->
    </dependencies>
</project>
```

---

## 5. Configuration Files

### 5.1 application.properties Explained

```properties
# ===============================
# SERVER CONFIGURATION
# ===============================
server.port=8080
# The port your application listens on
# Access API at http://localhost:8080

# ===============================
# DATABASE CONFIGURATION
# ===============================
spring.datasource.url=jdbc:postgresql://localhost:5432/ecommerce_db
# JDBC connection string format:
# jdbc:postgresql://[host]:[port]/[database_name]

spring.datasource.username=postgres
# Database username

spring.datasource.password=00000000
# Database password (use environment variables in production!)

# ===============================
# JPA/HIBERNATE SETTINGS
# ===============================
spring.jpa.hibernate.ddl-auto=update
# Options:
# - none: No schema changes
# - validate: Validate schema matches entities (error if mismatch)
# - update: CREATE tables if missing, ADD columns if missing (safe for dev)
# - create: DROP and CREATE tables every time
# - create-drop: DROP when app stops (for testing)

spring.jpa.show-sql=true
# Prints SQL statements to console (useful for debugging)

spring.jpa.properties.hibernate.format_sql=true
# Formats SQL for readability:
# Instead of: select user0_.id, user0_.email from users user0_
# Shows formatted multi-line SQL

spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
# Tells Hibernate which SQL dialect to use
# PostgreSQL has different syntax than MySQL, etc.

# ===============================
# JWT CONFIGURATION
# ===============================
jwt.secret=MyJwtSecretKeyMyJwtSecretKeyMyJwtSecretKey
# Secret key for signing JWT tokens
# IMPORTANT: In production, use environment variable!
# Must be at least 256 bits (32 characters) for HS256

jwt.expiration=3600000
# Token validity in milliseconds
# 3600000 = 1 hour
# 86400000 = 24 hours

# ===============================
# SPRING ACTUATOR (Optional)
# ===============================
management.endpoints.web.exposure.include=health,info
# Exposes health check endpoint at /actuator/health
```

### 5.2 EcommerceApplication.java - Main Class

```java
package com.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@EnableMethodSecurity  // 🔐 Enables @PreAuthorize annotations in controllers
@SpringBootApplication // 🚀 Main Spring Boot annotation
public class EcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcommerceApplication.class, args);
    }
}
```

#### What @SpringBootApplication Does

`@SpringBootApplication` is a convenience annotation that combines three annotations:

```java
@SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan
```

| Annotation | What It Does |
|------------|--------------|
| `@Configuration` | Marks class as a source of bean definitions |
| `@EnableAutoConfiguration` | Auto-configures Spring beans based on classpath |
| `@ComponentScan` | Scans for @Component, @Service, @Repository, @Controller |

---

## 6. Entity Layer - Database Models

Entities are Java classes that map to database tables. JPA (Java Persistence API) handles the translation.

### 6.1 User Entity

**File: `model/User.java`**

```java
package com.ecommerce.model;

import jakarta.persistence.*;    // JPA annotations
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;  // Jackson annotation

@Entity                          // Marks this class as a JPA entity (database table)
@Table(name = "users")           // Table name (using "users" because "user" is reserved in some DBs)
public class User {

    @Id                          // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment
    private Long userId;
    // Database column: user_id BIGINT PRIMARY KEY AUTO_INCREMENT

    @Column(unique = true, nullable = false)  // Constraints
    private String email;
    // Database column: email VARCHAR(255) UNIQUE NOT NULL

    @Column(nullable = false)
    private String password;
    // IMPORTANT: Always store hashed password, never plain text!
    // BCrypt hash looks like: $2a$10$N9qo8uLOickgx2ZMRZoMy...

    private String phone;        // Optional field
    private String address;

    private LocalDateTime createdAt;  // Timestamp for auditing

    // ========== RELATIONSHIPS ==========

    @OneToMany(mappedBy = "user")  // One user has many carts
    @JsonIgnore                    // Prevents infinite recursion in JSON serialization
    private List<Cart> carts;
    // "mappedBy" means Cart entity owns the relationship (has the foreign key)

    @OneToMany(mappedBy = "user")  // One user has many orders
    @JsonIgnore
    private List<Order> orders;

    @ManyToMany(fetch = FetchType.EAGER)  // Many users can have many roles
    @JoinTable(
        name = "user_roles",              // Junction table name
        joinColumns = @JoinColumn(name = "user_id"),         // FK to users table
        inverseJoinColumns = @JoinColumn(name = "role_id")   // FK to roles table
    )
    private List<Role> roles;
    // FetchType.EAGER: Load roles immediately when loading user
    // FetchType.LAZY: Load roles only when accessed (default for collections)

    // ========== GETTERS & SETTERS ==========
    public Long getUserId() { return userId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<Role> getRoles() { return roles; }
    public void setRoles(List<Role> roles) { this.roles = roles; }
}
```

#### Database Tables Created

```sql
-- users table
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    address VARCHAR(255),
    created_at TIMESTAMP
);

-- Junction table for many-to-many
CREATE TABLE user_roles (
    user_id BIGINT REFERENCES users(user_id),
    role_id BIGINT REFERENCES roles(role_id),
    PRIMARY KEY (user_id, role_id)
);
```

### 6.2 Role Entity

**File: `model/Role.java`**

```java
package com.ecommerce.model;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;  // e.g., "ADMIN", "CUSTOMER"
    
    // ========== CONSTRUCTORS ==========
    public Role() {}                      // Required by JPA
    
    public Role(String name) {            // Convenience constructor
        this.name = name;
    }

    // ========== GETTERS & SETTERS ==========
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
```

### 6.3 ProductCategory Entity

**File: `model/ProductCategory.java`**

```java
package com.ecommerce.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "product_category")
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    private String name;          // "Electronics", "Fashion", etc.
    private String description;
    private String picture;       // URL to category image

    @OneToMany(mappedBy = "category")  // One category has many products
    private List<Product> products;

    // Getters & Setters...
}
```

### 6.4 Product Entity

**File: `model/Product.java`**

```java
package com.ecommerce.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String productName;
    private String productDescription;
    private String sku;           // Stock Keeping Unit - unique product identifier
    private String picture;       // URL to product image
    private double basePrice;     // Note: In production, use BigDecimal for money!
    private int stockQty;         // Available quantity

    @ManyToOne                    // Many products belong to one category
    @JoinColumn(name = "category_id")  // Foreign key column
    @JsonIgnore                   // Prevents infinite loop: Product -> Category -> Products -> ...
    private ProductCategory category;

    // Getters & Setters...
}
```

#### Why @JsonIgnore?

Without `@JsonIgnore`, you'd get infinite recursion:

```
Product → Category → List<Product> → Category → List<Product> → ...
```

This causes `StackOverflowError` when serializing to JSON.

### 6.5 Cart Entity

**File: `model/Cart.java`**

```java
package com.ecommerce.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;  // Track when cart was last modified

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;                // Cart belongs to a user

    @OneToMany(mappedBy = "cart")
    @JsonIgnore
    private List<CartItem> items;     // Cart contains many items

    // Getters & Setters...
}
```

### 6.6 CartItem Entity

**File: `model/CartItem.java`**

```java
package com.ecommerce.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "cart_item")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartItemId;

    private int qty;              // Quantity of this product in cart
    private double priceAtAdd;    // 💡 IMPORTANT: Captures price when item was added
                                  // This way, price changes don't affect items already in cart

    @ManyToOne
    @JoinColumn(name = "cart_id")
    @JsonIgnore
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // Getters & Setters...
}
```

### 6.7 Order Entity

**File: `model/Order.java`**

```java
package com.ecommerce.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "orders")  // Using "orders" because "order" is SQL reserved word
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    private double totalAmount;
    
    @Enumerated(EnumType.STRING)  // Store enum as string, not number
    private OrderStatus status;
    // Database stores: "PENDING", "CONFIRMED", "SHIPPED", etc.
    // NOT: 0, 1, 2, etc. (which would break if enum order changes)

    private LocalDateTime orderDate;
    private String shippingAddress;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "order")
    @JsonIgnore
    private List<OrderItem> items;

    @OneToOne
    @JoinColumn(name = "transaction_id")
    @JsonIgnore
    private Transaction transaction;

    // Getters & Setters...
}
```

### 6.8 OrderStatus Enum

**File: `model/OrderStatus.java`**

```java
package com.ecommerce.model;

public enum OrderStatus {
    PENDING,      // Order placed, awaiting processing
    CONFIRMED,    // Order confirmed by system/admin
    SHIPPED,      // Order has been shipped
    DELIVERED,    // Order delivered to customer
    CANCELLED     // Order was cancelled
}
```

#### Why Use Enum for Status?

```java
// ❌ BAD: Using strings
order.setStatus("pending");     // Typo possible: "penidng"
order.setStatus("PENDING");     // Inconsistent casing
order.setStatus("new");         // Invalid status

// ✅ GOOD: Using enum
order.setStatus(OrderStatus.PENDING);  // Compile-time safety
order.setStatus(OrderStatus.NEW);      // Compile error! NEW doesn't exist
```

### 6.9 OrderItem Entity

**File: `model/OrderItem.java`**

```java
package com.ecommerce.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "order_item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    private int qty;
    private double priceAtPurchase;  // 💡 CRITICAL: Price snapshot at purchase time
    private double subtotal;         // qty * priceAtPurchase

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // Getters & Setters...
}
```

#### Why Store priceAtPurchase?

Product prices change over time. If you only stored a reference to the product:
- Customer ordered iPhone at $999
- Apple raises price to $1099
- Customer's order history now shows $1099 (WRONG!)

By storing `priceAtPurchase`, you create a **snapshot** of the price at order time.

### 6.10 Transaction Entity

**File: `model/Transaction.java`**

```java
package com.ecommerce.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    private double amount;
    private String paymentMode;       // "COD", "CREDIT_CARD", "UPI", etc.
    private String paymentStatus;     // "SUCCESS", "FAILED", "PENDING"
    private String paymentGatewayRef; // Reference from payment gateway (e.g., Stripe ID)
    private LocalDateTime transactionDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters & Setters...
}
```

### 6.11 Review Entity

**File: `model/Review.java`**

```java
package com.ecommerce.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "product_id"}))
       // Ensures one user can only review a product once
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    private int rating;           // 1 to 5 stars
    private String comment;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // Getters & Setters...
}
```

---

## 7. Repository Layer - Data Access

Repositories provide database access. Spring Data JPA **generates implementations automatically** from interface definitions!

### 7.1 How Spring Data JPA Works

You just define an interface, and Spring creates the implementation:

```java
// You write this:
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

// Spring automatically generates something like this:
public class UserRepositoryImpl implements UserRepository {
    @Override
    public Optional<User> findByEmail(String email) {
        return entityManager.createQuery(
            "SELECT u FROM User u WHERE u.email = :email", User.class)
            .setParameter("email", email)
            .getResultStream()
            .findFirst();
    }
    // ... plus all JpaRepository methods
}
```

### 7.2 UserRepository

**File: `repository/UserRepository.java`**

```java
package com.ecommerce.repository;

import com.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // JpaRepository<EntityType, PrimaryKeyType>
    
    // ======== INHERITED METHODS (FREE!) ========
    // save(User user)           → INSERT or UPDATE
    // findById(Long id)         → SELECT * WHERE user_id = ?
    // findAll()                 → SELECT * FROM users
    // deleteById(Long id)       → DELETE WHERE user_id = ?
    // count()                   → SELECT COUNT(*) FROM users
    // existsById(Long id)       → Check if exists
    
    // ======== CUSTOM QUERY METHOD ========
    Optional<User> findByEmail(String email);
    // Spring generates: SELECT * FROM users WHERE email = ?
    // Returns Optional because user might not exist
}
```

### 7.3 Query Method Naming Convention

Spring Data JPA parses method names and generates SQL:

| Method Name | Generated SQL |
|-------------|---------------|
| `findByEmail(String email)` | `WHERE email = ?` |
| `findByEmailAndPassword(String e, String p)` | `WHERE email = ? AND password = ?` |
| `findByBasePriceGreaterThan(double p)` | `WHERE base_price > ?` |
| `findByProductNameContaining(String k)` | `WHERE product_name LIKE '%?%'` |
| `findByProductNameContainingIgnoreCase(String k)` | `WHERE LOWER(product_name) LIKE LOWER('%?%')` |
| `findByCategory_CategoryId(Long id)` | `WHERE category_id = ?` (nested property) |
| `findByUser_UserId(Long id)` | `WHERE user_id = ?` (nested property) |
| `countByStatus(OrderStatus s)` | `SELECT COUNT(*) WHERE status = ?` |
| `existsByEmail(String email)` | `SELECT CASE WHEN COUNT > 0 THEN TRUE...` |

### 7.4 ProductRepository with Custom Query

**File: `repository/ProductRepository.java`**

```java
package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // ======== DERIVED QUERY METHODS ========
    
    List<Product> findByCategory_CategoryId(Long categoryId);
    // _ navigates relationships: Product -> category -> categoryId
    // SQL: SELECT * FROM product WHERE category_id = ?
    
    List<Product> findByProductNameContainingIgnoreCase(String keyword);
    // SQL: SELECT * FROM product WHERE LOWER(product_name) LIKE LOWER('%keyword%')
    
    // ======== CUSTOM JPQL QUERY ========
    
    @Query("""
        SELECT p FROM Product p
        WHERE (:keyword IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categoryId IS NULL OR p.category.categoryId = :categoryId)
        AND (:minPrice IS NULL OR p.basePrice >= :minPrice)
        AND (:maxPrice IS NULL OR p.basePrice <= :maxPrice)
    """)
    List<Product> filterProducts(
        @Param("keyword") String keyword,
        @Param("categoryId") Long categoryId,
        @Param("minPrice") Double minPrice,
        @Param("maxPrice") Double maxPrice
    );
    // This is JPQL (Java Persistence Query Language), not SQL
    // Uses entity/field names, not table/column names
    // :param syntax for named parameters
    // Handles NULL parameters gracefully (ignores filter if NULL)
}
```

#### JPQL vs SQL

| JPQL | SQL |
|------|-----|
| `SELECT p FROM Product p` | `SELECT * FROM product` |
| `p.productName` | `product_name` |
| `p.category.categoryId` | `category_id` (via JOIN) |
| Entity names | Table names |
| Field names | Column names |

### 7.5 Other Repository Interfaces

**File: `repository/RoleRepository.java`**

```java
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
    // Find role by name, e.g., "ADMIN" or "CUSTOMER"
}
```

**File: `repository/CartRepository.java`**

```java
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser_UserId(Long userId);
    // Find cart for specific user
}
```

**File: `repository/CartItemRepository.java`**

```java
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCart_CartId(Long cartId);
    // Get all items in a specific cart
}
```

**File: `repository/OrderRepository.java`**

```java
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_UserId(Long userId);
    // Get all orders for a user
}
```

**File: `repository/OrderItemRepository.java`**

```java
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    @Query("SELECT oi FROM OrderItem oi JOIN FETCH oi.product WHERE oi.order.orderId = :orderId")
    List<OrderItem> findByOrder_OrderId(@Param("orderId") Long orderId);
    // JOIN FETCH: Loads products in same query (avoids N+1 problem)
}
```

**File: `repository/ReviewRepository.java`**

```java
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByProduct_ProductId(Long productId);
    // Get all reviews for a product
    
    Optional<Review> findByUser_UserIdAndProduct_ProductId(Long userId, Long productId);
    // Check if user already reviewed this product
}
```

---

## 8. DTO Layer - Data Transfer Objects

DTOs separate your **internal data model** (entities) from your **external API contract**.

### 8.1 Why Use DTOs?

```java
// ❌ BAD: Returning entity directly
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) {
    return userRepository.findById(id).get();
}
// PROBLEMS:
// 1. Exposes password hash to client!
// 2. Exposes internal database IDs
// 3. May cause infinite recursion (User -> Orders -> User -> ...)
// 4. API changes whenever entity changes

// ✅ GOOD: Using DTO
@GetMapping("/users/{id}")
public UserResponse getUser(@PathVariable Long id) {
    User user = userRepository.findById(id).get();
    UserResponse dto = new UserResponse();
    dto.setEmail(user.getEmail());
    dto.setPhone(user.getPhone());
    return dto;
}
// BENEFITS:
// 1. Password hidden
// 2. Control over what's exposed
// 3. No circular references
// 4. Stable API contract
```

### 8.2 Request DTOs (Input)

#### LoginRequest

**File: `dto/LoginRequest.java`**

```java
package com.ecommerce.dto;

public class LoginRequest {
    private String email;
    private String password;
    
    // Getters & Setters
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}
```

**Example JSON Input:**
```json
{
    "email": "user@example.com",
    "password": "mypassword123"
}
```

#### RegisterRequest

**File: `dto/RegisterRequest.java`**

```java
package com.ecommerce.dto;

public class RegisterRequest {
    private String email;
    private String password;
    private String phone;
    private String address;
    private String role;  // Optional: "ADMIN" or "CUSTOMER" (defaults to CUSTOMER if not provided)

    // Getters & Setters...
}
```

#### ProductRequest (with Validation)

**File: `dto/ProductRequest.java`**

```java
package com.ecommerce.dto;

import jakarta.validation.constraints.*;

public class ProductRequest {

    @NotBlank  // Cannot be null, empty, or whitespace
    private String productName;

    private String productDescription;  // Optional

    @NotBlank
    private String sku;

    private String picture;  // Optional

    @NotNull                 // Cannot be null
    @Positive               // Must be > 0
    private double basePrice;

    @Min(0)                 // Cannot be negative
    private int stockQty;

    @NotNull
    private Long categoryId;

    // Getters & Setters...
}
```

### 8.3 Validation Annotations Reference

| Annotation | Description | Example |
|------------|-------------|---------|
| `@NotNull` | Field cannot be null | `@NotNull Long id` |
| `@NotBlank` | String cannot be null, empty, or whitespace | `@NotBlank String name` |
| `@NotEmpty` | Collection/String cannot be null or empty | `@NotEmpty List<Item> items` |
| `@Min(value)` | Minimum numeric value | `@Min(0) int qty` |
| `@Max(value)` | Maximum numeric value | `@Max(5) int rating` |
| `@Positive` | Must be > 0 | `@Positive double price` |
| `@PositiveOrZero` | Must be >= 0 | `@PositiveOrZero int stock` |
| `@Size(min, max)` | String/Collection size | `@Size(min=2, max=50) String name` |
| `@Email` | Valid email format | `@Email String email` |
| `@Pattern(regexp)` | Match regex | `@Pattern(regexp="[A-Z]{3}") String code` |

#### CartItemRequest (with Validation)

**File: `dto/CartItemRequest.java`**

```java
package com.ecommerce.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CartItemRequest {

    @NotNull
    private Long productId;

    @Min(1)  // Must add at least 1 item
    private int qty;

    // Getters & Setters...
}
```

#### ReviewRequest (with Validation)

**File: `dto/ReviewRequest.java`**

```java
package com.ecommerce.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ReviewRequest {

    @NotNull
    private Long productId;

    @Min(1)   // Minimum 1 star
    @Max(5)   // Maximum 5 stars
    private int rating;

    private String comment;  // Optional

    // Getters & Setters...
}
```

### 8.4 Response DTOs (Output)

#### ProductResponse

**File: `dto/ProductResponse.java`**

```java
package com.ecommerce.dto;

public class ProductResponse {
    private Long productId;
    private String productName;
    private String productDescription;
    private String sku;
    private String picture;
    private double basePrice;
    private int stockQty;
    private Long categoryId;
    private String categoryName;  // Flattened from category entity
    
    // Getters & Setters...
}
```

**Example JSON Output:**
```json
{
    "productId": 1,
    "productName": "iPhone 15",
    "productDescription": "Latest Apple smartphone",
    "sku": "IPH15-128",
    "picture": "iphone15.jpg",
    "basePrice": 79999.00,
    "stockQty": 50,
    "categoryId": 1,
    "categoryName": "Electronics"
}
```

#### CartResponse

**File: `dto/CartResponse.java`**

```java
package com.ecommerce.dto;

import java.util.List;

public class CartResponse {
    private Long cartId;
    private List<CartItemResponse> items;
    private double totalAmount;  // Calculated sum
    
    // Getters & Setters...
}
```

#### CartItemResponse

**File: `dto/CartItemResponse.java`**

```java
package com.ecommerce.dto;

public class CartItemResponse {
    private Long productId;
    private String productName;
    private int qty;
    private double priceAtAdd;
    private double subtotal;  // qty * priceAtAdd
    
    // Getters & Setters...
}
```

---

## 9. Service Layer - Business Logic

Services contain **business logic**. They coordinate between controllers and repositories.

### 9.1 Service Layer Responsibilities

- ✅ Business logic and validation
- ✅ Transaction management
- ✅ Calling multiple repositories
- ✅ Converting entities to DTOs
- ✅ Throwing business exceptions

### 9.2 AuthService

**File: `service/AuthService.java`**

```java
package com.ecommerce.service;

import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.model.User;
import com.ecommerce.model.Role;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.repository.RoleRepository;
import com.ecommerce.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service  // Marks this as a Spring-managed service bean
public class AuthService {

    // Dependencies injected via constructor
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    // Constructor injection (recommended over @Autowired)
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    /**
     * Register a new user
     *
     * Steps:
     * 1. Create User entity
     * 2. Hash the password (NEVER store plain text!)
     * 3. Assign role (default CUSTOMER if not specified)
     * 4. Save to database
     */
    public void register(RegisterRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());

        // 🔐 CRITICAL: Hash password before storing
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        // BCrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeD...

        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setCreatedAt(LocalDateTime.now());

        // Determine role (defaults to CUSTOMER if not specified)
        String roleName = (request.getRole() != null && !request.getRole().isEmpty())
                ? request.getRole().toUpperCase()
                : "CUSTOMER";

        // Find or create role
        Role userRole = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));
        user.setRoles(List.of(userRole));

        userRepository.save(user);
    }

    /**
     * Login user and return JWT token
     * 
     * Steps:
     * 1. Authenticate credentials using Spring Security
     * 2. If valid, generate JWT token
     * 3. Return token to client
     */
    public String login(LoginRequest request, 
                       AuthenticationManager authenticationManager, 
                       JwtService jwtService) {
        
        // Spring Security validates credentials
        // Throws BadCredentialsException if invalid
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // If we get here, credentials are valid
        // Generate and return JWT token
        return jwtService.generateToken(request.getEmail());
    }
}
```

### 9.3 @Transactional Explained

```java
@Transactional
public OrderResponse placeOrder(User user) {
    // All database operations here are part of ONE transaction
    // If any exception occurs, ALL changes are rolled back
}
```

**Without @Transactional:**
```
1. Create Order ✅ (saved to DB)
2. Reduce Stock for Product A ✅ (saved to DB)
3. Reduce Stock for Product B ❌ (exception: out of stock)
// PROBLEM: Order exists but only partial stock was reduced!
```

**With @Transactional:**
```
1. Create Order (pending commit)
2. Reduce Stock for Product A (pending commit)
3. Reduce Stock for Product B ❌ (exception: out of stock)
// ALL changes rolled back - no Order created, no stock changed
```

---

## 10. Controller Layer - REST API Endpoints

Controllers handle **HTTP requests** and delegate to services.

### 10.1 Controller Responsibilities

- ✅ HTTP request/response handling
- ✅ URL mapping
- ✅ Input validation triggering
- ✅ Authentication context extraction
- ❌ NO business logic (delegate to Service)
- ❌ NO direct database access

### 10.2 AuthController

**File: `controller/AuthController.java`**

```java
package com.ecommerce.controller;

import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.service.AuthService;
import com.ecommerce.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

@RestController           // Combines @Controller + @ResponseBody
@RequestMapping("/auth")  // Base path for all endpoints in this controller
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    // Constructor injection
    public AuthController(AuthService authService, 
                         AuthenticationManager authenticationManager, 
                         JwtService jwtService) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    /**
     * POST /auth/register
     * Public endpoint - no authentication required
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        // @RequestBody: Deserializes JSON body to RegisterRequest object
        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
        // ResponseEntity.ok() returns HTTP 200 with body
    }

    /**
     * POST /auth/login
     * Public endpoint - returns JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        String token = authService.login(request, authenticationManager, jwtService);
        return ResponseEntity.ok(token);
        // Client stores this token for future requests
    }
}
```

### 10.3 Controller Annotations Reference

| Annotation | Description |
|------------|-------------|
| `@RestController` | Marks class as REST controller, auto-serializes responses to JSON |
| `@RequestMapping("/path")` | Base URL path for all methods |
| `@GetMapping` | Handles HTTP GET requests |
| `@PostMapping` | Handles HTTP POST requests |
| `@PutMapping` | Handles HTTP PUT requests |
| `@DeleteMapping` | Handles HTTP DELETE requests |
| `@PathVariable` | Extracts value from URL path: `/users/{id}` |
| `@RequestParam` | Extracts query parameter: `/search?keyword=x` |
| `@RequestBody` | Deserializes JSON request body |
| `@Valid` | Triggers bean validation |
| `@PreAuthorize` | Method-level security check |
| `Authentication` | Injected current user's authentication |

### 10.4 ResponseEntity HTTP Status Codes

```java
ResponseEntity.ok(body)                         // 200 OK
ResponseEntity.status(HttpStatus.CREATED).body(x)  // 201 Created
ResponseEntity.noContent().build()              // 204 No Content
ResponseEntity.badRequest().body(error)         // 400 Bad Request
ResponseEntity.notFound().build()               // 404 Not Found
ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()  // 401 Unauthorized
ResponseEntity.status(HttpStatus.FORBIDDEN).build()     // 403 Forbidden
```

---

## 11. Security Implementation

### 11.1 Security Architecture

```
HTTP Request
     │
     ▼
┌─────────────────────────────────────────┐
│      JwtAuthenticationFilter            │
│  1. Extract token from Authorization    │
│  2. Validate token signature            │
│  3. Load user from database             │
│  4. Set SecurityContext                 │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│      SecurityFilterChain                │
│  Check authorization rules:             │
│  - /auth/** → permitAll()               │
│  - /api/cart/** → hasRole(CUSTOMER)     │
│  - /api/orders/all → hasRole(ADMIN)     │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│      Controller                         │
│  @PreAuthorize checks (if any)          │
└─────────────────────────────────────────┘
```

### 11.2 SecurityConfig

**File: `security/SecurityConfig.java`**

```java
package com.ecommerce.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration  // Marks as configuration class
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * Main security configuration
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF (not needed for stateless REST APIs)
            .csrf(csrf -> csrf.disable())
            
            // 2. Stateless session (no server-side session storage)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 3. Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                // PUBLIC endpoints - no authentication required
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/api/products/**").permitAll()
                .requestMatchers("/api/categories/**").permitAll()
                .requestMatchers("/api/reviews/**").permitAll()

                // CUSTOMER/ADMIN endpoints
                .requestMatchers("/api/cart/**").hasAnyRole("CUSTOMER", "ADMIN")
                .requestMatchers("/api/orders/checkout").hasAnyRole("CUSTOMER", "ADMIN")
                .requestMatchers("/api/orders/my").hasAnyRole("CUSTOMER", "ADMIN")

                // ADMIN only endpoints
                .requestMatchers("/api/orders/all").hasRole("ADMIN")
                .requestMatchers("/api/orders/*/status").hasRole("ADMIN")

                // Everything else requires authentication
                .anyRequest().authenticated()
            )
            
            // 4. Add JWT filter BEFORE username/password filter
            .addFilterBefore(jwtAuthenticationFilter, 
                           UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    /**
     * Password encoder for hashing passwords
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
        // BCrypt is industry standard:
        // - Salted (different hash for same password)
        // - Slow (prevents brute force)
        // - Configurable work factor
    }

    /**
     * Authentication manager for login validation
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

### 11.3 JwtService

**File: `security/JwtService.java`**

```java
package com.ecommerce.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")  // Injected from application.properties
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    /**
     * Create signing key from secret
     */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
        // HMAC-SHA256 key for signing tokens
    }

    /**
     * Generate JWT token for user
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)              // Who this token is for (email)
                .setIssuedAt(new Date())           // When token was created
                .setExpiration(new Date(           // When token expires
                    System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(),         // Sign with secret key
                         SignatureAlgorithm.HS256)
                .compact();                        // Build the string
    }
    // Result: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQHRlc3QuY29tIiwiaWF0IjoxNjMyMTQ2NDAwLCJleHAiOjE2MzIyMzI4MDB9.abc123...

    /**
     * Extract username (email) from token
     */
    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Validate token
     * - Check signature
     * - Check expiration
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException e) {
            // Invalid signature, expired, malformed, etc.
            return false;
        }
    }

    /**
     * Parse and validate token claims
     */
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())  // Use same key to verify
                .build()
                .parseClaimsJws(token)           // Parse and validate
                .getBody();                      // Get claims (payload)
    }
}
```

### 11.4 JWT Token Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQHRlc3QuY29tIiwiaWF0IjoxNjMyMTQ2NDAwLCJleHAiOjE2MzIyMzI4MDB9.K7gNU3sdo-OL0wNhqoVWhr3g6s1xYv72ol_pe_Unols

[HEADER].[PAYLOAD].[SIGNATURE]
```

**Header** (Base64 decoded):
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload** (Base64 decoded):
```json
{
  "sub": "user@test.com",    // Subject (username)
  "iat": 1632146400,         // Issued at (timestamp)
  "exp": 1632232800          // Expiration (timestamp)
}
```

**Signature**: HMAC-SHA256 hash of header + payload + secret

### 11.5 CustomUserDetailsService

**File: `security/CustomUserDetailsService.java`**

```java
package com.ecommerce.security;

import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    // Spring Security uses this to load user during authentication

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Find user in database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 2. Convert to Spring Security's UserDetails
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),      // Username
                user.getPassword(),   // Hashed password
                user.getRoles() == null
                        ? List.of()
                        : user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                        // IMPORTANT: Prefix with "ROLE_"
                        // Role "CUSTOMER" becomes "ROLE_CUSTOMER"
                        // Required for hasRole("CUSTOMER") to work
                        .collect(Collectors.toList())
        );
    }
}
```

#### Why "ROLE_" Prefix?

Spring Security's `hasRole("CUSTOMER")` internally checks for `ROLE_CUSTOMER`:

```java
// In SecurityConfig:
.hasRole("ADMIN")  // Checks for authority "ROLE_ADMIN"
.hasRole("CUSTOMER")  // Checks for authority "ROLE_CUSTOMER"

// In CustomUserDetailsService:
new SimpleGrantedAuthority("ROLE_" + role.getName())
// Creates: ROLE_ADMIN, ROLE_CUSTOMER
```

---

## 12. Exception Handling

### 12.1 GlobalExceptionHandler

**File: `exception/GlobalExceptionHandler.java`**

```java
package com.ecommerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice  // Handles exceptions across ALL controllers
public class GlobalExceptionHandler {

    /**
     * Handle validation errors
     * Triggered when @Valid fails
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        
        // Extract field-level errors
        ex.getBindingResult().getFieldErrors().forEach(err ->
                errors.put(err.getField(), err.getDefaultMessage())
        );
        
        return ResponseEntity.badRequest().body(errors);
        // Example response:
        // { "productName": "must not be blank", "basePrice": "must be positive" }
    }

    /**
     * Handle business logic exceptions
     * Triggered by throw new RuntimeException("message")
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        // Example response:
        // { "error": "Product not found" }
    }

    /**
     * Fallback for unexpected errors
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "Internal server error");
        // Don't expose internal error details to client!
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

---

## 13. Data Seeder

### 13.1 Initial Data Setup

**File: `DataSeeder.java`**

```java
package com.ecommerce;

import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataSeeder {

    /**
     * CommandLineRunner runs ONCE when application starts
     */
    @Bean
    CommandLineRunner seedData(
            RoleRepository roleRepo,
            UserRepository userRepo,
            ProductCategoryRepository categoryRepo,
            ProductRepository productRepo,
            PasswordEncoder encoder) {

        return args -> {
            // Skip if data already exists
            if (!roleRepo.findAll().isEmpty()) {
                System.out.println("Data already seeded");
                return;
            }

            // ===== CREATE ROLES =====
            Role adminRole = roleRepo.save(new Role("ADMIN"));
            Role customerRole = roleRepo.save(new Role("CUSTOMER"));

            // ===== CREATE USERS =====
            User admin = new User();
            admin.setEmail("admin@test.com");
            admin.setPassword(encoder.encode("admin123"));  // Hashed!
            admin.setAddress("Admin Street");
            admin.setCreatedAt(LocalDateTime.now());
            admin.setRoles(List.of(adminRole));
            userRepo.save(admin);

            User customer = new User();
            customer.setEmail("user@test.com");
            customer.setPassword(encoder.encode("user123"));  // Hashed!
            customer.setAddress("User Street");
            customer.setCreatedAt(LocalDateTime.now());
            customer.setRoles(List.of(customerRole));
            userRepo.save(customer);

            // ===== CREATE CATEGORIES =====
            ProductCategory electronics = new ProductCategory();
            electronics.setName("Electronics");
            electronics.setDescription("Electronic items");
            categoryRepo.save(electronics);

            ProductCategory fashion = new ProductCategory();
            fashion.setName("Fashion");
            fashion.setDescription("Clothing items");
            categoryRepo.save(fashion);

            // ===== CREATE PRODUCTS =====
            Product phone = new Product();
            phone.setProductName("iPhone");
            phone.setProductDescription("Smartphone");
            phone.setSku("IPH001");
            phone.setBasePrice(70000);
            phone.setStockQty(10);
            phone.setCategory(electronics);
            productRepo.save(phone);

            Product tshirt = new Product();
            tshirt.setProductName("T-Shirt");
            tshirt.setProductDescription("Cotton t-shirt");
            tshirt.setSku("TSH001");
            tshirt.setBasePrice(500);
            tshirt.setStockQty(100);
            tshirt.setCategory(fashion);
            productRepo.save(tshirt);

            System.out.println("✅ Sample data seeded successfully!");
        };
    }
}
```

### 13.2 Seeded Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | admin123 | ADMIN |
| user@test.com | user123 | CUSTOMER |

---

## 14. Key Workflows Explained

### 14.1 User Registration Flow

```
┌─────────┐                    ┌──────────────────┐
│ Client  │                    │ AuthController   │
└────┬────┘                    └────────┬─────────┘
     │                                  │
     │ POST /auth/register              │
     │ {email, password, phone}         │
     ├─────────────────────────────────►│
     │                                  │
     │                         ┌────────┴─────────┐
     │                         │   AuthService    │
     │                         └────────┬─────────┘
     │                                  │
     │                    1. Create User entity
     │                    2. Hash password (BCrypt)
     │                    3. Find/create CUSTOMER role
     │                    4. Save to database
     │                                  │
     │                         ┌────────┴─────────┐
     │                         │ UserRepository   │
     │                         └────────┬─────────┘
     │                                  │
     │                           INSERT INTO users...
     │                                  │
     │ 200 OK                           │
     │ "User registered successfully"   │
     │◄─────────────────────────────────┤
```

### 14.2 User Login Flow

```
┌─────────┐                    ┌──────────────────┐
│ Client  │                    │ AuthController   │
└────┬────┘                    └────────┬─────────┘
     │                                  │
     │ POST /auth/login                 │
     │ {email, password}                │
     ├─────────────────────────────────►│
     │                                  │
     │                         ┌────────┴─────────┐
     │                         │AuthenticationMgr │
     │                         └────────┬─────────┘
     │                                  │
     │              1. Load user via CustomUserDetailsService
     │              2. Compare BCrypt hashes
     │              3. If valid, authenticate
     │                                  │
     │                         ┌────────┴─────────┐
     │                         │   JwtService     │
     │                         └────────┬─────────┘
     │                                  │
     │              Generate JWT token with:
     │              - subject: email
     │              - issued at: now
     │              - expiration: now + 1 hour
     │              - signature: HMAC-SHA256
     │                                  │
     │ 200 OK                           │
     │ "eyJhbGciOiJIUzI1NiIs..."       │
     │◄─────────────────────────────────┤
     │                                  │
     │ Store token in localStorage      │
```

### 14.3 Checkout Flow

```
┌─────────┐           ┌────────────────┐         ┌─────────────────┐
│ Client  │           │OrderController │         │  OrderService   │
└────┬────┘           └───────┬────────┘         └────────┬────────┘
     │                        │                           │
     │ POST /api/orders/checkout                          │
     │ Authorization: Bearer...                           │
     ├───────────────────────►│                           │
     │                        │                           │
     │                        │  @Transactional           │
     │                        │  placeOrder(user)         │
     │                        ├──────────────────────────►│
     │                        │                           │
     │                        │   1. Get user's cart      │
     │                        │   2. Validate not empty   │
     │                        │   3. Create Order         │
     │                        │                           │
     │                        │   FOR EACH CartItem:      │
     │                        │   ├─ Check stock          │
     │                        │   ├─ Reduce stock         │
     │                        │   └─ Create OrderItem     │
     │                        │                           │
     │                        │   4. Calculate total      │
     │                        │   5. Create Transaction   │
     │                        │   6. Clear cart           │
     │                        │   7. COMMIT transaction   │
     │                        │                           │
     │                        │◄──────────────────────────┤
     │ 200 OK                 │                           │
     │ {orderId, items, total}│                           │
     │◄───────────────────────┤                           │
```

---

## 15. API Reference

### 15.1 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ No |
| POST | `/auth/login` | Login and get JWT | ❌ No |

### 15.2 Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | List all products | ❌ No |
| GET | `/api/products/category/{id}` | Products by category | ❌ No |
| GET | `/api/products/search?keyword=x` | Search products | ❌ No |
| GET | `/api/products/filter?...` | Filter products | ❌ No |
| POST | `/api/products` | Create product | ✅ ADMIN |

### 15.3 Category Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | List all categories | ❌ No |
| POST | `/api/categories` | Create category | ✅ ADMIN |

### 15.4 Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get user's cart | ✅ User |
| POST | `/api/cart/add` | Add item to cart | ✅ User |
| DELETE | `/api/cart/remove/{productId}` | Remove from cart | ✅ User |

### 15.5 Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders/checkout` | Place order | ✅ User |
| GET | `/api/orders/my` | My order history | ✅ User |
| GET | `/api/orders/all` | All orders | ✅ ADMIN |
| PUT | `/api/orders/{id}/status?status=X` | Update status | ✅ ADMIN |

### 15.6 Review Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reviews/{productId}` | Get product reviews | ❌ No |
| POST | `/api/reviews` | Add review | ✅ User |

### 15.7 Payment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payments` | Pay for an order (mock gateway) | ✅ User |

---

## 16. How to Run

### 16.1 Prerequisites

- **Java 21 JDK** - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use SDKMAN
- **Maven 3.9+** - Usually bundled with IDE
- **PostgreSQL** - Download from [PostgreSQL](https://www.postgresql.org/download/)
- **IDE** - IntelliJ IDEA, Eclipse, or VS Code

### 16.2 Security Configuration Setup

⚠️ **IMPORTANT:** Before running the application, set up your configuration file:

```bash
# Copy the example configuration
cp application.properties.example src/main/resources/application.properties

# Edit the file and update:
# - Database credentials
# - JWT secret (generate using: openssl rand -base64 64)
# - Razorpay API keys (get from https://dashboard.razorpay.com/app/keys)
```

**See [SECURITY.md](SECURITY.md) for detailed setup instructions.**

### 16.3 Database Setup

```sql
-- Connect to PostgreSQL and create database
CREATE DATABASE ecommerce_db;
```

### 16.4 Run the Application

```bash
# Clone the repository
git clone <repository-url>
cd Ecommerce

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# OR run the JAR directly
java -jar target/Ecommerce-0.0.1-SNAPSHOT.jar
```

### 16.5 Verify It's Running

```bash
# Check health endpoint
curl -H "Authorization: Bearer ADMIN_TOKEN_HERE" http://localhost:8080/actuator/health

# Should return:
# {"status":"UP"}

# Example metric (needs admin token)
curl -H "Authorization: Bearer ADMIN_TOKEN_HERE" http://localhost:8080/actuator/metrics/jvm.memory.used
```

---

## 17. Testing the API

### 17.1 Using cURL

```bash
# ===== 1. REGISTER (as CUSTOMER) =====
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","phone":"1234567890","address":"Test Street","role":"CUSTOMER"}'

# ===== 1b. REGISTER (as ADMIN) =====
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin2@test.com","password":"admin123","phone":"1234567890","address":"Admin Street","role":"ADMIN"}'

# ===== 2. LOGIN =====
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"user123"}'

# Save the returned token!
# Example: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQHRlc3QuY29tIiw...

# ===== 3. GET PRODUCTS (Public) =====
curl http://localhost:8080/api/products

# ===== 4. ADD TO CART (Authenticated) =====
curl -X POST http://localhost:8080/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"productId":1,"qty":2}'

# ===== 5. VIEW CART =====
curl http://localhost:8080/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# ===== 6. CHECKOUT =====
curl -X POST http://localhost:8080/api/orders/checkout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# ===== 7. VIEW MY ORDERS =====
curl http://localhost:8080/api/orders/my \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# ===== ADMIN: Create Product =====
# First login as admin@test.com / admin123
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -d '{"productName":"MacBook","productDescription":"Laptop","sku":"MAC001","basePrice":150000,"stockQty":5,"categoryId":1}'
```

### 17.2 Using Postman

1. **Import Collection**: Create a new collection "Ecommerce API"

2. **Environment Variables**:
   - `baseUrl`: `http://localhost:8080`
   - `token`: (set after login)

3. **Auth Requests**:
   - POST `{{baseUrl}}/auth/register`
   - POST `{{baseUrl}}/auth/login`

4. **Add Authorization**:
   - In collection settings, set Authorization Type to "Bearer Token"
   - Token: `{{token}}`

5. **Save Token Automatically**:
   In Login request's "Tests" tab:
   ```javascript
   pm.environment.set("token", pm.response.text());
   ```

---

## 📚 Summary

This project demonstrates a complete, production-ready Spring Boot application with:

| Concept | Implementation |
|---------|----------------|
| **Layered Architecture** | Controller → Service → Repository → Database |
| **REST API Design** | Proper HTTP methods, status codes, resource naming |
| **Spring Data JPA** | Entity mapping, relationships, custom queries |
| **Security** | JWT authentication, role-based authorization |
| **Validation** | Bean validation with detailed error messages |
| **Exception Handling** | Global handler with consistent error responses |
| **Monitoring** | Actuator endpoints secured to ADMIN |
| **Caching** | Product list cache with eviction on writes |
| **Payments** | Mock payment flow with transaction tracking |

### Final System Flow (End-to-End)

User → Auth (JWT) → Browse Products (cached) → Add to Cart → Checkout → Payment (mock gateway) → Order Confirmed → Track Order (metrics/health via Actuator for admins)
| **DTO Pattern** | Separate API contract from internal model |
| **Dependency Injection** | Constructor injection throughout |
| **Transaction Management** | @Transactional for atomic operations |

### Key Annotations to Remember

| Category | Annotations |
|----------|-------------|
| **Spring Core** | `@Component`, `@Service`, `@Repository`, `@Controller`, `@Configuration` |
| **REST API** | `@RestController`, `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PathVariable`, `@RequestParam`, `@RequestBody` |
| **JPA** | `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`, `@OneToMany`, `@ManyToOne`, `@ManyToMany`, `@JoinColumn`, `@JoinTable` |
| **Validation** | `@Valid`, `@NotNull`, `@NotBlank`, `@Min`, `@Max`, `@Size`, `@Email` |
| **Security** | `@PreAuthorize`, `@EnableMethodSecurity` |
| **Transaction** | `@Transactional` |

---

**Happy Learning! 🚀**
