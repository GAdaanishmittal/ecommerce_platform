package com.ecommerce.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    private double totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;  // Shipment status: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED

    private String paymentStatus;  // Payment status: PENDING, SUCCESS, FAILED

    private LocalDateTime orderDate;
    private String shippingAddress;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore   // ✅ VERY IMPORTANT
    private User user;

    @OneToMany(mappedBy = "order")
    @JsonIgnore   // ✅ VERY IMPORTANT
    private List<OrderItem> items;

    @OneToOne
    @JoinColumn(name = "transaction_id")
    @JsonIgnore   // ✅ VERY IMPORTANT
    private Transaction transaction;

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}
