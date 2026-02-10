package com.ecommerce.controller;

import com.ecommerce.dto.PaymentRequest;
import com.ecommerce.dto.PaymentResponse;
import com.ecommerce.service.PaymentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${payment.demo.mode:false}")
    private boolean demoMode;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Initiate payment - creates Razorpay order or processes demo payment
     */
    @PostMapping
    public ResponseEntity<?> pay(@RequestBody PaymentRequest request) {
        String result = paymentService.pay(request.getOrderId(), request.getPaymentMode());

        if (demoMode) {
            // Demo mode - payment completed immediately
            return ResponseEntity.ok(new PaymentResponse("SUCCESS", "Demo payment completed", result, null, null));
        } else {
            // Razorpay mode - return order ID for frontend to complete payment
            return ResponseEntity.ok(Map.of(
                "status", "RAZORPAY_ORDER_CREATED",
                "razorpayOrderId", result,
                "razorpayKeyId", razorpayKeyId,
                "message", "Complete payment using Razorpay checkout"
            ));
        }
    }

    /**
     * Verify Razorpay payment after completion
     */
    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(@RequestBody Map<String, String> payload) {
        String razorpayOrderId = payload.get("razorpay_order_id");
        String razorpayPaymentId = payload.get("razorpay_payment_id");
        String razorpaySignature = payload.get("razorpay_signature");

        try {
            paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
            return ResponseEntity.ok(new PaymentResponse("SUCCESS", "Payment verified successfully", razorpayOrderId, razorpayPaymentId, razorpaySignature));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new PaymentResponse("FAILED", e.getMessage()));
        }
    }

    /**
     * Get payment status for an order
     */
    @GetMapping("/status/{orderId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long orderId) {
        Map<String, Object> status = paymentService.getPaymentStatus(orderId);
        return ResponseEntity.ok(status);
    }

    /**
     * Get Razorpay key ID (for frontend initialization)
     */
    @GetMapping("/config")
    public ResponseEntity<?> getPaymentConfig() {
        return ResponseEntity.ok(Map.of(
            "razorpayKeyId", razorpayKeyId,
            "demoMode", demoMode
        ));
    }
}
