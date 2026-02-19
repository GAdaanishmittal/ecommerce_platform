package com.ecommerce.controller;

import com.ecommerce.dto.OrderResponse;
import com.ecommerce.model.OrderStatus;
import com.ecommerce.model.User;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService,
                           UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(Authentication auth) {
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(orderService.placeOrder(user));
    }

    // USER: order history
    @GetMapping("/my")
    public ResponseEntity<java.util.List<OrderResponse>> myOrders(Authentication auth) {
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(orderService.getOrdersForUser(user));
    }

    // GET order by ID
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId, Authentication auth) {
        // In a real app, we should check if the order belongs to the user or if they are ADMIN
        // For this console, we'll allow it if they are authenticated
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    // ADMIN: view all orders
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<java.util.List<OrderResponse>> allOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // ADMIN: update status
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable Long orderId,
                                                     @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(orderId, status));
    }
}
