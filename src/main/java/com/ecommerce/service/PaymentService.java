package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.OrderStatus;
import com.ecommerce.model.Transaction;
import com.ecommerce.repository.OrderItemRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.TransactionRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Value("${payment.demo.mode:false}")
    private boolean demoMode;

    private RazorpayClient razorpayClient;

    private final OrderRepository orderRepository;
    private final TransactionRepository transactionRepository;
    private final OrderItemRepository orderItemRepository; // Inject OrderItemRepository

    public PaymentService(OrderRepository orderRepository,
                          TransactionRepository transactionRepository,
                          OrderItemRepository orderItemRepository) { // Inject OrderItemRepository
        this.orderRepository = orderRepository;
        this.transactionRepository = transactionRepository;
        this.orderItemRepository = orderItemRepository; // Initialize
    }

    @PostConstruct
    public void init() {
        if (!demoMode) {
            try {
                if (razorpayKeyId == null || razorpayKeyId.isEmpty() ||
                    razorpayKeySecret == null || razorpayKeySecret.isEmpty()) {
                    throw new RuntimeException("Razorpay credentials not configured. Set razorpay.key.id and razorpay.key.secret in application.properties or use demo mode");
                }
                this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            } catch (RazorpayException e) {
                throw new RuntimeException("Failed to initialize RazorpayClient: " + e.getMessage(), e);
            }
        }
    }

    public String pay(Long orderId, String paymentMode) {
        if (demoMode) {
            return demoPayment(orderId);
        } else {
            return createRazorpayOrder(orderId);
        }
    }

    private String createRazorpayOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"PENDING".equals(order.getPaymentStatus())) {
            throw new RuntimeException("Order already paid or payment failed");
        }

        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", order.getTotalAmount().multiply(new BigDecimal("100")).intValue());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", order.getOrderId().toString());
            orderRequest.put("payment_capture", 1);

            // Construct notes for Razorpay transaction
            JSONObject notes = new JSONObject();
            notes.put("order_id", order.getOrderId());
            notes.put("total_amount", order.getTotalAmount()); // Adding total amount to notes

            List<OrderItem> orderItems = orderItemRepository.findByOrder_OrderId(order.getOrderId());
            org.json.JSONArray itemsArray = new org.json.JSONArray();
            for (OrderItem item : orderItems) {
                // Modified to create a human-readable string for each item
                String itemDetails = String.format("%s (Qty: %d, Price: %.2f, Subtotal: %.2f)",
                                                    item.getProduct().getProductName(),
                                                    item.getQty(),
                                                    item.getPriceAtPurchase(),
                                                    item.getSubtotal());
                itemsArray.put(itemDetails);
            }
            notes.put("items", itemsArray);

            orderRequest.put("notes", notes); // Add notes to the order request

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            String razorpayOrderId = razorpayOrder.get("id");
            order.setRazorpayOrderId(razorpayOrderId);
            orderRepository.save(order);

            return razorpayOrderId;

        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create Razorpay order", e);
        }
    }

    public void verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        Order order = orderRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Order not found with razorpay_order_id: " + razorpayOrderId));

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            boolean isValid = com.razorpay.Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (isValid) {
                order.setPaymentStatus("SUCCESS");
                order.setStatus(OrderStatus.CONFIRMED);
                orderRepository.save(order);

                // Create transaction with complete details and timestamp
                Transaction transaction = new Transaction();
                transaction.setOrder(order);
                transaction.setUser(order.getUser());
                transaction.setPaymentGatewayRef(razorpayPaymentId);
                transaction.setPaymentMode("Razorpay");
                transaction.setPaymentStatus("SUCCESS");
                transaction.setAmount(order.getTotalAmount().doubleValue());
                transaction.setTransactionDate(LocalDateTime.now()); // Transaction timestamp with date and time
                transaction = transactionRepository.save(transaction);

                order.setTransaction(transaction);
                orderRepository.save(order);
            } else {
                order.setPaymentStatus("FAILED");
                orderRepository.save(order);
                throw new RuntimeException("Payment verification failed: Invalid signature from Razorpay");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify payment: " + e.getMessage(), e);
        }
    }

    private String demoPayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"PENDING".equals(order.getPaymentStatus())) {
            throw new RuntimeException("Order already paid or payment failed");
        }

        order.setPaymentStatus("SUCCESS");
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        // Create transaction with complete details and timestamp for demo mode
        Transaction transaction = new Transaction();
        transaction.setOrder(order);
        transaction.setUser(order.getUser());
        transaction.setPaymentGatewayRef("DEMO_TRANSACTION_" + orderId);
        transaction.setPaymentMode("DEMO");
        transaction.setPaymentStatus("SUCCESS");
        transaction.setAmount(order.getTotalAmount().doubleValue());
        transaction.setTransactionDate(LocalDateTime.now()); // Transaction timestamp with date and time
        transaction = transactionRepository.save(transaction);

        order.setTransaction(transaction);
        orderRepository.save(order);

        return "demo_payment_success";
    }

    public Map<String, Object> getPaymentStatus(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Map<String, Object> status = new HashMap<>();
        status.put("orderId", order.getOrderId());
        status.put("paymentStatus", order.getPaymentStatus());
        status.put("orderStatus", order.getStatus());
        status.put("razorpayOrderId", order.getRazorpayOrderId());
        status.put("totalAmount", order.getTotalAmount());

        return status;
    }

    public boolean isDemoMode() {
        return demoMode;
    }
}
