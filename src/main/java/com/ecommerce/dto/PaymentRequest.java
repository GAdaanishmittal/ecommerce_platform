package com.ecommerce.dto;

public class PaymentRequest {

    private Long orderId;
    private String paymentMode; // CARD, UPI, COD

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }
}
