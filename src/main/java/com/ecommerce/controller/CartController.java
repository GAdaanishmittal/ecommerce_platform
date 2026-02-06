package com.ecommerce.controller;

import com.ecommerce.dto.CartItemRequest;
import com.ecommerce.dto.CartResponse;
import com.ecommerce.service.CartService;
import com.ecommerce.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    public CartController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(@Valid @RequestBody CartItemRequest request,
                                                  Authentication auth) {
        String email = auth.getName();
        var user = userService.getUserByEmail(email);
        Long userId = user.getUserId();
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication auth) {
        String email = auth.getName();
        var user = userService.getUserByEmail(email);
        Long userId = user.getUserId();
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<String> remove(@PathVariable Long productId,
                                         Authentication auth) {
        String email = auth.getName();
        var user = userService.getUserByEmail(email);
        Long userId = user.getUserId();
        cartService.removeItem(userId, productId);
        return ResponseEntity.ok("Item removed");
    }
}
