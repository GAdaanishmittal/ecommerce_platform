package com.ecommerce.dto;

import com.ecommerce.dto.CartItemResponse;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;

public class OrderResponse {
    private Long orderId;
    private double totalAmount;
    private String status;  // Shipment status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
    private String paymentStatus;  // Payment status (PENDING, SUCCESS, FAILED)
    private Long userId;
    private String userEmail;
    
    @com.fasterxml.jackson.annotation.JsonProperty("orderDate")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private java.time.LocalDateTime orderDate;

    private String paymentMode;
    private String transactionRef;
    private String transactionStatus;
    private Long transactionId;
    private java.time.LocalDateTime transactionDate;

    private List<CartItemResponse> items;

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<CartItemResponse> getItems() {
        return items;
    }

    public void setItems(List<CartItemResponse> items) {
        this.items = items;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public java.time.LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(java.time.LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public String getTransactionRef() {
        return transactionRef;
    }

    public void setTransactionRef(String transactionRef) {
        this.transactionRef = transactionRef;
    }

    public java.time.LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(java.time.LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(String transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }
}
