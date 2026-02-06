package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.model.OrderStatus;
import com.ecommerce.model.Transaction;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    private final OrderRepository orderRepository;
    private final TransactionRepository transactionRepository;

    public PaymentService(OrderRepository orderRepository,
                          TransactionRepository transactionRepository) {
        this.orderRepository = orderRepository;
        this.transactionRepository = transactionRepository;
    }

    public String pay(Long orderId, String paymentMode) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"PENDING".equals(order.getPaymentStatus())) {
            throw new RuntimeException("Order already paid or payment failed");
        }

        // Simulate payment success
        boolean paymentSuccess = true; // you can randomize later

        if (!paymentSuccess) {
            throw new RuntimeException("Payment failed");
        }

        Transaction tx = new Transaction();
        tx.setUser(order.getUser());
        tx.setAmount(order.getTotalAmount());
        tx.setPaymentMode(paymentMode);
        tx.setPaymentStatus("SUCCESS");
        tx.setPaymentGatewayRef(UUID.randomUUID().toString());
        tx.setTransactionDate(LocalDateTime.now());

        tx = transactionRepository.save(tx);

        order.setTransaction(tx);
        order.setPaymentStatus("SUCCESS");  // Update payment status
        order.setStatus(OrderStatus.CONFIRMED);  // Update shipment status
        orderRepository.save(order);

        return "Payment successful";
    }
}
