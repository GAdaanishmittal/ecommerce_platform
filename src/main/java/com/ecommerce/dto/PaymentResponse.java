package com.ecommerce.dto;

public class PaymentResponse {
    private String status;
    private String message;
    private String orderId; // Razorpay order ID
    private String paymentId; // Razorpay payment ID
    private String signature; // Razorpay signature

    // Constructors
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

    // Getters and Setters
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
}
