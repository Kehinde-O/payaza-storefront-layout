/**
 * Feature Flags System:
 *
 * Use `pageFeatures` to enable/disable specific pages based on business type:
 *
 * - `teamPage`: For businesses that showcase their team (wellness, spa, medical, etc.)
 * - `portfolioPage`: For creative businesses (makeup, photography, design, etc.)
 * - `servicesPage`: For booking/service-based stores
 * - `aboutPage`: For "About Us" page
 * - `helpCenterPage`: For customer support
 * - `shippingReturnsPage`: For e-commerce stores
 * - `trackOrderPage`: For order tracking
 *
 * Navigation items in `navigation.main` should match enabled pages.
 * Routing will automatically respect these flags and return 404 for disabled pages.
 */
export const mockStores = [
    // 1. Food Ordering Store (Standard)
    {
        id: '1',
        slug: 'savory-bites',
        name: 'Savory Bites',
        description: 'Delicious food delivered to your door. Fresh ingredients, authentic flavors.',
        type: 'food',
        layout: 'food',
        branding: {
            primaryColor: '#FF6B35',
            secondaryColor: '#F7931E',
            accentColor: '#FFD23F',
            logo: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop&q=80',
            theme: 'light',
            socialMedia: {
                facebook: 'https://facebook.com/savorybites',
                twitter: 'https://twitter.com/savorybites',
                instagram: 'https://instagram.com/savorybites',
            },
        },
        navigation: {
            main: [
                { label: 'Menu', href: '/menu' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
            ],
            footer: [
                {
                    title: 'Menu',
                    links: [
                        { label: 'All Items', href: '/menu' },
                        { label: 'Specials', href: '/menu/specials' },
                        { label: 'Desserts', href: '/menu/desserts' },
                    ],
                },
                {
                    title: 'Company',
                    links: [
                        { label: 'About Us', href: '/about' },
                        { label: 'Contact', href: '/contact' },
                        { label: 'Careers', href: '/careers' },
                    ],
                },
            ],
        },
        categories: [
            { id: 'cat1', name: 'Appetizers', slug: 'appetizers', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&q=80' },
            { id: 'cat2', name: 'Main Courses', slug: 'main-courses', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&q=80' },
            { id: 'cat3', name: 'Desserts', slug: 'desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop&q=80' },
            { id: 'cat4', name: 'Beverages', slug: 'beverages', image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=600&h=400&fit=crop&q=80' },
            { id: 'cat5', name: 'Specials', slug: 'specials', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80' },
        ],
        menuItems: [
            {
                id: 'item1',
                name: 'Classic Burger',
                description: 'Juicy beef patty with fresh lettuce, tomato, and special sauce',
                price: 12.99,
                categoryId: 'cat2',
                inStock: true,
                customizable: true,
                dietaryInfo: [],
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&q=80',
            },
            {
                id: 'item2',
                name: 'Caesar Salad',
                description: 'Fresh romaine lettuce with parmesan, croutons, and caesar dressing',
                price: 9.99,
                categoryId: 'cat1',
                inStock: true,
                dietaryInfo: ['vegetarian'],
                image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&q=80',
            },
            {
                id: 'item3',
                name: 'Grilled Salmon',
                description: 'Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables',
                price: 18.99,
                categoryId: 'cat2',
                inStock: true,
                customizable: true,
                dietaryInfo: [],
                image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop&q=80',
            },
        ],
        features: {
            cart: true,
            wishlist: false,
            reviews: true,
            search: true,
            filters: true,
            booking: false,
            delivery: true,
        },
        settings: {
            currency: 'USD',
            taxRate: 0.08,
            shippingEnabled: true,
            minOrderAmount: 15,
            freeShippingThreshold: 30,
        },
        payment: {
            payazaPublicKey: process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY || '',
            enabled: true,
        },
        layoutConfig: {
            hero: {
                show: true,
                showCTA: true,
                showSecondaryCTA: true,
                autoPlay: true,
                showBadges: true,
            },
            features: {
                show: true,
                showIcons: true,
            },
            sections: {
                categories: { show: true, limit: 6 },
                featuredProducts: { show: true, title: "Chef's Specials", showRatings: true },
                marketing: { show: true, showPromoBanner: false, showNewsletter: true },
                testimonials: { show: true },
                process: { show: true },
                brands: { show: false },
            },
            pages: {
                about: {
                    title: "Our Culinary Journey",
                    heroImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=600&fit=crop&q=80",
                    content: "Welcome to Savory Bites, where passion meets the plate. Established in 2010, we have been serving the community with authentic flavors and fresh ingredients. Our mission is to provide a memorable dining experience that brings people together.",
                    missionStatement: "To deliver happiness through food, one bite at a time.",
                    gallerySection: [
                        { image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80", caption: "Signature Dish" },
                        { image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", caption: "Our Kitchen" },
                        { image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", caption: "Fresh Ingredients" },
                    ],
                },
            },
        },
    },
    // 2. Clothing Store (Standard)
    {
        id: '2',
        slug: 'fashion-hub',
        name: 'Fashion Hub',
        description: 'Trendy clothing for every season. Style meets comfort.',
        type: 'clothing',
        layout: 'clothing',
        branding: {
            primaryColor: '#EC4899',
            secondaryColor: '#FBCFE8',
            theme: 'light',
            socialMedia: {
                facebook: 'https://facebook.com/fashionhub',
                instagram: 'https://instagram.com/fashionhub',
                pinterest: 'https://pinterest.com/fashionhub',
            },
        },
        navigation: {
            main: [
                { label: 'New Arrivals', href: '/products' },
                { label: 'Men', href: '/categories/men' },
                { label: 'Women', href: '/categories/women' },
                { label: 'Sale', href: '/products' },
            ],
            footer: [],
        },
        categories: [
            { id: 'cat1', name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&h=800&fit=crop&q=80' },
            { id: 'cat2', name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=600&h=800&fit=crop&q=80' },
        ],
        products: [
            {
                id: 'p1',
                name: 'Classic Denim Jacket',
                slug: 'classic-denim-jacket',
                description: 'Timeless denim jacket with a modern fit.',
                price: 89.99,
                images: [
                    'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80',
                    'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80'
                ],
                categoryId: 'cat1',
                inStock: true,
                rating: 4.8,
                reviewCount: 45,
                specifications: {
                    Brand: 'Levi\'s',
                    Material: '100% Cotton Denim',
                    Fit: 'Regular Fit'
                },
                reviews: [
                    {
                        id: 'r1',
                        userId: 'u1',
                        userName: 'Michael Chen',
                        userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop',
                        rating: 5,
                        title: 'Absolutely love the fit!',
                        comment: 'I was hesitant about ordering online, but the fit is perfect. The denim feels high quality and durable. Highly recommend!',
                        date: '2023-11-15',
                        verified: true,
                        helpful: 12,
                        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop']
                    },
                    {
                        id: 'r2',
                        userId: 'u2',
                        userName: 'Sarah Jones',
                        rating: 4,
                        title: 'Great jacket, slightly loose buttons',
                        comment: 'The jacket looks amazing. My only complaint is that one button felt a bit loose, but it was an easy fix. Otherwise, solid purchase.',
                        date: '2023-10-22',
                        verified: true,
                        helpful: 5,
                    },
                    {
                        id: 'r3',
                        userId: 'u3',
                        userName: 'David Smith',
                        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
                        rating: 5,
                        title: 'Classic look',
                        comment: 'Exactly what I was looking for. A classic denim jacket that goes with everything. Shipping was fast too.',
                        date: '2023-09-05',
                        verified: true,
                        helpful: 8,
                    }
                ],
            },
            {
                id: 'p2',
                name: 'Floral Summer Dress',
                slug: 'floral-summer-dress',
                description: 'Lightweight and breezy dress perfect for summer days.',
                price: 59.99,
                images: [
                    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
                    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80'
                ],
                categoryId: 'cat2',
                inStock: true,
                rating: 4.9,
                reviewCount: 120,
                specifications: {
                    Brand: 'Zara',
                    Material: 'Polyester Blend',
                    Style: 'A-Line'
                },
            },
            {
                id: 'p3',
                name: 'Urban Street Hoodie',
                slug: 'urban-street-hoodie',
                description: 'Comfortable oversized hoodie for daily wear.',
                price: 75.00,
                compareAtPrice: 95.00,
                images: [
                    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
                    'https://images.unsplash.com/photo-1556821833-836c8c550f76?w=800&q=80'
                ],
                categoryId: 'cat1',
                inStock: true,
                rating: 4.7,
                specifications: {
                    Brand: 'Nike',
                    Material: 'Cotton Blend',
                    Fit: 'Oversized'
                },
            },
            {
                id: 'p4',
                name: 'Elegant Silk Blouse',
                slug: 'elegant-silk-blouse',
                description: 'Sophisticated silk blouse for formal occasions.',
                price: 120.00,
                images: [
                    'https://images.unsplash.com/photo-1604176354204-9268737828c4?w=800&q=80',
                    'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80'
                ],
                categoryId: 'cat2',
                inStock: true,
                rating: 4.6,
                specifications: {
                    Brand: 'Calvin Klein',
                    Material: '100% Silk',
                    Style: 'Classic'
                },
            },
            {
                id: 'p5',
                name: 'Vintage Leather Belt',
                slug: 'vintage-leather-belt',
                description: 'Genuine leather belt with antique finish.',
                price: 45.00,
                images: [
                    'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80'
                ],
                categoryId: 'cat1',
                inStock: true,
                rating: 4.8,
                specifications: {
                    Brand: 'Tommy Hilfiger',
                    Material: 'Genuine Leather',
                    Style: 'Vintage'
                },
            },
            {
                id: 'p6',
                name: 'Bohemian Maxi Skirt',
                slug: 'bohemian-maxi-skirt',
                description: 'Flowy maxi skirt with intricate patterns.',
                price: 65.00,
                images: [
                    'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80'
                ],
                categoryId: 'cat2',
                inStock: true,
                rating: 4.5,
                specifications: {
                    Brand: 'H&M',
                    Material: 'Cotton Blend',
                    Style: 'Bohemian'
                },
            },
            {
                id: 'p7',
                name: 'Urban Streetwear Set',
                slug: 'urban-streetwear-set',
                description: 'Premium urban streetwear featuring modern design and comfortable fit. Perfect for casual outings and street style.',
                price: 145.00,
                images: [
                    'https://www.shopbcode.com/cdn/shop/files/ca519c6eb00363b58254f8ffd7aa2547.jpg?v=1759740234&width=5000',
                    'https://www.shopbcode.com/cdn/shop/files/c841daeaed65b2f3b2d766d213662efd.jpg?v=1759740231&width=5000',
                    'https://www.shopbcode.com/cdn/shop/files/70b3a8f91bc6f8fc171522f4b986e52e.jpg?v=1759740233&width=5000',
                    'https://www.shopbcode.com/cdn/shop/files/31452d36eb7e92db1b714d91409ede4b.jpg?v=1759740238&width=5000'
                ],
                categoryId: 'cat1',
                inStock: true,
                rating: 4.9,
                reviewCount: 24,
                specifications: {
                    Brand: 'Adidas',
                    Material: 'Polyester Blend',
                    Style: 'Streetwear'
                },
                reviews: [
                    {
                        id: 'r_urb1',
                        userId: 'u_urb1',
                        userName: 'Alex Johnson',
                        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop',
                        rating: 5,
                        title: 'Incredible quality!',
                        comment: 'The material is so thick and premium. It feels way more expensive than it is. The fit is the perfect oversized look I wanted.',
                        date: '2024-01-10',
                        verified: true,
                        helpful: 24,
                        images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&h=400&fit=crop']
                    },
                    {
                        id: 'r_urb2',
                        userId: 'u_urb2',
                        userName: 'Marcus Williams',
                        rating: 5,
                        title: 'My new favorite set',
                        comment: 'I wear this everywhere. It’s super comfortable and stylish. Definitely buying another color.',
                        date: '2023-12-28',
                        verified: true,
                        helpful: 15,
                    },
                    {
                        id: 'r_urb3',
                        userId: 'u_urb3',
                        userName: 'Emily Davis',
                        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
                        rating: 4.5,
                        title: 'Love it, but size down',
                        comment: 'The quality is top notch. It runs a bit large though, so I would suggest sizing down if you don’t want it too baggy.',
                        date: '2023-12-15',
                        verified: true,
                        helpful: 32,
                    }
                ],
            }
        ],
        features: {
            cart: true,
            wishlist: true,
            reviews: true,
            search: true,
            filters: true,
            booking: false,
            delivery: true,
        },
        settings: {
            currency: 'USD',
            shippingEnabled: true,
        },
        payment: {
            payazaPublicKey: process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY || '',
            enabled: true,
        },
        layoutConfig: {
            hero: {
                show: true,
                showCTA: true,
                showSecondaryCTA: false, // Hidden for this store
                autoPlay: false,
            },
            features: {
                show: true, // Benefits strip
            },
            sections: {
                categories: { show: true, limit: 3 },
                featuredProducts: { show: true, title: "New Season Arrivals" },
                marketing: { show: true, showNewsletter: true }, // Lookbook enabled
                testimonials: { show: false },
            },
            pages: {
                about: {
                    title: "Style & Substance",
                    content: "Fashion Hub was born from a desire to create clothing that looks good and feels even better. We believe in sustainable fashion and ethical production practices.",
                    missionStatement: "Empowering individuals through style.",
                },
            },
        },
    },
    // 3. Booking Store (Standard) - Refurbished for Makeup Business
    {
        id: '3',
        slug: 'urban-retreat',
        name: 'Urban Glam',
        description: 'Enhance your natural beauty with our professional makeup artistry.',
        type: 'booking',
        layout: 'booking',
        branding: {
            primaryColor: '#E11D48', // Rose 600
            secondaryColor: '#FFE4E6', // Rose 100
            theme: 'light',
            socialMedia: {
                instagram: 'https://instagram.com/urbanglam',
                facebook: 'https://facebook.com/urbanglam',
            },
        },
        navigation: {
            main: [
                { label: 'Services', href: '/services' },
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'Book Now', href: '/book' },
            ],
            footer: [],
        },
        categories: [
            { id: 'cat1', name: 'Bridal', slug: 'bridal', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80' },
            { id: 'cat2', name: 'Special Occasion', slug: 'special-occasion', image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&q=80' },
            { id: 'cat3', name: 'Editorial', slug: 'editorial', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80' },
        ],
        services: [
            {
                id: 's1',
                name: 'Bridal Makeup',
                slug: 'bridal-makeup',
                description: 'Complete bridal look including trial run, lashes, and touch-up kit. Long-lasting and photogenic.',
                price: 250,
                duration: 120,
                categoryId: 'cat1',
                image: 'https://images.unsplash.com/photo-1618998584360-10a0c28eec0f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmlnZXJpYW4lMjBicmlkYWwlMjBtYWtldXAlMjBwaWN0dXJlfGVufDB8fDB8fHww',
            },
            {
                id: 's2',
                name: 'Evening Glam',
                slug: 'evening-glam',
                description: 'Full glam look for red carpet, galas, or special nights out. Includes contouring and lashes.',
                price: 120,
                duration: 60,
                categoryId: 'cat2',
                image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80',
            },
            {
                id: 's3',
                name: 'Natural Glow',
                slug: 'natural-glow',
                description: 'Soft, radiant "no-makeup" makeup look enhancing your best features. Perfect for daytime events.',
                price: 85,
                duration: 45,
                categoryId: 'cat2',
                image: 'https://loveweddingsng.com/wp-content/uploads/2015/01/Nigerian-White-Wedding-Makeup-Yalliz-Beauty-LoveweddingsNG.jpg',
            },
            {
                id: 's4',
                name: '1-on-1 Lesson',
                slug: 'makeup-lesson',
                description: '90-minute private lesson teaching you techniques for your face shape and personal style.',
                price: 150,
                duration: 90,
                categoryId: 'cat3',
                image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80',
            },
            {
                id: 's5',
                name: 'Editorial / Photoshoot',
                slug: 'editorial-shoot',
                description: 'Creative and high-definition makeup for fashion shoots, portfolios, or commercial projects.',
                price: 180,
                duration: 90,
                categoryId: 'cat3',
                image: 'https://images.unsplash.com/photo-1503236823255-94308829887f?w=800&q=80',
            }
        ],
        features: {
            cart: false,
            wishlist: false,
            reviews: true,
            search: false,
            filters: false,
            booking: true,
            delivery: false,
        },
        pageFeatures: {
            portfolioPage: true, // Makeup businesses show portfolio
            teamPage: false, // Not using team page
            servicesPage: true, // Services page enabled
            aboutPage: false, // Can be enabled if needed
        },
        settings: {
            currency: 'USD',
        },
        payment: {
            payazaPublicKey: process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY || '',
            enabled: true,
        },
        layoutConfig: {
            hero: {
                show: true,
                showCTA: true,
                showSecondaryCTA: true,
            },
            sections: {
                categories: { show: true }, // Featured Services
                featuredProducts: { show: false }, // Not relevant
                testimonials: { show: true },
                team: { show: true },
                marketing: { show: false },
            },
            pages: {
                portfolio: {
                    title: "Our Work",
                    description: "A showcase of our finest makeup artistry.",
                    projects: [
                        { title: "Summer Bride", description: "Radiant and long-lasting bridal look.", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80", category: "Bridal" },
                        { title: "Vogue Editorial", description: "High fashion avant-garde style.", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80", category: "Editorial" },
                    ],
                },
                services: {
                    title: "Our Services",
                    description: "Professional makeup services tailored to your needs.",
                },
            },
        },
    },
    // 4. Food Ordering Store (Modern)
    {
        id: '5',
        slug: 'modern-eats',
        name: 'Modern Eats',
        description: 'Experience the future of dining. Elegant, immersive, and delicious.',
        type: 'food-modern',
        layout: 'food-modern',
        branding: {
            primaryColor: '#FF6B35',
            secondaryColor: '#F7931E',
            accentColor: '#FFD23F',
            theme: 'dark',
            socialMedia: {
                instagram: 'https://instagram.com/moderneats',
                facebook: 'https://facebook.com/moderneats',
                twitter: 'https://twitter.com/moderneats',
            },
        },
        navigation: {
            main: [
                { label: 'Menu', href: '/menu' },
                { label: 'Reservations', href: '/reservations' },
                { label: 'About', href: '/about' },
            ],
            footer: [
                {
                    title: 'Menu',
                    links: [
                        { label: 'Dinner', href: '/menu/dinner' },
                        { label: 'Lunch', href: '/menu/lunch' },
                        { label: 'Drinks', href: '/menu/drinks' },
                    ],
                },
            ],
        },
        categories: [
            { id: 'cat1', name: 'Starters', slug: 'starters', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&q=80' },
            { id: 'cat2', name: 'Mains', slug: 'mains', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&q=80' },
            { id: 'cat3', name: 'Desserts', slug: 'desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop&q=80' },
        ],
        menuItems: [
            {
                id: 'item1',
                name: 'Truffle Burger',
                description: 'Wagyu beef patty with black truffle sauce and brie cheese',
                price: 24.99,
                categoryId: 'cat2',
                inStock: true,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&q=80',
            },
            {
                id: 'item2',
                name: 'Seared Scallops',
                description: 'Pan-seared scallops with cauliflower puree',
                price: 18.99,
                categoryId: 'cat1',
                inStock: true,
                image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&q=80',
            },
        ],
        features: {
            cart: true,
            wishlist: false,
            reviews: true,
            search: true,
            filters: false,
            booking: true,
            delivery: true,
        },
        settings: {
            currency: 'USD',
            minOrderAmount: 20,
        },
        payment: {
            payazaPublicKey: process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY || '',
            enabled: true,
        },
    },
    // 6. Clothing Store (Minimal)
    {
        id: '6',
        slug: 'minimal-style',
        name: 'Minimal Style',
        description: 'Essentials for the modern wardrobe. Clean lines, premium materials.',
        type: 'clothing-minimal',
        layout: 'clothing-minimal',
        branding: {
            primaryColor: '#000000',
            secondaryColor: '#FFFFFF',
            theme: 'light',
            socialMedia: {
                instagram: 'https://instagram.com/minimalstyle',
                pinterest: 'https://pinterest.com/minimalstyle',
                twitter: 'https://twitter.com/minimalstyle',
            },
        },
        navigation: {
            main: [
                { label: 'Collection', href: '/collection' },
                { label: 'About', href: '/about' },
            ],
            footer: [
                {
                    title: 'Shop',
                    links: [
                        { label: 'All', href: '/all' },
                        { label: 'New', href: '/new' },
                    ],
                },
            ],
        },
        categories: [
            { id: 'cat1', name: 'Tops', slug: 'tops', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=80' },
            { id: 'cat2', name: 'Bottoms', slug: 'bottoms', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=80' },
            { id: 'cat3', name: 'Outerwear', slug: 'outerwear', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop&q=80' },
        ],
        products: [
            {
                id: 'prod1',
                name: 'Essential Tee',
                slug: 'essential-tee',
                description: 'Premium cotton t-shirt',
                price: 45.00,
                images: [
                    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'
                ],
                categoryId: 'cat1',
                inStock: true,
                specifications: {
                    Brand: 'Gap',
                    Material: '100% Organic Cotton',
                    Fit: 'Regular'
                },
                variants: [
                    { id: 'vt1', name: 'Size', value: 'XS' },
                    { id: 'vt2', name: 'Size', value: 'S' },
                    { id: 'vt3', name: 'Size', value: 'M' },
                    { id: 'vt4', name: 'Size', value: 'L' },
                    { id: 'vt5', name: 'Size', value: 'XL' },
                    { id: 'vt6', name: 'Color', value: 'Black' },
                    { id: 'vt7', name: 'Color', value: 'White' },
                    { id: 'vt8', name: 'Color', value: 'Gray' },
                ],
            },
            {
                id: 'prod2',
                name: 'Linen Trousers',
                slug: 'linen-trousers',
                description: 'Relaxed fit linen trousers',
                price: 120.00,
                images: [
                    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80'
                ],
                categoryId: 'cat2',
                inStock: true,
                specifications: {
                    Brand: 'Uniqlo',
                    Material: '100% Linen',
                    Fit: 'Relaxed'
                },
                variants: [
                    { id: 'v1', name: 'Size', value: 'S' },
                    { id: 'v2', name: 'Size', value: 'M' },
                    { id: 'v3', name: 'Size', value: 'L' },
                    { id: 'v4', name: 'Size', value: 'XL' },
                    { id: 'v5', name: 'Color', value: 'Beige' },
                    { id: 'v6', name: 'Color', value: 'White' },
                    { id: 'v7', name: 'Color', value: 'Navy' },
                ],
            },
            {
                id: 'prod3',
                name: 'Wool Blend Coat',
                slug: 'wool-blend-coat',
                description: 'Classic wool blend coat for winter warmth.',
                price: 299.00,
                images: [
                    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
                    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'
                ],
                categoryId: 'cat3',
                inStock: true,
                specifications: {
                    Brand: 'Theory',
                    Material: 'Wool Blend',
                    Fit: 'Overcoat'
                },
                variants: [
                    { id: 'vc1', name: 'Size', value: 'S' },
                    { id: 'vc2', name: 'Size', value: 'M' },
                    { id: 'vc3', name: 'Size', value: 'L' },
                    { id: 'vc4', name: 'Color', value: 'Camel' },
                    { id: 'vc5', name: 'Color', value: 'Black' },
                ],
            },
            {
                id: 'prod4',
                name: 'Cashmere Sweater',
                slug: 'cashmere-sweater',
                description: 'Luxuriously soft cashmere sweater.',
                price: 150.00,
                images: [
                    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
                    'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=800&q=80'
                ],
                categoryId: 'cat1',
                inStock: true,
                specifications: {
                    Brand: 'Everlane',
                    Material: '100% Cashmere',
                    Fit: 'Relaxed'
                },
                variants: [
                    { id: 'vs1', name: 'Size', value: 'S' },
                    { id: 'vs2', name: 'Size', value: 'M' },
                    { id: 'vs3', name: 'Size', value: 'L' },
                    { id: 'vs4', name: 'Color', value: 'Grey' },
                    { id: 'vs5', name: 'Color', value: 'Navy' },
                ],
            },
        ],
        features: {
            cart: true,
            wishlist: true,
            reviews: false,
            search: true,
            filters: true,
            booking: false,
            delivery: true,
        },
        settings: {
            currency: 'USD',
            shippingEnabled: true,
        },
        payment: {
            payazaPublicKey: process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY || '',
            enabled: true,
        },
    },
    // 7. Booking Store (Agenda)
    {
        id: '7',
        slug: 'agenda-book',
        name: 'Agenda Book',
        description: 'Professional booking made simple. Schedule your appointments with ease.',
        type: 'booking-agenda',
        layout: 'booking-agenda',
        branding: {
            primaryColor: '#4F46E5',
            theme: 'light',
            socialMedia: {
                facebook: 'https://facebook.com/agendabook',
                instagram: 'https://instagram.com/agendabook',
            },
        },
        navigation: {
            main: [],
            footer: [],
        },
        categories: [
            { id: 'cat1', name: 'Consultation', slug: 'consultation', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop&q=80' },
            { id: 'cat2', name: 'Coaching', slug: 'coaching', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80' },
            { id: 'cat3', name: 'Workshop', slug: 'workshop', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&q=80' },
        ],
        services: [
            {
                id: 'svc1',
                name: 'Strategy Session',
                slug: 'strategy-session',
                description: '1-hour business strategy consultation to help you achieve your goals',
                price: 200,
                duration: 60,
                categoryId: 'cat1',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&q=80',
                provider: {
                    id: 'p1',
                    name: 'Alex Morgan',
                    rating: 5.0,
                },
                availability: [{ day: 'Monday', slots: ['09:00', '10:00', '14:00'] }, { day: 'Wednesday', slots: ['09:00', '10:00'] }],
            },
            {
                id: 'svc2',
                name: 'Career Coaching',
                slug: 'career-coaching',
                description: 'Personalized career development and guidance session',
                price: 150,
                duration: 45,
                categoryId: 'cat2',
                image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80',
                provider: {
                    id: 'p2',
                    name: 'Sarah Mitchell',
                    rating: 4.9,
                },
                availability: [{ day: 'Tuesday', slots: ['10:00', '11:00', '15:00'] }, { day: 'Thursday', slots: ['10:00', '11:00'] }],
            },
            {
                id: 'svc3',
                name: 'Business Planning Workshop',
                slug: 'business-planning-workshop',
                description: 'Comprehensive 2-hour workshop on creating effective business plans',
                price: 300,
                duration: 120,
                categoryId: 'cat3',
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&q=80',
                provider: {
                    id: 'p3',
                    name: 'Michael Chen',
                    rating: 5.0,
                },
                availability: [{ day: 'Friday', slots: ['09:00', '13:00'] }],
            },
            {
                id: 'svc4',
                name: 'Financial Consultation',
                slug: 'financial-consultation',
                description: 'Expert financial advice and planning for your business',
                price: 250,
                duration: 90,
                categoryId: 'cat1',
                image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&q=80',
                provider: {
                    id: 'p4',
                    name: 'David Kim',
                    rating: 4.8,
                },
                availability: [{ day: 'Monday', slots: ['11:00', '14:00'] }, { day: 'Wednesday', slots: ['11:00', '14:00'] }],
            },
            {
                id: 'svc5',
                name: 'Leadership Development',
                slug: 'leadership-development',
                description: 'Enhance your leadership skills with personalized coaching',
                price: 180,
                duration: 60,
                categoryId: 'cat2',
                image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop&q=80',
                provider: {
                    id: 'p1',
                    name: 'Alex Morgan',
                    rating: 5.0,
                },
                availability: [{ day: 'Tuesday', slots: ['09:00', '13:00'] }, { day: 'Thursday', slots: ['09:00', '13:00'] }],
            },
        ],
        features: {
            cart: false,
            wishlist: false,
            reviews: true,
            search: true,
            filters: true,
            booking: true,
            delivery: false,
        },
        settings: {
            currency: 'USD',
        },
        payment: {
            payazaPublicKey: process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY || '',
            enabled: true,
        },
    },
    // 8. Electronics Store (Grid) - Nigeria I-Store
    {
        id: '8',
        slug: 'grid-tech',
        name: 'Nigeria I-Store',
        description: 'Premium Apple products. Authentic. Authorized. Exclusive to Nigeria.',
        type: 'electronics-grid',
        layout: 'electronics-grid',
        branding: {
            primaryColor: '#000000',
            secondaryColor: '#1D1D1F',
            accentColor: '#0071E3',
            theme: 'light',
            socialMedia: {
                facebook: 'https://facebook.com/nigeriaistore',
                twitter: 'https://twitter.com/nigeriaistore',
                instagram: 'https://instagram.com/nigeriaistore',
            },
        },
        navigation: {
            main: [],
            footer: [],
        },
        categories: [
            { id: 'cat1', name: 'iPhone', slug: 'iphone', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80' },
            { id: 'cat2', name: 'Mac', slug: 'mac', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80' },
            { id: 'cat3', name: 'iPad', slug: 'ipad', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80' },
            { id: 'cat4', name: 'Apple Watch', slug: 'apple-watch', image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80' },
            { id: 'cat5', name: 'AirPods', slug: 'airpods', image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80' },
            { id: 'cat6', name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80' },
            { id: 'cat7', name: 'HomePod', slug: 'homepod', image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&q=80' },
            { id: 'cat8', name: 'Apple TV', slug: 'apple-tv', image: 'https://images.unsplash.com/photo-1558002038-1091a575039f?w=800&q=80' },
        ],
        products: [
            {
                id: 'prod1',
                name: 'iPhone 15 Pro Max',
                slug: 'iphone-15-pro-max',
                description: 'Titanium design. A17 Pro chip. Action button. Pro camera system.',
                price: 1199.00,
                compareAtPrice: 1299.00,
                images: [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat1',
                inStock: true,
                rating: 4.9,
                reviewCount: 2847,
                specifications: {
                    Brand: 'Apple',
                    Storage: '256GB',
                    Display: '6.7" Super Retina XDR',
                    Chip: 'A17 Pro',
                    Camera: '48MP Main Camera'
                },
            },
            {
                id: 'prod2',
                name: 'MacBook Pro 16"',
                slug: 'macbook-pro-16',
                description: 'M3 Pro chip. 16-core GPU. 18-hour battery. Liquid Retina XDR display.',
                price: 2499.00,
                images: [
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat2',
                inStock: true,
                rating: 4.9,
                reviewCount: 1247,
                specifications: {
                    Brand: 'Apple',
                    Chip: 'M3 Pro',
                    RAM: '18GB',
                    Storage: '512GB SSD',
                    Display: '16.2" Liquid Retina XDR'
                },
            },
            {
                id: 'prod3',
                name: 'AirPods Pro (2nd generation)',
                slug: 'airpods-pro-2nd-gen',
                description: 'Active Noise Cancellation. Spatial Audio. MagSafe Charging Case.',
                price: 249.00,
                compareAtPrice: 279.00,
                images: [
                    'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1572569028738-7a16d8bd1020?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat5',
                inStock: true,
                rating: 4.8,
                reviewCount: 3421,
                specifications: {
                    Brand: 'Apple',
                    Type: 'In-Ear',
                    NoiseCancellation: 'Active',
                    Battery: 'Up to 6 hours'
                },
            },
            {
                id: 'prod4',
                name: 'iPhone 15 Pro',
                slug: 'iphone-15-pro',
                description: 'Titanium design. A17 Pro chip. Action button. Pro camera system.',
                price: 999.00,
                images: [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat1',
                inStock: true,
                rating: 4.9,
                reviewCount: 2156,
                specifications: {
                    Brand: 'Apple',
                    Storage: '256GB',
                    Display: '6.1" Super Retina XDR',
                    Chip: 'A17 Pro',
                    Camera: '48MP Main Camera'
                },
            },
            {
                id: 'prod5',
                name: 'Magic Keyboard',
                slug: 'magic-keyboard',
                description: 'Wireless keyboard with scissor mechanism. Rechargeable battery.',
                price: 149.00,
                images: [
                    'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat6',
                inStock: true,
                rating: 4.7,
                reviewCount: 892,
                specifications: {
                    Brand: 'Apple',
                    Connectivity: 'Bluetooth',
                    Battery: 'Rechargeable',
                    Layout: 'Full-size'
                },
            },
            {
                id: 'prod6',
                name: 'Magic Mouse',
                slug: 'magic-mouse',
                description: 'Wireless mouse with Multi-Touch surface. Rechargeable battery.',
                price: 79.00,
                compareAtPrice: 99.00,
                images: [
                    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1615663245857-acda5b2a666e?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat6',
                inStock: true,
                rating: 4.6,
                reviewCount: 1245,
                specifications: {
                    Brand: 'Apple',
                    Connectivity: 'Bluetooth',
                    Battery: 'Rechargeable',
                    Surface: 'Multi-Touch'
                },
            },
            {
                id: 'prod7',
                name: 'MacBook Pro 14"',
                slug: 'macbook-pro-14',
                description: 'M3 chip. 11-core GPU. 18-hour battery. Liquid Retina XDR display.',
                price: 1599.00,
                images: [
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat2',
                inStock: true,
                rating: 4.9,
                reviewCount: 1892,
                specifications: {
                    Brand: 'Apple',
                    Chip: 'M3',
                    RAM: '8GB',
                    Storage: '512GB SSD',
                    Display: '14.2" Liquid Retina XDR'
                },
            },
            {
                id: 'prod8',
                name: 'Apple Watch Series 9',
                slug: 'apple-watch-series-9',
                description: 'S9 SiP. Always-On Retina display. Advanced health features.',
                price: 399.00,
                images: [
                    'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat4',
                inStock: true,
                rating: 4.8,
                reviewCount: 3421,
                specifications: {
                    Brand: 'Apple',
                    Size: '45mm',
                    Chip: 'S9 SiP',
                    Connectivity: 'Bluetooth & Wi-Fi'
                },
            },
            {
                id: 'prod9',
                name: 'iPad Pro 12.9"',
                slug: 'ipad-pro-12-9',
                description: 'M2 chip. 12.9" Liquid Retina XDR display. Apple Pencil compatible.',
                price: 1099.00,
                compareAtPrice: 1199.00,
                images: [
                    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1589739900266-43b91e6a78d3?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat3',
                inStock: true,
                rating: 4.9,
                reviewCount: 2156,
                specifications: {
                    Brand: 'Apple',
                    Chip: 'M2',
                    Storage: '256GB',
                    Display: '12.9" Liquid Retina XDR'
                },
            },
            {
                id: 'prod10',
                name: 'AirPods (3rd generation)',
                slug: 'airpods-3rd-gen',
                description: 'Spatial Audio. Adaptive EQ. MagSafe Charging Case.',
                price: 179.00,
                images: [
                    'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat5',
                inStock: true,
                rating: 4.7,
                reviewCount: 2847,
                specifications: {
                    Brand: 'Apple',
                    Battery: 'Up to 6 hours',
                    Connectivity: 'Bluetooth 5.3',
                    Audio: 'Spatial Audio'
                },
            },
            {
                id: 'prod11',
                name: 'iPad Pro 11"',
                slug: 'ipad-pro-11',
                description: 'M2 chip. 11" Liquid Retina display. Apple Pencil compatible.',
                price: 799.00,
                images: [
                    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1589739900266-43b91e6a78d3?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat3',
                inStock: true,
                rating: 4.8,
                reviewCount: 1892,
                specifications: {
                    Brand: 'Apple',
                    Chip: 'M2',
                    Storage: '128GB',
                    Display: '11" Liquid Retina'
                },
            },
            {
                id: 'prod12',
                name: 'AirTag (4-Pack)',
                slug: 'airtag-4-pack',
                description: 'Keep track of your belongings. Precision Finding. Privacy built in.',
                price: 99.00,
                compareAtPrice: 119.00,
                images: [
                    'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat6',
                inStock: true,
                rating: 4.6,
                reviewCount: 3421,
                specifications: {
                    Brand: 'Apple',
                    Connectivity: 'Bluetooth & U1',
                    Battery: 'User-replaceable',
                    Range: 'Find My network'
                },
            },
            {
                id: 'prod13',
                name: 'HomePod mini',
                slug: 'homepod-mini',
                description: '360° audio. Siri. Smart home hub. Privacy built in.',
                price: 99.00,
                images: [
                    'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1543512214-318c77a077d2?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat7',
                inStock: true,
                rating: 4.7,
                reviewCount: 2156,
                specifications: {
                    Brand: 'Apple',
                    Audio: '360° audio',
                    Assistant: 'Siri',
                    Connectivity: 'Wi-Fi & Bluetooth'
                },
            },
            {
                id: 'prod14',
                name: 'iPhone 15',
                slug: 'iphone-15',
                description: 'Dynamic Island. A16 Bionic chip. Advanced camera system.',
                price: 799.00,
                images: [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat1',
                inStock: true,
                rating: 4.8,
                reviewCount: 3421,
                specifications: {
                    Brand: 'Apple',
                    Storage: '128GB',
                    Display: '6.1" Super Retina XDR',
                    Chip: 'A16 Bionic',
                    Camera: '48MP Main Camera'
                },
            },
            {
                id: 'prod15',
                name: 'MacBook Air 15"',
                slug: 'macbook-air-15',
                description: 'M3 chip. 15.3" Liquid Retina display. All-day battery life.',
                price: 1299.00,
                compareAtPrice: 1399.00,
                images: [
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat2',
                inStock: true,
                rating: 4.9,
                reviewCount: 2847,
                specifications: {
                    Brand: 'Apple',
                    Chip: 'M3',
                    RAM: '8GB',
                    Storage: '256GB SSD',
                    Display: '15.3" Liquid Retina'
                },
            },
            {
                id: 'prod16',
                name: 'MagSafe Charger',
                slug: 'magsafe-charger',
                description: 'Wireless charging for iPhone. Perfect alignment every time.',
                price: 39.00,
                images: [
                    'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat6',
                inStock: true,
                rating: 4.5,
                reviewCount: 1892,
                specifications: {
                    Brand: 'Apple',
                    Power: '15W',
                    Connectivity: 'USB-C',
                    Compatibility: 'iPhone 12 and later'
                },
            },
            {
                id: 'prod17',
                name: 'AirPods Max',
                slug: 'airpods-max',
                description: 'Active Noise Cancellation. Spatial Audio. Premium design.',
                price: 549.00,
                images: [
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat5',
                inStock: true,
                rating: 4.8,
                reviewCount: 1247,
                specifications: {
                    Brand: 'Apple',
                    Type: 'Over-Ear',
                    NoiseCancellation: 'Active',
                    Battery: 'Up to 20 hours'
                },
            },
            {
                id: 'prod18',
                name: 'Apple Watch Ultra 2',
                slug: 'apple-watch-ultra-2',
                description: 'S9 SiP. 49mm titanium case. Action button. Up to 36 hours battery.',
                price: 799.00,
                images: [
                    'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat4',
                inStock: true,
                rating: 4.9,
                reviewCount: 892,
                specifications: {
                    Brand: 'Apple',
                    Size: '49mm',
                    Chip: 'S9 SiP',
                    Battery: 'Up to 36 hours'
                },
            },
            {
                id: 'prod19',
                name: 'iPad Air',
                slug: 'ipad-air',
                description: 'M2 chip. 10.9" Liquid Retina display. Apple Pencil compatible.',
                price: 599.00,
                compareAtPrice: 649.00,
                images: [
                    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1589739900266-43b91e6a78d3?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat3',
                inStock: true,
                rating: 4.8,
                reviewCount: 2156,
                specifications: {
                    Brand: 'Apple',
                    Chip: 'M2',
                    Storage: '64GB',
                    Display: '10.9" Liquid Retina'
                },
            },
            {
                id: 'prod20',
                name: 'MacBook Air 13"',
                slug: 'macbook-air-13',
                description: 'M3 chip. 13.6" Liquid Retina display. All-day battery life.',
                price: 1099.00,
                images: [
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat2',
                inStock: true,
                rating: 4.9,
                reviewCount: 3421,
                specifications: {
                    Brand: 'Apple',
                    Chip: 'M3',
                    RAM: '8GB',
                    Storage: '256GB SSD',
                    Display: '13.6" Liquid Retina'
                },
            },
            {
                id: 'prod21',
                name: 'Apple Watch SE',
                slug: 'apple-watch-se',
                description: 'S8 SiP. Essential features. Affordable price.',
                price: 249.00,
                images: [
                    'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat4',
                inStock: true,
                rating: 4.7,
                reviewCount: 1892,
                specifications: {
                    Brand: 'Apple',
                    Size: '44mm',
                    Chip: 'S8 SiP',
                    Battery: 'Up to 18 hours'
                },
            },
            {
                id: 'prod22',
                name: 'iPhone 14 Pro',
                slug: 'iphone-14-pro',
                description: 'A16 Bionic chip. Pro camera system. Dynamic Island.',
                price: 899.00,
                images: [
                    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat1',
                inStock: true,
                rating: 4.8,
                reviewCount: 2847,
                specifications: {
                    Brand: 'Apple',
                    Storage: '128GB',
                    Display: '6.1" Super Retina XDR',
                    Chip: 'A16 Bionic',
                    Camera: '48MP Main Camera'
                },
            },
            {
                id: 'prod23',
                name: 'iPad mini',
                slug: 'ipad-mini',
                description: 'A15 Bionic chip. 8.3" Liquid Retina display. Apple Pencil compatible.',
                price: 499.00,
                images: [
                    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1589739900266-43b91e6a78d3?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat3',
                inStock: true,
                rating: 4.7,
                reviewCount: 1247,
                specifications: {
                    Brand: 'Apple',
                    Chip: 'A15 Bionic',
                    Storage: '64GB',
                    Display: '8.3" Liquid Retina'
                },
            },
            {
                id: 'prod24',
                name: 'Apple TV 4K',
                slug: 'apple-tv-4k',
                description: 'A15 Bionic chip. 4K HDR. Siri Remote. HomeKit hub.',
                price: 149.00,
                images: [
                    'https://images.unsplash.com/photo-1558002038-1091a575039f?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1567365601292-e9324d081662?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat8',
                inStock: true,
                rating: 4.6,
                reviewCount: 892,
                specifications: {
                    Brand: 'Apple',
                    Chip: 'A15 Bionic',
                    Resolution: '4K HDR',
                    Storage: '128GB'
                },
            },
        ],
        features: {
            cart: true,
            wishlist: true,
            reviews: true,
            search: true,
            filters: true,
            booking: false,
            delivery: true,
        },
        settings: {
            currency: 'USD',
            shippingEnabled: true,
        },
        payment: {
            payazaPublicKey: process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY || '',
            enabled: true,
        },
        layoutConfig: {
            hero: { show: true, autoPlay: false },
            features: { show: true, showIcons: true },
            sections: {
                brands: { show: true },
                categories: { show: true },
                featuredProducts: { show: true, title: "Featured Apple Products" },
                marketing: { show: true, showNewsletter: true },
            },
            pages: {
                about: {
                    title: "About Nigeria I-Store",
                    content: "Nigeria's premier destination for authentic Apple products. Authorized reseller with genuine warranty and exceptional customer service.",
                },
                faq: {
                    title: "Frequently Asked Questions",
                    items: [
                        { question: "Are your products authentic?", answer: "Yes, all products are 100% authentic Apple products with official warranty." },
                        { question: "Do you ship across Nigeria?", answer: "Yes, we offer nationwide shipping with express delivery options." },
                        { question: "What is your return policy?", answer: "We offer a 14-day return policy on all unopened items in original packaging." },
                    ],
                },
            },
        },
    },
    // 9. Modern Tech (Another Custom Domain, Same Layout Type)
    {
        id: '9',
        slug: 'modern-tech',
        name: 'Modern Tech Store',
        description: 'The newest tech gadgets.',
        type: 'electronics', // Same type as Grid Tech
        layout: 'electronics', // Same layout
        branding: {
            primaryColor: '#000000',
            secondaryColor: '#333333',
            theme: 'dark',
            socialMedia: {
                twitter: 'https://twitter.com/moderntech',
                instagram: 'https://instagram.com/moderntech',
            },
        },
        navigation: {
            main: [{ label: 'Shop', href: '/products' }],
            footer: [],
        },
        categories: [
            { id: 'cat1', name: 'Smartphones', slug: 'smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80' },
            { id: 'cat2', name: 'Laptops', slug: 'laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80' },
            { id: 'cat3', name: 'Headphones', slug: 'headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80' },
            { id: 'cat4', name: 'Smartwatches', slug: 'smartwatches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' },
            { id: 'cat5', name: 'Tablets', slug: 'tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80' },
            { id: 'cat6', name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80' },
        ],
        products: [
            {
                id: 'mt-prod1',
                name: 'Galaxy Ultra X1',
                slug: 'galaxy-ultra-x1',
                description: 'Next-gen flagship with AI-powered camera, 200MP sensor, and 5G Ultra.',
                price: 1199.00,
                compareAtPrice: 1399.00,
                images: [
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat1',
                inStock: true,
                rating: 4.9,
                reviewCount: 1847,
                specifications: {
                    Brand: 'Samsung',
                    Storage: '512GB',
                    Display: '6.8" Dynamic AMOLED',
                    Processor: 'Snapdragon 8 Gen 3',
                    Camera: '200MP Main Camera'
                },
            },
            {
                id: 'mt-prod2',
                name: 'TechBook Pro 15',
                slug: 'techbook-pro-15',
                description: 'Professional laptop with 13th Gen Intel, RTX graphics, and stunning display.',
                price: 1899.00,
                images: [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat2',
                inStock: true,
                rating: 4.8,
                reviewCount: 892,
                specifications: {
                    Brand: 'Dell',
                    Processor: 'Intel Core i9 13th Gen',
                    RAM: '32GB',
                    Storage: '1TB NVMe SSD',
                    Graphics: 'NVIDIA RTX 4070'
                },
            },
            {
                id: 'mt-prod3',
                name: 'SonicWave Elite',
                slug: 'sonicwave-elite',
                description: 'Premium noise-canceling headphones with spatial audio and 40-hour battery.',
                price: 399.00,
                compareAtPrice: 449.00,
                images: [
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat3',
                inStock: true,
                rating: 4.7,
                reviewCount: 2156,
                specifications: {
                    Brand: 'Sony',
                    Type: 'Over-Ear',
                    NoiseCancellation: 'Active ANC',
                    Battery: 'Up to 40 hours',
                    Audio: 'Hi-Res Spatial Audio'
                },
            },
            {
                id: 'mt-prod4',
                name: 'Pixel Pro 8',
                slug: 'pixel-pro-8',
                description: 'Pure Android experience with Tensor G3, Magic Eraser, and incredible AI.',
                price: 899.00,
                images: [
                    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat1',
                inStock: true,
                rating: 4.8,
                reviewCount: 1523,
                specifications: {
                    Brand: 'Google',
                    Storage: '256GB',
                    Display: '6.7" LTPO OLED',
                    Processor: 'Google Tensor G3',
                    Camera: '50MP Main + 48MP Telephoto'
                },
            },
            {
                id: 'mt-prod5',
                name: 'FitWatch Pro',
                slug: 'fitwatch-pro',
                description: 'Advanced fitness tracker with ECG, blood oxygen, and GPS navigation.',
                price: 349.00,
                images: [
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat4',
                inStock: true,
                rating: 4.6,
                reviewCount: 945,
                specifications: {
                    Brand: 'Garmin',
                    Display: '1.4" AMOLED',
                    Battery: 'Up to 14 days',
                    Features: 'ECG, SpO2, GPS',
                    WaterResistance: '5 ATM'
                },
            },
            {
                id: 'mt-prod6',
                name: 'UltraTab S9',
                slug: 'ultratab-s9',
                description: 'Premium tablet with 120Hz display, S Pen included, and DeX mode.',
                price: 749.00,
                compareAtPrice: 849.00,
                images: [
                    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat5',
                inStock: true,
                rating: 4.8,
                reviewCount: 1245,
                specifications: {
                    Brand: 'Samsung',
                    Display: '11" 120Hz LCD',
                    Processor: 'Snapdragon 8 Gen 2',
                    Storage: '256GB',
                    Includes: 'S Pen'
                },
            },
            {
                id: 'mt-prod7',
                name: 'Gaming Laptop X7',
                slug: 'gaming-laptop-x7',
                description: 'High-performance gaming laptop with RTX 4080 and 240Hz display.',
                price: 2499.00,
                images: [
                    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat2',
                inStock: true,
                rating: 4.9,
                reviewCount: 673,
                specifications: {
                    Brand: 'ASUS ROG',
                    Processor: 'Intel Core i9 13th Gen',
                    RAM: '32GB DDR5',
                    Storage: '2TB NVMe SSD',
                    Graphics: 'NVIDIA RTX 4080'
                },
            },
            {
                id: 'mt-prod8',
                name: 'Wireless Buds Pro',
                slug: 'wireless-buds-pro',
                description: 'True wireless earbuds with adaptive ANC and crystal-clear calls.',
                price: 229.00,
                images: [
                    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat3',
                inStock: true,
                rating: 4.7,
                reviewCount: 1892,
                specifications: {
                    Brand: 'Samsung',
                    Type: 'In-Ear TWS',
                    NoiseCancellation: 'Adaptive ANC',
                    Battery: 'Up to 8 hours',
                    WaterResistance: 'IPX7'
                },
            },
            {
                id: 'mt-prod9',
                name: 'Powerbank 30K',
                slug: 'powerbank-30k',
                description: 'Ultra-high-capacity power bank with 100W fast charging and dual ports.',
                price: 89.00,
                images: [
                    'https://images.unsplash.com/photo-1609592393047-d26c6df8d98d?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat6',
                inStock: true,
                rating: 4.5,
                reviewCount: 2341,
                specifications: {
                    Brand: 'Anker',
                    Capacity: '30,000mAh',
                    Output: '100W USB-C PD',
                    Ports: '2x USB-C, 1x USB-A',
                    PassThrough: 'Yes'
                },
            },
            {
                id: 'mt-prod10',
                name: 'Mechanical Keyboard RGB',
                slug: 'mechanical-keyboard-rgb',
                description: 'Premium mechanical keyboard with hot-swappable switches and RGB lighting.',
                price: 149.00,
                compareAtPrice: 179.00,
                images: [
                    'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat6',
                inStock: true,
                rating: 4.8,
                reviewCount: 756,
                specifications: {
                    Brand: 'Keychron',
                    Switches: 'Hot-swappable Cherry MX',
                    Layout: 'Full-size (104 keys)',
                    Connectivity: 'Bluetooth & Wired',
                    RGB: 'Per-key RGB lighting'
                },
            },
            {
                id: 'mt-prod11',
                name: 'OnePlus 12 Pro',
                slug: 'oneplus-12-pro',
                description: 'Flagship killer with Snapdragon 8 Gen 3, Hasselblad camera, and 120W charging.',
                price: 799.00,
                images: [
                    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat1',
                inStock: true,
                rating: 4.7,
                reviewCount: 1123,
                specifications: {
                    Brand: 'OnePlus',
                    Storage: '256GB',
                    Display: '6.7" LTPO AMOLED 120Hz',
                    Processor: 'Snapdragon 8 Gen 3',
                    Camera: 'Hasselblad Triple Camera'
                },
            },
            {
                id: 'mt-prod12',
                name: 'Smart Home Hub',
                slug: 'smart-home-hub',
                description: 'Central control for your smart home with voice assistant and touchscreen.',
                price: 179.00,
                images: [
                    'https://images.unsplash.com/photo-1558002038-1091a575039f?w=800&q=80&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&q=80&auto=format&fit=crop'
                ],
                categoryId: 'cat6',
                inStock: true,
                rating: 4.6,
                reviewCount: 892,
                specifications: {
                    Brand: 'Amazon',
                    Display: '10.1" HD Touchscreen',
                    Assistant: 'Alexa Built-in',
                    Connectivity: 'Zigbee, Wi-Fi, Bluetooth',
                    Camera: '13MP with auto-framing'
                },
            },
        ],
        features: {
            cart: true,
            wishlist: true,
            reviews: true,
            search: true,
            filters: true,
            booking: false,
            delivery: true,
        },
        settings: {
            currency: 'USD',
            shippingEnabled: true,
        },
        payment: {
            enabled: true,
        },
        domain: {
            customDomain: 'moderntech.com',
            verified: true,
        }
    },
    // 10. Motivational Speaker Store
    {
        id: '10',
        slug: 'mindset-mastery',
        name: 'Mindset Mastery',
        description: 'Unlock your full potential with courses and mentorship from world-class experts.',
        type: 'motivational-speaker',
        layout: 'motivational-speaker',
        branding: {
            primaryColor: '#0F172A', // Slate 900
            secondaryColor: '#E2E8F0', // Slate 200
            accentColor: '#F59E0B', // Amber 500
            logo: '', // Use default SVG
            theme: 'light',
            socialMedia: {
                instagram: 'https://instagram.com/mindsetmastery',
                youtube: 'https://youtube.com/mindsetmastery',
                twitter: 'https://twitter.com/mindsetmastery',
            },
        },
        navigation: {
            main: [
                { label: 'Courses', href: '/services' },
                { label: 'Mentorship', href: '/mentorship' },
                { label: 'About', href: '/about' },
            ],
            footer: [],
        },
        categories: [
            { id: 'cat1', name: 'Video Courses', slug: 'video-courses', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&fit=crop' },
            { id: 'cat2', name: 'Audiobooks', slug: 'audiobooks', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&fit=crop' },
            { id: 'cat3', name: 'Guides & PDFs', slug: 'guides', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&fit=crop' },
            { id: 'mentorship', name: 'Mentorship', slug: 'mentorship', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&fit=crop' },
            { id: 'subscriptions', name: 'Memberships', slug: 'subscriptions', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&fit=crop' },
        ],
        services: [
            {
                id: 'm1',
                name: '1-on-1 Executive Coaching',
                slug: 'executive-coaching',
                description: 'Private 60-minute mentorship session focused on high-level strategy, leadership, and professional growth.',
                price: 499,
                duration: 60,
                categoryId: 'mentorship',
                image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop',
                contentType: 'course',
                accessLevel: 'paid',
            },
            {
                id: 'm2',
                name: 'Group Mentorship Mastermind',
                slug: 'group-mastermind',
                description: 'Monthly group session with like-minded individuals. Collaborative problem-solving and peer mentorship.',
                price: 199,
                duration: 90,
                categoryId: 'mentorship',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
                contentType: 'course',
                accessLevel: 'subscription',
            },
            {
                id: 'c1',
                name: 'The Art of Focus',
                slug: 'art-of-focus',
                description: 'Master your attention and achieve deep work states. Includes 10 video modules and a workbook.',
                price: 99,
                duration: 120,
                categoryId: 'cat1',
                image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop', // Focusing person
                contentType: 'video',
                accessLevel: 'paid',
                contentUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            },
            {
                id: 'c2',
                name: 'Leadership 101 Audiobook',
                slug: 'leadership-101',
                description: 'Listen on the go: Essential principles for leading teams effectively. Narrated by the author.',
                price: 29,
                duration: 180,
                categoryId: 'cat2',
                image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop', // Business leadership/team
                contentType: 'audio',
                accessLevel: 'paid',
                contentUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            },
            {
                id: 'c3',
                name: 'Strategic Planning Guide',
                slug: 'strategic-planning-guide',
                description: 'A comprehensive PDF workbook for your 5-year vision. Free for subscribers.',
                price: 15,
                duration: 0,
                categoryId: 'cat3',
                image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop', // Strategy/planning
                contentType: 'pdf',
                accessLevel: 'free',
                contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            },
            {
                id: 'c4',
                name: 'Emotional Intelligence Mastery',
                slug: 'emotional-intelligence-mastery',
                description: 'Learn to navigate your emotions and build stronger relationships in this comprehensive video course.',
                price: 149,
                duration: 300,
                categoryId: 'cat1',
                image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800&auto=format&fit=crop', // Emotional/connection
                contentType: 'video',
                accessLevel: 'paid',
                contentUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            },
            {
                id: 'c5',
                name: 'Public Speaking Confidence',
                slug: 'public-speaking-confidence',
                description: 'Conquer your fear of the stage and deliver powerful presentations that inspire your audience.',
                price: 79,
                duration: 150,
                categoryId: 'cat1',
                image: 'https://images.unsplash.com/photo-1475721027785-f74ec0f711b1?w=800&auto=format&fit=crop', // Public speaking stage
                contentType: 'video',
                accessLevel: 'paid',
                contentUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
            {
                id: 'c6',
                name: 'The Stoic Mindset Audiobook',
                slug: 'stoic-mindset-audiobook',
                description: 'Ancient wisdom for modern challenges. Learn the principles of Stoicism to achieve inner peace.',
                price: 35,
                duration: 240,
                categoryId: 'cat2',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop', // Calm/stoic person
                contentType: 'audio',
                accessLevel: 'paid',
                contentUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            },
            {
                id: 'c7',
                name: 'Goal Setting Framework',
                slug: 'goal-setting-framework',
                description: 'A step-by-step PDF guide to defining and achieving your most ambitious personal and professional goals.',
                price: 12,
                duration: 0,
                categoryId: 'cat3',
                image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop', // Goal list/planner
                contentType: 'pdf',
                accessLevel: 'free',
                contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            },
            {
                id: 'c8',
                name: 'Time Management for High Achievers',
                slug: 'time-management-high-achievers',
                description: 'Optimize your schedule and reclaim your time with proven productivity techniques.',
                price: 89,
                duration: 200,
                categoryId: 'cat1',
                image: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&auto=format&fit=crop', // Clock/productivity
                contentType: 'video',
                accessLevel: 'paid',
                contentUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            },
        ],
        features: {
            cart: true,
            wishlist: true,
            reviews: true,
            search: true,
            filters: true,
            booking: true,
            delivery: false,
        },
        settings: {
            currency: 'USD',
            shippingEnabled: false,
        },
        payment: {
            payazaPublicKey: process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY || '',
            enabled: true,
        },
        layoutConfig: {
            hero: {
                show: true,
                showCTA: true,
                showSecondaryCTA: true,
            },
            assignedAssets: {
                hero_image: 'https://images.unsplash.com/photo-1475721027785-f74ec0f711b1?w=2070&auto=format&fit=crop',
                hero_video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                bio_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
                subscription_banner: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=2070&auto=format&fit=crop',
            },
            sections: {
                categories: { show: true },
                testimonials: {
                    show: true,
                    items: [
                        { id: '1', name: 'Michael Chen', role: 'Entrepreneur', quote: "The Art of Focus completely changed my perspective on deep work. My productivity has doubled since taking this course.", rating: 5, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', order: 1 },
                        { id: '2', name: 'Sarah Johnson', role: 'Creative Director', quote: "Mindset Mastery is worth every penny. The depth of content in the Emotional Intelligence module is unmatched.", rating: 5, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', order: 2 },
                        { id: '3', name: 'David Lee', role: 'Developer', quote: "Simple, practical, and effective. The Stoic Mindset audiobook is a must-listen for anyone in a high-stress role.", rating: 5, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', order: 3 },
                        { id: '4', name: 'Elena Rodriguez', role: 'Small Business Owner', quote: "I was struggling with burnout until I found this platform. The Time Management course saved my business.", rating: 5, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', order: 4 },
                        { id: '5', name: 'James Wilson', role: 'Sales Executive', quote: "The Public Speaking course gave me the confidence I needed to land my biggest deal yet. Truly life-changing.", rating: 5, image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop', order: 5 },
                    ]
                },
                marketing: { show: true },
            },
            text: {
                hero: {
                    title: "Master Your Mindset",
                    subtitle: "Premium courses to help you lead with confidence.",
                    primaryButton: "View Courses",
                    secondaryButton: "About Me"
                },
                common: {
                    shopNow: "Start Learning",
                }
            }
        },
    },
];
// Helper functions
export function getStoreConfig(slug) {
    return mockStores.find(store => store.slug === slug) || null;
}
export function getAllStores() {
    return mockStores.map(store => ({
        slug: store.slug,
        name: store.name,
        description: store.description,
        type: store.type,
        branding: store.branding,
    }));
}
export function isValidStoreSlug(slug) {
    return mockStores.some(store => store.slug === slug);
}
