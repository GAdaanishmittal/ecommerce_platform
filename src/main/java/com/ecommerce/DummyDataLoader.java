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
//import java.util.ArrayList;
//import java.util.List;
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
//    // Helper record to hold product seed data
//    private record ProductSeed(String name, String description, int minPrice, int maxPrice) {}
//
//    @Override
//    public void run(String... args) {
//
//        // ── 1. Delete all existing data (FK-safe order) ──────────────────────
//        System.out.println("Deleting all existing data...");
//        cartItemRepository.deleteAllInBatch();
//        cartRepository.deleteAllInBatch();
//        orderItemRepository.deleteAllInBatch();
//        orderRepository.deleteAllInBatch();
//        transactionRepository.deleteAllInBatch();
//        reviewRepository.deleteAllInBatch();
//        productRepository.deleteAllInBatch();
//        categoryRepository.deleteAllInBatch();
//        System.out.println("All existing data deleted.");
//
//        // ── 2. Create Categories ──────────────────────────────────────────────
//        record CategoryDef(String name, String description, String picture) {}
//
//        List<CategoryDef> categoryDefs = List.of(
//                new CategoryDef("Electronics",       "Electronic items & gadgets",              "electronics.png"),
//                new CategoryDef("Fashion",            "Clothing & accessories",                  "fashion.png"),
//                new CategoryDef("Home & Kitchen",     "Home appliances & kitchen essentials",    "home.png"),
//                new CategoryDef("Books",              "Books & stationery",                      "books.png"),
//                new CategoryDef("Sports & Fitness",   "Sports & fitness equipment",              "sports.png"),
//                new CategoryDef("Beauty & Personal",  "Beauty, grooming & personal care",        "beauty.png"),
//                new CategoryDef("Toys & Games",       "Toys, games & hobby items",               "toys.png"),
//                new CategoryDef("Automotive",         "Car & bike accessories",                  "automotive.png"),
//                new CategoryDef("Health & Wellness",  "Supplements, medical & wellness products","health.png"),
//                new CategoryDef("Grocery & Food",     "Packaged food, snacks & beverages",       "grocery.png"),
//                new CategoryDef("Office Supplies",    "Stationery, furniture & office gadgets",  "office.png"),
//                new CategoryDef("Pet Supplies",       "Food, toys & accessories for pets",       "pets.png")
//        );
//
//        List<ProductCategory> savedCategories = new ArrayList<>();
//        for (CategoryDef cd : categoryDefs) {
//            ProductCategory cat = new ProductCategory();
//            cat.setName(cd.name());
//            cat.setDescription(cd.description());
//            cat.setPicture(cd.picture());
//            savedCategories.add(categoryRepository.save(cat));
//        }
//        System.out.println("Inserted " + savedCategories.size() + " categories.");
//
//        // ── 3. Define Products per Category ──────────────────────────────────
//        // Each entry: (category index, name, description, minPrice, maxPrice)
//        record ProductEntry(int catIdx, ProductSeed seed, int stock) {}
//
//        List<ProductEntry> entries = new ArrayList<>();
//
//        // 0 – Electronics
//        int e = 0;
//        entries.add(new ProductEntry(e, new ProductSeed("Samsung Galaxy S24 Ultra",   "6.8\" QHD+ AMOLED, 200 MP camera, 5000 mAh battery",  55000, 99000), 40));
//        entries.add(new ProductEntry(e, new ProductSeed("Apple iPhone 15 Pro",         "A17 Pro chip, titanium design, USB-C, ProRes video",   80000, 134000), 30));
//        entries.add(new ProductEntry(e, new ProductSeed("OnePlus 12",                  "Snapdragon 8 Gen 3, Hasselblad cameras, 100W charging", 55000, 65000), 50));
//        entries.add(new ProductEntry(e, new ProductSeed("Dell XPS 15 Laptop",          "Core i9, 32 GB RAM, 1 TB SSD, OLED touch display",     120000, 165000), 15));
//        entries.add(new ProductEntry(e, new ProductSeed("MacBook Air M3",              "Apple M3 chip, 15.3\" Liquid Retina, 18-hr battery",   110000, 140000), 20));
//        entries.add(new ProductEntry(e, new ProductSeed("Asus ROG Strix Gaming Laptop","RTX 4070, i9, 165 Hz QHD display, per-key RGB",        130000, 180000), 12));
//        entries.add(new ProductEntry(e, new ProductSeed("Sony WH-1000XM5 Headphones", "Industry-leading ANC, 30-hr battery, LDAC support",     25000, 35000), 60));
//        entries.add(new ProductEntry(e, new ProductSeed("Apple AirPods Pro (2nd Gen)", "Active Noise Cancellation, Adaptive Transparency, H2",  22000, 26000), 80));
//        entries.add(new ProductEntry(e, new ProductSeed("Boat Rockerz 550 Headphones", "40-hr battery, 40 mm drivers, foldable design",         1500,  3000), 150));
//        entries.add(new ProductEntry(e, new ProductSeed("Samsung Galaxy Tab S9",        "11\" AMOLED, S Pen included, IP68 water resistant",    65000, 80000), 25));
//        entries.add(new ProductEntry(e, new ProductSeed("Apple iPad Pro 12.9\"",        "M2 chip, Liquid Retina XDR, Thunderbolt, WiFi 6E",    90000, 120000), 18));
//        entries.add(new ProductEntry(e, new ProductSeed("GoPro Hero 12 Black",          "5.3K video, HyperSmooth 6.0, waterproof to 10 m",     35000, 45000), 35));
//        entries.add(new ProductEntry(e, new ProductSeed("Canon EOS R50 Mirrorless",     "24.2 MP APS-C, 4K video, Dual Pixel AF, compact body", 55000, 70000), 22));
//        entries.add(new ProductEntry(e, new ProductSeed("Xiaomi Smart Band 8",          "1.62\" AMOLED, SpO2, 16-day battery, 150+ sports",      2500,  4000), 200));
//        entries.add(new ProductEntry(e, new ProductSeed("Apple Watch Series 9",         "S9 chip, Double Tap gesture, Always-On Retina display", 35000, 45000), 45));
//        entries.add(new ProductEntry(e, new ProductSeed("JBL Flip 6 Speaker",           "IP67, 12-hr battery, JBL PartyBoost, bold sound",       8000, 14000), 90));
//        entries.add(new ProductEntry(e, new ProductSeed("Amazon Echo Dot (5th Gen)",    "Improved audio, Alexa, built-in temperature sensor",    4000,  5500), 120));
//        entries.add(new ProductEntry(e, new ProductSeed("Sony PlayStation 5",           "4K gaming, ray tracing, ultra-high-speed SSD",         45000, 55000), 20));
//        entries.add(new ProductEntry(e, new ProductSeed("Xbox Series X",                "4K 120fps, 1 TB SSD, Quick Resume, Game Pass ready",   45000, 52000), 18));
//        entries.add(new ProductEntry(e, new ProductSeed("Logitech MX Master 3S Mouse", "8K DPI, MagSpeed scroll, silent clicks, multi-OS",      8000, 10000), 75));
//        entries.add(new ProductEntry(e, new ProductSeed("Samsung 27\" 4K Monitor",     "IPS, HDR600, 144 Hz, USB-C 90W PD, height-adjustable", 28000, 40000), 30));
//        entries.add(new ProductEntry(e, new ProductSeed("Anker 65W GaN Charger",        "3-port, compact, PowerIQ 4.0, foldable prongs",         2000,  3500), 200));
//        entries.add(new ProductEntry(e, new ProductSeed("Realme Buds Air 5 Pro",        "ANC 50 dB, 9.2 mm dynamic driver, LHDC 5.0",            3000,  5000), 180));
//
//        // 1 – Fashion
//        int f = 1;
//        entries.add(new ProductEntry(f, new ProductSeed("Levi's 511 Slim Fit Jeans",   "Stretch denim, mid-rise, versatile everyday wear",       2000,  4500), 100));
//        entries.add(new ProductEntry(f, new ProductSeed("Nike Air Force 1 Sneakers",    "Classic leather, cushioned sole, iconic profile",        6000,  9000), 80));
//        entries.add(new ProductEntry(f, new ProductSeed("Adidas Ultraboost 23",         "Boost midsole, Primeknit+ upper, Continental rubber",    9000, 15000), 60));
//        entries.add(new ProductEntry(f, new ProductSeed("H&M Oversized Hoodie",         "100% organic cotton, kangaroo pocket, unisex sizing",    1200,  2500), 150));
//        entries.add(new ProductEntry(f, new ProductSeed("Zara Structured Blazer",       "Slim fit, notch lapel, two-button, lined interior",      4000,  7000), 70));
//        entries.add(new ProductEntry(f, new ProductSeed("Ray-Ban Aviator Classic",      "Gold frame, G-15 glass lenses, UV protection",           8000, 14000), 50));
//        entries.add(new ProductEntry(f, new ProductSeed("Fossil Gen 6 Smartwatch",      "Wear OS, health tracking, 2-day battery",               15000, 22000), 40));
//        entries.add(new ProductEntry(f, new ProductSeed("Tommy Hilfiger Polo T-Shirt",  "Piqué cotton, embroidered logo, relaxed fit",            2500,  4000), 120));
//        entries.add(new ProductEntry(f, new ProductSeed("Puma Running Shorts",          "Lightweight, quick-dry fabric, zip pocket",               800,  1500), 200));
//        entries.add(new ProductEntry(f, new ProductSeed("Lavie Tote Handbag",           "Vegan leather, multiple compartments, magnetic snap",    2000,  4500), 90));
//        entries.add(new ProductEntry(f, new ProductSeed("Woodland Leather Boots",       "Full-grain leather, rubber lug sole, ankle height",      4000,  7000), 65));
//        entries.add(new ProductEntry(f, new ProductSeed("Van Heusen Formal Shirt",      "Slim fit, wrinkle-free cotton, spread collar",           1200,  2500), 110));
//        entries.add(new ProductEntry(f, new ProductSeed("Only Floral Midi Dress",       "Flowy chiffon, V-neck, adjustable waist tie",            1500,  3000), 95));
//        entries.add(new ProductEntry(f, new ProductSeed("Peter England Formal Trousers","Stretch waistband, crease-resistant, regular fit",       1800,  3200), 80));
//
//        // 2 – Home & Kitchen
//        int h = 2;
//        entries.add(new ProductEntry(h, new ProductSeed("Philips HL7756 Mixer Grinder","750 W, 3 jars, stainless steel blades, 5-yr warranty",    3000,  5000), 60));
//        entries.add(new ProductEntry(h, new ProductSeed("IFB 23 L Convection Microwave","360° turntable, 51 auto-cook menus, steam clean",         8000, 13000), 40));
//        entries.add(new ProductEntry(h, new ProductSeed("Dyson V15 Detect Vacuum",     "Laser dust detection, HEPA filtration, 60-min runtime",  35000, 48000), 20));
//        entries.add(new ProductEntry(h, new ProductSeed("Nescafé Dolce Gusto Coffee Machine","15-bar pump, hot & cold beverages, compact design",   6000,  9000), 55));
//        entries.add(new ProductEntry(h, new ProductSeed("Honeywell Air Purifier HAC35M2","HEPA+Carbon filter, 350 sq ft, air quality indicator",  12000, 18000), 30));
//        entries.add(new ProductEntry(h, new ProductSeed("Bajaj Pop-Up Toaster",         "800 W, 7 browning levels, auto-pop & cancel function",    1200,  2000), 120));
//        entries.add(new ProductEntry(h, new ProductSeed("Philips Dry Iron GC160",       "1000 W, non-stick soleplate, variable temperature",        700,  1400), 100));
//        entries.add(new ProductEntry(h, new ProductSeed("Prestige Induction Cooktop",   "1600 W, 8 power levels, push-button control, 2-yr warranty",2500, 4500), 75));
//        entries.add(new ProductEntry(h, new ProductSeed("Cello Plastic Storage Containers","Airtight, BPA-free, stackable, 12-piece set",            600,  1200), 200));
//        entries.add(new ProductEntry(h, new ProductSeed("Solimo 500 TC Cotton Bedsheet","King size, 100% cotton, 2 pillow covers, 20+ colours",    1200,  2500), 150));
//        entries.add(new ProductEntry(h, new ProductSeed("Pigeon Non-Stick Cookware Set","5-piece, induction-compatible, heat-resistant handles",   2500,  5000), 85));
//        entries.add(new ProductEntry(h, new ProductSeed("Orient 1200 mm Ceiling Fan",   "5-star rated, remote, anti-dust blade coating",           3000,  5500), 60));
//        entries.add(new ProductEntry(h, new ProductSeed("Philips Hue Smart Bulb (4-pack)","16M colours, voice & app control, A19 E27 base",         4000,  7000), 90));
//
//        // 3 – Books
//        int b = 3;
//        entries.add(new ProductEntry(b, new ProductSeed("Atomic Habits – James Clear",  "Build good habits, break bad ones, practical framework",    400,   650), 300));
//        entries.add(new ProductEntry(b, new ProductSeed("The Psychology of Money – Housel","Timeless lessons on wealth, greed & happiness",          400,   600), 280));
//        entries.add(new ProductEntry(b, new ProductSeed("Ikigai – Francesc Miralles",   "Japanese secret to a long & happy life",                    300,   500), 320));
//        entries.add(new ProductEntry(b, new ProductSeed("The Alchemist – Paulo Coelho", "Philosophical novel, journey of self-discovery",             300,   500), 350));
//        entries.add(new ProductEntry(b, new ProductSeed("Sapiens – Yuval Noah Harari",  "A brief history of humankind, 500 pages",                   500,   800), 260));
//        entries.add(new ProductEntry(b, new ProductSeed("Rich Dad Poor Dad – Kiyosaki", "Personal finance, investing mindset for beginners",          300,   500), 310));
//        entries.add(new ProductEntry(b, new ProductSeed("Zero to One – Peter Thiel",    "Notes on startups & how to build the future",               400,   650), 240));
//        entries.add(new ProductEntry(b, new ProductSeed("The Art of War – Sun Tzu",     "Ancient Chinese military treatise, strategy & tactics",      200,   400), 400));
//        entries.add(new ProductEntry(b, new ProductSeed("NCERT Physics Class 12 Set",   "Vol 1 & 2, latest edition, exam-ready",                      400,   700), 500));
//        entries.add(new ProductEntry(b, new ProductSeed("Navneet Notebook A4 Pack",     "200 pages, ruled, hard cover, pack of 6",                   300,   500), 600));
//        entries.add(new ProductEntry(b, new ProductSeed("Pilot G2 Gel Pen Set (12 pack)","Smooth refillable pens, 0.7 mm, assorted colours",         250,   450), 700));
//        entries.add(new ProductEntry(b, new ProductSeed("Harry Potter Box Set (7 books)","Complete series, illustrated cover edition",               2500,  4500), 180));
//
//        // 4 – Sports & Fitness
//        int s = 4;
//        entries.add(new ProductEntry(s, new ProductSeed("Boldfit Yoga Mat 6 mm",        "Non-slip, eco-TPE, carry strap, 183 × 61 cm",              800,  1500), 200));
//        entries.add(new ProductEntry(s, new ProductSeed("Kore Rubber Hex Dumbbells Set","Anti-roll, chrome handle, 5–30 kg pairs available",        3000,  8000), 80));
//        entries.add(new ProductEntry(s, new ProductSeed("SS Ton English Willow Bat",    "Grade 1 EW, 7 grains, full-size, with cover",             3500,  6000), 60));
//        entries.add(new ProductEntry(s, new ProductSeed("Nivia Dominator Football",     "PU cover, 32-panel, FIFA-approved size 5",                  700,  1400), 150));
//        entries.add(new ProductEntry(s, new ProductSeed("Yonex Astrox 99 Pro Badminton","High-modulus graphite, rotational generator system",      12000, 16000), 30));
//        entries.add(new ProductEntry(s, new ProductSeed("Skechers Go Walk 7 Shoes",     "GOga Mat insole, Air-Cooled memory foam, slip-on",         3500,  6000), 100));
//        entries.add(new ProductEntry(s, new ProductSeed("Decathlon Resistance Band Set","5 resistance levels, latex-free, door anchor included",     600,  1500), 250));
//        entries.add(new ProductEntry(s, new ProductSeed("Fitbit Charge 6",              "24/7 heart rate, SpO2, ECG, Google Maps on wrist",        15000, 20000), 50));
//        entries.add(new ProductEntry(s, new ProductSeed("Protein Whey Gold Standard 5lb","ON Gold Standard 100% Whey, 24 g protein per scoop",      4500,  7000), 120));
//        entries.add(new ProductEntry(s, new ProductSeed("Cosco Jump Rope Skipping",     "Ball-bearing handles, 3 m adjustable cable",                400,   900), 300));
//        entries.add(new ProductEntry(s, new ProductSeed("Adidas Gym Duffel Bag",        "40 L, ventilated shoe compartment, adjustable strap",      2000,  4000), 90));
//        entries.add(new ProductEntry(s, new ProductSeed("Lifelong Treadmill LLT09",     "3 HP, 0–16 km/h, 12 pre-set programs, LCD display",       18000, 28000), 15));
//
//        // 5 – Beauty & Personal Care
//        int bp = 5;
//        entries.add(new ProductEntry(bp, new ProductSeed("Lakme 9to5 Primer + Matte Lipstick","Long-stay, 45 shades, SPF 15",                     300,   600), 200));
//        entries.add(new ProductEntry(bp, new ProductSeed("Maybelline Fit Me Foundation", "Oil-free, 40 shades, natural matte finish",               500,   900), 180));
//        entries.add(new ProductEntry(bp, new ProductSeed("Forest Essentials Face Serum","Niacinamide 10%, hyaluronic acid, lightweight",           1500,  2800), 100));
//        entries.add(new ProductEntry(bp, new ProductSeed("Philips BT3231 Beard Trimmer", "Self-sharpening blades, 5-hr use, USB charge",           1800,  3000), 120));
//        entries.add(new ProductEntry(bp, new ProductSeed("Dyson Airwrap Styler",         "Multi-styler, curl, wave & dry without extreme heat",    35000, 45000), 20));
//        entries.add(new ProductEntry(bp, new ProductSeed("Biotique Bio Cucumber Toner",  "Alcohol-free, pore tightening, 120 ml",                   200,   400), 300));
//        entries.add(new ProductEntry(bp, new ProductSeed("L'Oreal Paris Total Repair 5 Shampoo","Anti-breakage, 5 problems 1 shampoo, 640 ml",      350,   600), 250));
//        entries.add(new ProductEntry(bp, new ProductSeed("WOW Skin Science Apple Cider Vinegar Shampoo","Sulphate-free, DHT blocker, 300 ml",       500,   800), 200));
//        entries.add(new ProductEntry(bp, new ProductSeed("Himalaya Neem Face Wash",      "Purifying, anti-bacterial, 150 ml",                       120,   250), 400));
//        entries.add(new ProductEntry(bp, new ProductSeed("Park Avenue Cologne Spray",    "Fresh fragrance, 150 ml, long-lasting",                   400,   700), 180));
//        entries.add(new ProductEntry(bp, new ProductSeed("Neutrogena SPF 50+ Sunscreen", "Lightweight, non-greasy, UVA/UVB broad spectrum, 88 ml", 500,   900), 220));
//
//        // 6 – Toys & Games
//        int t = 6;
//        entries.add(new ProductEntry(t, new ProductSeed("LEGO Classic Brick Box 1500 pcs","Creative building, ages 4+, colour-sorted bricks",      3500,  6000), 80));
//        entries.add(new ProductEntry(t, new ProductSeed("Funskool Monopoly India",       "Classic property trading board game, 2–8 players",        1200,  2000), 100));
//        entries.add(new ProductEntry(t, new ProductSeed("Hot Wheels 20-Car Gift Pack",   "1:64 scale, assorted models, collector-grade finish",       800,  1500), 120));
//        entries.add(new ProductEntry(t, new ProductSeed("Syma X300 Drone",               "Optical flow, 30-min flight, 1080p HD camera, foldable",  6000, 10000), 40));
//        entries.add(new ProductEntry(t, new ProductSeed("Rubik's Cube 3×3",              "Speed cube, smooth turning, vivid colour tiles",            300,   600), 300));
//        entries.add(new ProductEntry(t, new ProductSeed("Jenga Classic Game",            "54 wood blocks, build & pull, 6+ years",                   700,  1200), 150));
//        entries.add(new ProductEntry(t, new ProductSeed("Catan Board Game",              "Strategy, trading & settlement, 3–4 players, 60–120 min",  3500,  5000), 60));
//        entries.add(new ProductEntry(t, new ProductSeed("Remote Control Race Car 1:18",  "2.4 GHz, 30 km/h, rechargeable, off-road capable",        1500,  3000), 90));
//        entries.add(new ProductEntry(t, new ProductSeed("Play-Doh 24-Colour Set",        "Non-toxic, resealable cans, 3+ years",                      600,  1000), 200));
//        entries.add(new ProductEntry(t, new ProductSeed("Asus ROG Chakram PC Controller","3-mode wireless, swappable joystick module, RGB",          10000, 14000), 35));
//
//        // 7 – Automotive
//        int a = 7;
//        entries.add(new ProductEntry(a, new ProductSeed("Bosch Car Dash Camera",         "Full HD 1080p, WDR, loop recording, emergency lock",      4000,  8000), 60));
//        entries.add(new ProductEntry(a, new ProductSeed("3M Car Wax Protectant",         "Carnauba wax, UV protection, 300 ml spray",                500,   900), 200));
//        entries.add(new ProductEntry(a, new ProductSeed("Michelin Tyre Inflator DC12V",  "Digital display, auto-shutoff, 150 PSI max",              2500,  4500), 80));
//        entries.add(new ProductEntry(a, new ProductSeed("Voolex Car Seat Cover Set",     "Universal fit, PU leather, 11-piece, anti-slip base",     3500,  6500), 70));
//        entries.add(new ProductEntry(a, new ProductSeed("Amaron 12V 65Ah Car Battery",   "Silver Alloy tech, BH maintenance-free, 36-month warranty",4000,  6000), 30));
//        entries.add(new ProductEntry(a, new ProductSeed("Garmin Zumo XT2 GPS Navigator", "Motorcycle-specific, 6\", rugged, weather alerts",        35000, 45000), 15));
//        entries.add(new ProductEntry(a, new ProductSeed("VIOFO A129 Pro Duo Dashcam",    "Dual channel, 4K front + 1080p rear, CPL filter",         10000, 15000), 40));
//        entries.add(new ProductEntry(a, new ProductSeed("Qubo Smart Car Tyre Pressure Monitor","TPMS, real-time alerts, solar sensor, wireless",      2500,  4000), 90));
//
//        // 8 – Health & Wellness
//        int hw = 8;
//        entries.add(new ProductEntry(hw, new ProductSeed("Dr. Morepen Blood Pressure Monitor","Upper-arm, large cuff, memory for 120 readings, WHO indicator",1500,2800),100));
//        entries.add(new ProductEntry(hw, new ProductSeed("Omron HEA-230 Blood Glucose Monitor","Blood glucose meter, 50 test strips, no-coding",     2500,  4500), 80));
//        entries.add(new ProductEntry(hw, new ProductSeed("Wellbeing Nutrition Multivitamin","A-Z daily vitamins, plant-based, 60 capsules",           900,  1800), 200));
//        entries.add(new ProductEntry(hw, new ProductSeed("Himalaya Liv.52 DS 60 Tablets","Liver health, ayurvedic, double strength",                 250,   450), 400));
//        entries.add(new ProductEntry(hw, new ProductSeed("Medela Swing Maxi Breast Pump", "2-phase expression, hospital performance, portable",     10000, 15000), 25));
//        entries.add(new ProductEntry(hw, new ProductSeed("Beurer Infrared Thermometer",  "No-touch, 0.5 s reading, fever alarm, memory 32",         1200,  2500), 150));
//        entries.add(new ProductEntry(hw, new ProductSeed("Morpen Nebulizer Machine",     "Compressor type, particle size 0.5–10 µm, quiet motor",    2000,  4000), 70));
//        entries.add(new ProductEntry(hw, new ProductSeed("MuscleBlaze Creatine Monohydrate","100% pure, 250 g, unflavoured, 83 servings",             800,  1500), 180));
//        entries.add(new ProductEntry(hw, new ProductSeed("BOLDFIT Ab Roller Wheel",      "Anti-slip foam handles, dual wheel, knee mat included",     600,  1200), 220));
//
//        // 9 – Grocery & Food
//        int g = 9;
//        entries.add(new ProductEntry(g, new ProductSeed("Tata Gold Tea 1 kg",            "Strong CTC assam tea, bold colour & flavour",              400,   700), 500));
//        entries.add(new ProductEntry(g, new ProductSeed("Nescafé Classic Instant Coffee 200 g","100% pure coffee, rich aroma, resealable jar",       450,   750), 450));
//        entries.add(new ProductEntry(g, new ProductSeed("Organic India Tulsi Ginger Tea Bags","25 bags, caffeine-free, USDA organic certified",       250,   500), 400));
//        entries.add(new ProductEntry(g, new ProductSeed("Millet Amma Mixed Millet Pack 5 kg","Foxtail, Barnyard, Kodo, Pearl millets, unpolished",    800,  1500), 300));
//        entries.add(new ProductEntry(g, new ProductSeed("Lay's Variety Chips Pack 30-count","Assorted flavours, party pack, 26 g each",              700,  1200), 350));
//        entries.add(new ProductEntry(g, new ProductSeed("Cadbury Dairy Milk Slab 500 g", "Smooth milk chocolate, sharing size",                      500,   900), 250));
//        entries.add(new ProductEntry(g, new ProductSeed("Fortune Sunflower Oil 5 L",     "Refined sunflower oil, rich in Vitamin E",                 700,  1200), 400));
//        entries.add(new ProductEntry(g, new ProductSeed("Quaker Oats 2 kg",              "100% wholegrain, rolled oats, zero cholesterol",           400,   700), 350));
//        entries.add(new ProductEntry(g, new ProductSeed("Paper Boat Aamras 250 ml × 16","Traditional recipe, real mango pulp, no preservatives",    800,  1400), 200));
//        entries.add(new ProductEntry(g, new ProductSeed("Maggi 2-Minute Noodles 12-pack","Classic masala flavour, iron & calcium fortified",         300,   550), 600));
//
//        // 10 – Office Supplies
//        int o = 10;
//        entries.add(new ProductEntry(o, new ProductSeed("Nillkin Wireless Charging Pad 15W","Qi-certified, aluminium body, overcharge protection",   1200,  2500), 150));
//        entries.add(new ProductEntry(o, new ProductSeed("HP 805 Tri-colour Ink Cartridge","For DeskJet 1210/2300/2723, 100-page yield",               800,  1400), 200));
//        entries.add(new ProductEntry(o, new ProductSeed("Canon PIXMA G3000 Printer",     "All-in-one, Wi-Fi, ink tank, borderless photo printing",  12000, 18000), 25));
//        entries.add(new ProductEntry(o, new ProductSeed("Ergonomic Mesh Office Chair",   "Lumbar support, adjustable armrests, 150 kg capacity",    8000, 18000), 20));
//        entries.add(new ProductEntry(o, new ProductSeed("Staedtler Noris Pencils Box 24","HB, break-resistant, PEFC-certified wood",                  250,   450), 500));
//        entries.add(new ProductEntry(o, new ProductSeed("Leitz Complete Laptop Stand",   "15-level height adjust, premium aluminium, foldable",     3000,  5500), 60));
//        entries.add(new ProductEntry(o, new ProductSeed("Zebronics Zeb-Ultimate Pro Keyboard & Mouse","Wireless combo, 104 keys, 1600 DPI, USB nano", 1500,  3000), 100));
//        entries.add(new ProductEntry(o, new ProductSeed("Post-it Super Sticky Notes Variety Pack","70 sheets/pad, 12 pads, assorted neon & pastel",    600,  1000), 300));
//        entries.add(new ProductEntry(o, new ProductSeed("Bostitch Premium Stapler B8",   "70-sheet capacity, jam-free, steel construction",           500,   900), 120));
//        entries.add(new ProductEntry(o, new ProductSeed("Kensington Expert Mouse Trackball","4-button, scroll ring, wired, ambidextrous",            8000, 12000), 40));
//
//        // 11 – Pet Supplies
//        int pet = 11;
//        entries.add(new ProductEntry(pet, new ProductSeed("Royal Canin Medium Adult Dog Food 4 kg","Balanced nutrition, digestive health, 3–5 yr dogs",3000, 5000), 100));
//        entries.add(new ProductEntry(pet, new ProductSeed("Whiskas Adult Dry Cat Food 3 kg","Ocean fish flavour, taurine enriched, dental care kibble",1800, 3200), 120));
//        entries.add(new ProductEntry(pet, new ProductSeed("Himalaya Erina Dog Shampoo 450 ml","Tick & flea control, neem & rosemary, pH balanced",   350,   700), 200));
//        entries.add(new ProductEntry(pet, new ProductSeed("Trixie Pet Carrier Bag M",    "Top & front opening, ventilated mesh, airline-approved",  2500,  5000), 50));
//        entries.add(new ProductEntry(pet, new ProductSeed("PetSafe Auto Water Fountain", "2.5 L, carbon filter, quiet pump, dishwasher-safe tray",  2000,  4000), 60));
//        entries.add(new ProductEntry(pet, new ProductSeed("Kong Classic Dog Toy Large",  "Natural rubber, treat-stuffable, vet recommended",         700,  1400), 150));
//        entries.add(new ProductEntry(pet, new ProductSeed("Drools Absolute Calcium Bone Treats","Real chicken coated, 900 g, dental chew",            600,  1100), 180));
//        entries.add(new ProductEntry(pet, new ProductSeed("Ferplast Bird Cage OPERA 902","Large budgerigar cage, dometop, plastic seed catcher",    3500,  6000), 30));
//
//        // ── 4. Persist Products ───────────────────────────────────────────────
//        int skuCounter = 1;
//        for (ProductEntry entry : entries) {
//            Product p = new Product();
//            p.setProductName(entry.seed().name());
//            p.setProductDescription(entry.seed().description());
//            p.setSku("SKU-" + String.format("%04d", skuCounter++));
//            p.setPicture("product_" + (skuCounter - 1) + ".png");
//            // Set a mid-range price between min and max
//            int price = (entry.seed().minPrice() + entry.seed().maxPrice()) / 2;
//            p.setBasePrice(price);
//            p.setStockQty(entry.stock());
//            p.setCategory(savedCategories.get(entry.catIdx()));
//            productRepository.save(p);
//        }
//
//        System.out.println("Inserted " + entries.size() + " products across "
//                + savedCategories.size() + " categories.");
//    }
//}