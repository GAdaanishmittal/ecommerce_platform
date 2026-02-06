package com.ecommerce.dto;

public class ProductResponse {

    private Long productId;
    private String productName;
    private String productDescription;
    private String sku;
    private String picture;
    private double basePrice;
    private int stockQty;
    private Long categoryId;
    private String categoryName;

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

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

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
}
