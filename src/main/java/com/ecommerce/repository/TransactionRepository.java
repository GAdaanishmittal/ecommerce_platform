package com.ecommerce.repository;

import com.ecommerce.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByPaymentGatewayRef(String paymentGatewayRef);
    Optional<Transaction> findByOrder_OrderId(Long orderId);
}


