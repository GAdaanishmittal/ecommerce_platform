//package com.ecommerce;
//
//import com.ecommerce.model.Product;
//import com.ecommerce.model.ProductCategory;
//import com.ecommerce.repository.CartItemRepository;
//import com.ecommerce.repository.CartRepository;
//import com.ecommerce.repository.OrderItemRepository;
//import com.ecommerce.repository.OrderRepository;
//import com.ecommerce.repository.ProductCategoryRepository;
//import com.ecommerce.repository.ProductRepository;
//import com.ecommerce.repository.ReviewRepository;
//import com.ecommerce.repository.TransactionRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import java.util.Random;
//
//@Component
//public class DummyDataLoader implements CommandLineRunner {
//
//    private final CartItemRepository cartItemRepository;
//    private final CartRepository cartRepository;
//    private final OrderItemRepository orderItemRepository;
//    private final OrderRepository orderRepository;
//    private final ProductRepository productRepository;
//    private final ProductCategoryRepository categoryRepository;
//    private final ReviewRepository reviewRepository;
//    private final TransactionRepository transactionRepository;
//
//    public DummyDataLoader(CartItemRepository cartItemRepository,
//                           CartRepository cartRepository,
//                           OrderItemRepository orderItemRepository,
//                           OrderRepository orderRepository,
//                           ProductRepository productRepository,
//                           ProductCategoryRepository categoryRepository,
//                           ReviewRepository reviewRepository,
//                           TransactionRepository transactionRepository) {
//        this.cartItemRepository = cartItemRepository;
//        this.cartRepository = cartRepository;
//        this.orderItemRepository = orderItemRepository;
//        this.orderRepository = orderRepository;
//        this.productRepository = productRepository;
//        this.categoryRepository = categoryRepository;
//        this.reviewRepository = reviewRepository;
//        this.transactionRepository = transactionRepository;
//    }
//
//    @Override
//    public void run(String... args) {
//
//        // Delete all existing data respecting FK order
//        System.out.println("Deleting all existing data...");
//        cartItemRepository.deleteAllInBatch();
//        cartRepository.deleteAllInBatch();
//        orderItemRepository.deleteAllInBatch();
//        orderRepository.deleteAllInBatch();
//        transactionRepository.deleteAllInBatch();
//        reviewRepository.deleteAllInBatch();
//        productRepository.deleteAllInBatch();
//        categoryRepository.deleteAllInBatch();
//        System.out.println("All data deleted");
//
//        // Create Categories
//        ProductCategory electronics = new ProductCategory();
//        electronics.setName("Electronics");
//        electronics.setDescription("Electronic items & gadgets");
//        electronics.setPicture("electronics.png");
//
//        ProductCategory fashion = new ProductCategory();
//        fashion.setName("Fashion");
//        fashion.setDescription("Clothing & accessories");
//        fashion.setPicture("fashion.png");
//
//        ProductCategory home = new ProductCategory();
//        home.setName("Home & Kitchen");
//        home.setDescription("Home appliances & kitchen items");
//        home.setPicture("home.png");
//
//        ProductCategory books = new ProductCategory();
//        books.setName("Books");
//        books.setDescription("Books & stationery");
//        books.setPicture("books.png");
//
//        ProductCategory sports = new ProductCategory();
//        sports.setName("Sports");
//        sports.setDescription("Sports & fitness equipment");
//        sports.setPicture("sports.png");
//
//        electronics = categoryRepository.save(electronics);
//        fashion = categoryRepository.save(fashion);
//        home = categoryRepository.save(home);
//        books = categoryRepository.save(books);
//        sports = categoryRepository.save(sports);
//
//        ProductCategory[] categories = {electronics, fashion, home, books, sports};
//        Random random = new Random();
//
//        // Product names for variety
//        String[][] productNames = {
//            // Electronics
//            {"Smartphone", "Laptop", "Headphones", "Smart Watch", "Tablet", "Camera", "Bluetooth Speaker", "Gaming Console"},
//            // Fashion
//            {"T-Shirt", "Jeans", "Sneakers", "Jacket", "Dress", "Handbag", "Sunglasses", "Belt"},
//            // Home & Kitchen
//            {"Mixer Grinder", "Microwave", "Vacuum Cleaner", "Coffee Maker", "Air Purifier", "Toaster", "Iron", "Blender"},
//            // Books
//            {"Novel", "Cookbook", "Science Fiction", "Biography", "Self-Help Book", "Children's Book", "Notebook", "Pen Set"},
//            // Sports
//            {"Yoga Mat", "Dumbbells", "Cricket Bat", "Football", "Tennis Racket", "Gym Bag", "Running Shoes", "Resistance Bands"}
//        };
//
//        // Create 35 Products
//        int productCount = 35;
//        for (int i = 1; i <= productCount; i++) {
//            Product p = new Product();
//
//            int categoryIndex = random.nextInt(categories.length);
//            String[] names = productNames[categoryIndex];
//            String productName = names[random.nextInt(names.length)] + " " + (char)('A' + random.nextInt(5));
//
//            p.setProductName(productName);
//            p.setProductDescription("High quality " + productName.toLowerCase() + " with excellent features and durability");
//            p.setSku("SKU-" + String.format("%04d", i));
//            p.setPicture("product_" + i + ".png");
//            p.setBasePrice(500 + random.nextInt(49500));
//            p.setStockQty(1 + random.nextInt(100));
//            p.setCategory(categories[categoryIndex]);
//
//            productRepository.save(p);
//        }
//
//        System.out.println("Inserted " + productCount + " dummy products across " + categories.length + " categories");
//    }
//}
