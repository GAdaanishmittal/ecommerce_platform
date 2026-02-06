package com.ecommerce.service;

import com.ecommerce.dto.CategoryRequest;
import com.ecommerce.dto.CategoryResponse;
import com.ecommerce.model.ProductCategory;
import com.ecommerce.repository.ProductCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final ProductCategoryRepository categoryRepository;

    public CategoryService(ProductCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        ProductCategory category = new ProductCategory();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setPicture(request.getPicture());

        ProductCategory saved = categoryRepository.save(category);
        return mapToResponse(saved);
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProductCategory getCategoryEntity(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    private CategoryResponse mapToResponse(ProductCategory category) {
        CategoryResponse response = new CategoryResponse();
        response.setCategoryId(category.getCategoryId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setPicture(category.getPicture());
        return response;
    }
}
