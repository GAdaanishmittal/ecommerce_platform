package com.ecommerce.service;

import com.ecommerce.dto.CartItemRequest;
import com.ecommerce.dto.CartItemResponse;
import com.ecommerce.dto.CartResponse;
import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public CartResponse addToCart(Long userId, CartItemRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseGet(() -> {
                    Cart c = new Cart();
                    c.setUser(user);
                    c.setCreatedAt(LocalDateTime.now());
                    c.setUpdatedAt(LocalDateTime.now());
                    return cartRepository.save(c);
                });

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<CartItem> items = cartItemRepository.findByCart_CartId(cart.getCartId());

        CartItem existingItem = items.stream()
                .filter(i -> i.getProduct().getProductId().equals(product.getProductId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQty(existingItem.getQty() + request.getQty());
            cartItemRepository.save(existingItem);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQty(request.getQty());
            item.setPriceAtAdd(product.getBasePrice());
            cartItemRepository.save(item);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);

        return getCart(userId);
    }

    public CartResponse getCart(Long userId) {

        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> items = cartItemRepository.findByCart_CartId(cart.getCartId());

        List<CartItemResponse> itemResponses = items.stream().map(item -> {
            CartItemResponse resp = new CartItemResponse();
            resp.setProductId(item.getProduct().getProductId());
            resp.setProductName(item.getProduct().getProductName());
            resp.setQty(item.getQty());
            resp.setPriceAtAdd(item.getPriceAtAdd());
            resp.setSubtotal(item.getQty() * item.getPriceAtAdd());
            return resp;
        }).collect(Collectors.toList());

        double total = itemResponses.stream()
                .mapToDouble(CartItemResponse::getSubtotal)
                .sum();

        CartResponse response = new CartResponse();
        response.setCartId(cart.getCartId());
        response.setItems(itemResponses);
        response.setTotalAmount(total);

        return response;
    }

    public void removeItem(Long userId, Long productId) {
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> items = cartItemRepository.findByCart_CartId(cart.getCartId());

        CartItem item = items.stream()
                .filter(i -> i.getProduct().getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found"));

        cartItemRepository.delete(item);
    }

    public void clearCart(Long userId) {
        cartRepository.findByUser_UserId(userId).ifPresent(cart -> {
            cartItemRepository.deleteAll(cartItemRepository.findByCart_CartId(cart.getCartId()));
            // Optionally, delete the cart itself if it should not exist when empty
            // cartRepository.delete(cart);
        });
    }
}
