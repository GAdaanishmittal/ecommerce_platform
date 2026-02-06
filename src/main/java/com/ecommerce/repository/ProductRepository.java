package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory_CategoryId(Long categoryId);

    List<Product> findByProductNameContainingIgnoreCase(String keyword);

    @Query("""
        SELECT p FROM Product p
        WHERE (:keyword IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categoryId IS NULL OR p.category.categoryId = :categoryId)
        AND (:minPrice IS NULL OR p.basePrice >= :minPrice)
        AND (:maxPrice IS NULL OR p.basePrice <= :maxPrice)
    """)
    List<Product> filterProducts(@Param("keyword") String keyword,
                                 @Param("categoryId") Long categoryId,
                                 @Param("minPrice") Double minPrice,
                                 @Param("maxPrice") Double maxPrice);
}
