package com.ecommerce.service;

import com.ecommerce.dto.CartItemResponse;
import com.ecommerce.dto.OrderResponse;
import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.OrderStatus;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.model.Transaction; // Added import
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.OrderItemRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.TransactionRepository; // Added import
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal; // Added import for Order totalAmount
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository; // Injected

    public OrderService(CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        ProductRepository productRepository,
                        TransactionRepository transactionRepository) { // Injected
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.transactionRepository = transactionRepository; // Injected
    }

    @Transactional
    public OrderResponse placeOrder(User user) {
        Cart cart = cartRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCart_CartId(cart.getCartId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);  // Shipment status
        order.setPaymentStatus("PENDING");  // Payment status - initially pending
        order.setOrderDate(LocalDateTime.now());
        order.setShippingAddress(user.getAddress());
        // order = orderRepository.save(order); // Removed this save

        double total = 0; // Reverted to double

        for (CartItem ci : cartItems) {
            Product p = ci.getProduct();

            if (p.getStockQty() < ci.getQty()) {
                throw new RuntimeException("Out of stock: " + p.getProductName());
            }

            p.setStockQty(p.getStockQty() - ci.getQty());
            productRepository.save(p);

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(p);
            oi.setQty(ci.getQty());
            oi.setPriceAtPurchase(ci.getPriceAtAdd());
            oi.setSubtotal(ci.getQty() * ci.getPriceAtAdd()); // Reverted calculation to use double

            total += oi.getSubtotal(); // Reverted to double arithmetic
            orderItemRepository.save(oi);
        }

        order.setTotalAmount(BigDecimal.valueOf(total)); // Convert to BigDecimal for Order's totalAmount
        order = orderRepository.save(order); // Moved save here

        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setOrder(order); // Explicitly link order to transaction
        tx.setAmount(total); // total is now double, so this is correct
        tx.setPaymentMode("COD");
        tx.setPaymentStatus("SUCCESS");
        tx.setTransactionDate(LocalDateTime.now());
        tx = transactionRepository.save(tx);

        order.setTransaction(tx);
        orderRepository.save(order);

        // Clear cart
        cartItemRepository.deleteAll(cartItems);

        return mapToResponse(order);
    }

    public List<OrderResponse> getOrdersForUser(User user) {
        return orderRepository.findByUser_UserIdOrderByOrderIdDesc(user.getUserId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByOrderIdDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        return mapToResponse(order);
    }

    public OrderResponse updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        orderRepository.save(order);
        return mapToResponse(order);
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setTotalAmount(order.getTotalAmount().doubleValue());
        response.setStatus(order.getStatus().name());  // Shipment status
        response.setPaymentStatus(order.getPaymentStatus() != null ? order.getPaymentStatus() : "PENDING");  // Payment status
        response.setOrderDate(order.getOrderDate() != null ? order.getOrderDate() : java.time.LocalDateTime.now());
        if (order.getUser() != null) {
            response.setUserId(order.getUser().getUserId());
            response.setUserEmail(order.getUser().getEmail());
        }

        var txn = order.getTransaction();
        if (txn == null) {
            txn = transactionRepository.findByOrder_OrderId(order.getOrderId()).orElse(null);
        }

        if (txn != null) {
            response.setPaymentMode(txn.getPaymentMode());
            response.setTransactionRef(txn.getPaymentGatewayRef());
            response.setTransactionStatus(txn.getPaymentStatus());
            response.setTransactionId(txn.getTransactionId());
            response.setTransactionDate(txn.getTransactionDate());
        }

        try {
            // Safely retrieve order items using repository with fetch join
            List<OrderItem> orderItems = orderItemRepository.findByOrder_OrderId(order.getOrderId());
            List<CartItemResponse> items = new ArrayList<>();

            for (OrderItem item : orderItems) {
                CartItemResponse r = new CartItemResponse();
                r.setProductId(item.getProduct().getProductId());
                r.setProductName(item.getProduct().getProductName());
                r.setQty(item.getQty());
                r.setPriceAtAdd(item.getPriceAtPurchase());
                r.setSubtotal(item.getSubtotal());
                items.add(r);
            }

            response.setItems(items);

        } catch (Exception e) {
            // Set empty items list as fallback
            response.setItems(new ArrayList<>());
        }

        return response;
    }
}
