package com.ecommerce.controller;

import com.ecommerce.dto.CartItemRequest;
import com.ecommerce.dto.OrderResponse;
import com.ecommerce.model.User;
import com.ecommerce.service.CartService;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.PaymentService; // Import PaymentService
import com.ecommerce.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // Import Map for request body

@RestController
@RequestMapping("/api/demo")
public class DemoCheckoutController {

    private final CartService cartService;
    private final OrderService orderService;
    private final UserService userService;
    private final PaymentService paymentService; // Inject PaymentService

    // Hardcoded dummy user ID for demo purposes
    private static final Long DUMMY_USER_ID = 1L;

    public DemoCheckoutController(CartService cartService,
                                  OrderService orderService,
                                  UserService userService,
                                  PaymentService paymentService) { // Inject PaymentService
        this.cartService = cartService;
        this.orderService = orderService;
        this.userService = userService;
        this.paymentService = paymentService; // Initialize PaymentService
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> demoCheckout(@RequestBody List<CartItemRequest> cartItemRequests) {
        // Retrieve the dummy user
        // Ensure this user exists in your database or create one for demo
        User dummyUser = userService.getUserById(DUMMY_USER_ID);
        if (dummyUser == null) {
            throw new RuntimeException("Dummy user with ID " + DUMMY_USER_ID + " not found. Please ensure it exists.");
        }

        // Clear the dummy user's cart before adding new items
        // This ensures each demo checkout starts with a clean cart
        cartService.clearCart(DUMMY_USER_ID); // Assuming a clearCart method in CartService

        // Add items from the request to the dummy user's cart
        for (CartItemRequest itemRequest : cartItemRequests) {
            cartService.addToCart(DUMMY_USER_ID, itemRequest);
        }

        // Place the order using the existing OrderService logic
        OrderResponse orderResponse = orderService.placeOrder(dummyUser);

        return ResponseEntity.ok(orderResponse);
    }

    @PostMapping("/verifyPayment")
    public ResponseEntity<String> demoVerifyPayment(@RequestBody Map<String, String> verificationData) {
        String razorpayOrderId = verificationData.get("razorpayOrderId");
        String razorpayPaymentId = verificationData.get("razorpayPaymentId");
        String razorpaySignature = verificationData.get("razorpaySignature");

        if (razorpayOrderId == null || razorpayPaymentId == null || razorpaySignature == null) {
            return ResponseEntity.badRequest().body("Missing verification parameters.");
        }

        try {
            paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
            return ResponseEntity.ok("Payment verified successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Payment verification failed: " + e.getMessage());
        }
    }

    @GetMapping("/paymentStatus/{orderId}")
    public ResponseEntity<Map<String, Object>> getPaymentStatus(@PathVariable Long orderId) {
        try {
            Map<String, Object> status = paymentService.getPaymentStatus(orderId);
            return ResponseEntity.ok(status);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Or return an error message
        }
    }
}
