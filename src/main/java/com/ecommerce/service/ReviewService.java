package com.ecommerce.service;

import com.ecommerce.dto.ReviewRequest;
import com.ecommerce.dto.ReviewResponse;
import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    public void addReview(User user, ReviewRequest request) {

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        reviewRepository.findByUser_UserIdAndProduct_ProductId(user.getUserId(), product.getProductId())
                .ifPresent(r -> { throw new RuntimeException("Already reviewed"); });

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());

        reviewRepository.save(review);
    }

    public List<ReviewResponse> getReviews(Long productId) {
        return reviewRepository.findByProduct_ProductId(productId)
                .stream()
                .map(r -> {
                    ReviewResponse resp = new ReviewResponse();
                    resp.setUserEmail(r.getUser().getEmail());
                    resp.setRating(r.getRating());
                    resp.setComment(r.getComment());
                    return resp;
                }).collect(Collectors.toList());
    }

    public double getAverageRating(Long productId) {
        List<Review> reviews = reviewRepository.findByProduct_ProductId(productId);
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }
}
