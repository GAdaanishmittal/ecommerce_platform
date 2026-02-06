package com.ecommerce.repository;

import com.ecommerce.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT oi FROM OrderItem oi JOIN FETCH oi.product WHERE oi.order.orderId = :orderId")
    List<OrderItem> findByOrder_OrderId(@Param("orderId") Long orderId);
}
