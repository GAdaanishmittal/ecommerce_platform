package com.ecommerce.repository;

import com.ecommerce.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProduct_ProductId(Long productId);

    Optional<Review> findByUser_UserIdAndProduct_ProductId(Long userId, Long productId);
}
