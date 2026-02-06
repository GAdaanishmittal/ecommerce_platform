package com.ecommerce.controller;

import com.ecommerce.dto.ReviewRequest;
import com.ecommerce.dto.ReviewResponse;
import com.ecommerce.model.User;
import com.ecommerce.service.ReviewService;
import com.ecommerce.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    public ReviewController(ReviewService reviewService,
                            UserService userService) {
        this.reviewService = reviewService;
        this.userService = userService;
    }

    // USER: add review
    @PostMapping
    public ResponseEntity<String> addReview(@Valid @RequestBody ReviewRequest request,
                                            Authentication auth) {
        User user = userService.getUserByEmail(auth.getName());
        reviewService.addReview(user, request);
        return ResponseEntity.ok("Review added");
    }

    // PUBLIC: view reviews
    @GetMapping("/{productId}")
    public ResponseEntity<List<ReviewResponse>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviews(productId));
    }
}
