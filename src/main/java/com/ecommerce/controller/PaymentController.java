package com.ecommerce.controller;

import com.ecommerce.dto.PaymentRequest;
import com.ecommerce.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<String> pay(@RequestBody PaymentRequest request) {
        return ResponseEntity.ok(
                paymentService.pay(request.getOrderId(), request.getPaymentMode())
        );
    }
}
