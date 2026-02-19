package com.ecommerce.dto;

import java.time.LocalDateTime;

public class PaymentResponse {
    private String status;
    private String message;
    private String orderId; // Razorpay order ID
    private String paymentId; // Razorpay payment ID
    private String signature; // Razorpay signature
    private LocalDateTime transactionDate; // Transaction timestamp
    private Double amount; // Transaction amount
    private String transactionId; // Transaction ID from database

    // ...existing code...
    public PaymentResponse(String status, String message) {
        this.status = status;
        this.message = message;
    }

    public PaymentResponse(String status, String message, String orderId, String paymentId, String signature) {
        this.status = status;
        this.message = message;
        this.orderId = orderId;
        this.paymentId = paymentId;
        this.signature = signature;
    }

    public PaymentResponse(String status, String message, String orderId, String paymentId, String signature,
                          LocalDateTime transactionDate, Double amount, String transactionId) {
        this.status = status;
        this.message = message;
        this.orderId = orderId;
        this.paymentId = paymentId;
        this.signature = signature;
        this.transactionDate = transactionDate;
        this.amount = amount;
        this.transactionId = transactionId;
    }

    // ...existing code...
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
}
