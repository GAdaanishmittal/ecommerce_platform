package com.ecommerce.dto;

import jakarta.validation.constraints.*;

public class ProductRequest {

    @NotBlank
    private String productName;

    private String productDescription;

    @NotBlank
    private String sku;

    private String picture;

    @NotNull
    @Positive
    private double basePrice;

    @Min(0)
    private int stockQty;

    @NotNull
    private Long categoryId;

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductDescription() { return productDescription; }
    public void setProductDescription(String productDescription) { this.productDescription = productDescription; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }

    public double getBasePrice() { return basePrice; }
    public void setBasePrice(double basePrice) { this.basePrice = basePrice; }

    public int getStockQty() { return stockQty; }
    public void setStockQty(int stockQty) { this.stockQty = stockQty; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
}
