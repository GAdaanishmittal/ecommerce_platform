package com.ecommerce.dto;

public class CategoryResponse {

    private Long categoryId;
    private String name;
    private String description;
    private String picture;

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }
}
