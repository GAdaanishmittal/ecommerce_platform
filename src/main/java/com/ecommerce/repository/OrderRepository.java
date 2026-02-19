package com.ecommerce.repository;

import com.ecommerce.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @org.springframework.data.jpa.repository.Query("SELECT o FROM Order o WHERE o.user.userId = :userId ORDER BY o.orderId DESC")
    List<Order> findByUser_UserIdOrderByOrderIdDesc(@org.springframework.data.repository.query.Param("userId") Long userId);

    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);

    @org.springframework.data.jpa.repository.Query("SELECT o FROM Order o ORDER BY o.orderId DESC")
    List<Order> findAllByOrderByOrderIdDesc();
}
