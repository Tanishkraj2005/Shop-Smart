/* ========================================
   SHOP SMART - MAIN JAVASCRIPT
   Complete functionality for e-commerce site
   ======================================== */

// Product data with Indian Rupees
const CURRENCY_SYMBOL = '₹';

const products = [
    { id: 1, name: "Wireless Headphones", price: 2499, category: "electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", description: "Premium wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals." },
    { id: 2, name: "Smart Watch", price: 3999, category: "electronics", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop", description: "Fitness tracker with heart rate monitor, GPS, and 7-day battery life. Water-resistant design for all activities." },
    { id: 3, name: "Laptop Pro", price: 69999, category: "electronics", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop", description: "High-performance laptop with latest processor, 16GB RAM, and 512GB SSD. Perfect for work and gaming." },
    { id: 4, name: "Bluetooth Speaker", price: 3499, category: "electronics", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop", description: "Portable Bluetooth speaker with 360° sound and IPX7 waterproof rating. 20-hour battery life with bass boost." },
    { id: 5, name: "Leather Jacket", price: 1999, category: "fashion", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop", description: "Genuine leather jacket with quilted lining. Available in multiple sizes with premium finish and durability." },
    { id: 6, name: "Running Shoes", price: 1599, category: "fashion", image: "images/running-shoes.jpg", description: "Lightweight running shoes with cushioning technology. Designed for comfort and performance during long runs." },
    { id: 7, name: "Designer Bag", price: 4899, category: "fashion", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop", description: "Luxury designer bag with premium leather and multiple compartments. Stylish and functional for everyday use." },
    { id: 8, name: "Coffee Maker", price: 2099, category: "home", image: "images/coffee-maker.jpg", description: "Programmable coffee maker with thermal carafe. Brew 12 cups with auto-shutoff and pause-and-serve feature." },
    { id: 9, name: "Modern Lamp", price: 1099, category: "home", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop", description: "Contemporary LED lamp with adjustable brightness and color temperature. Modern design perfect for any room." },
    { id: 10, name: "Throw Pillow Set", price: 999, category: "home", image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&h=400&fit=crop", description: "Set of 4 decorative throw pillows with premium fabric. Add style and comfort to your living space." }
];

// Search suggestions (AI-driven search keywords)
const searchSuggestions = [
    "wireless headphones", "smart watch", "laptop", "bluetooth speaker",
    "leather jacket", "running shoes", "designer bag", "coffee maker",
    "modern lamp", "throw pillows", "electronics", "fashion", "home decor"
];

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Update cart count in navbar
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => {
        if (el) el.textContent = totalItems;
    });
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Add product to cart
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCart();
    
    // Show success message
    showNotification(`${product.name} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    
    // If on cart page, reload to show updated cart
    if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    }
}

// Update product quantity in cart
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
    }
    
    // Update cart page if visible
    if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    }
}

// Calculate total price
function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 50 : 0;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;
    
    return { 
        subtotal: formatPrice(subtotal), 
        shipping: formatPrice(shipping), 
        tax: formatPrice(tax), 
        total: formatPrice(total) 
    };
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 15px 30px; border-radius: 4px; z-index: 10000; font-weight: bold;';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ========================================
// HOMEPAGE FUNCTIONALITY
// ========================================

function loadHomePage() {
    // Load featured products
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = '';
        products.slice(0, 6).forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }
    
    // Category cards click handlers
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            // Navigate to category page
            window.location.href = `${category}.html`;
        });
    });
    
    // CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            document.querySelector('.featured-products-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    const formattedPrice = formatPrice(product.price);
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="Shop Smart - ${product.name}" loading="lazy">
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${formattedPrice}</p>
            <button class="btn-add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;
    return card;
}

// Format price with Indian number formatting
function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}

// ========================================
// PRODUCT PAGE FUNCTIONALITY
// ========================================

function loadProductPage() {
    // Get product ID from URL or use default
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 1;
    const product = products.find(p => p.id == productId);
    
    if (product) {
        // Update product details
        document.getElementById('main-product-image').src = product.image;
        document.getElementById('main-product-image').alt = product.name;
        document.getElementById('product-title').textContent = product.name;
        document.getElementById('product-price').textContent = formatPrice(product.price);
        
        // Update product description if it exists
        const descriptionEl = document.getElementById('product-description');
        if (descriptionEl && product.description) {
            descriptionEl.textContent = product.description;
        }
        
        // Add to cart button
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const quantity = parseInt(document.getElementById('quantity').value);
                addToCart(product.id, quantity);
            });
        }
        
        // Buy now button
        const buyNowBtn = document.querySelector('.btn-buy-now');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                const quantity = parseInt(document.getElementById('quantity').value);
                addToCart(product.id, quantity);
                window.location.href = 'cart.html';
            });
        }
        
        // Load related products (different from current product)
        const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);
        const relatedGrid = document.getElementById('related-products-grid');
        if (relatedGrid) {
            relatedGrid.innerHTML = '';
            relatedProducts.forEach(prod => {
                const card = createProductCard(prod);
                relatedGrid.appendChild(card);
            });
        }
    }
}

// ========================================
// CART PAGE FUNCTIONALITY
// ========================================

function loadCartPage() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
    if (cart.length === 0) {
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
        }
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            cartItemsContainer.appendChild(emptyCartMessage);
        }
    } else {
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'none';
        }
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            cart.forEach(item => {
                const cartItem = createCartItem(item);
                cartItemsContainer.appendChild(cartItem);
            });
        }
    }
    
    // Update summary
    updateCartSummary();
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (currentUser) {
                showNotification('Redirecting to checkout...');
                // In a real app, this would redirect to checkout
            } else {
                showNotification('Please login to proceed to checkout');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }
        });
    }
}

function createCartItem(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    const formattedPrice = formatPrice(item.price);
    div.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="Shop Smart - ${item.name}" loading="lazy">
        </div>
        <div class="cart-item-info">
            <h3 class="cart-item-name">${item.name}</h3>
            <p class="cart-item-price">${formattedPrice}</p>
        </div>
        <div class="cart-item-actions">
            <div class="quantity-control">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `;
    return div;
}

function updateCartSummary() {
    const totals = calculateTotal();
    
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = totals.subtotal;
    if (shippingEl) shippingEl.textContent = totals.shipping;
    if (taxEl) taxEl.textContent = totals.tax;
    if (totalEl) totalEl.textContent = totals.total;
}

// ========================================
// AUTH PAGES FUNCTIONALITY
// ========================================

function loadLoginPage() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('login-error');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if user exists
            const user = users.find(u => 
                (u.email === email || u.name === email) && u.password === password
            );
            
            if (user) {
                // Login successful
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                showNotification('Login successful!');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                // Login failed
                if (errorMessage) {
                    errorMessage.textContent = 'Invalid email/username or password';
                    errorMessage.style.display = 'block';
                }
            }
        });
    }
}

function loadSignupPage() {
    const signupForm = document.getElementById('signup-form');
    const errorMessage = document.getElementById('signup-error');
    const successMessage = document.getElementById('signup-success');
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                if (errorMessage) {
                    errorMessage.textContent = 'Passwords do not match';
                    errorMessage.style.display = 'block';
                    successMessage.style.display = 'none';
                }
                return;
            }
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const existingUser = users.find(u => u.email === email);
            
            if (existingUser) {
                if (errorMessage) {
                    errorMessage.textContent = 'User with this email already exists';
                    errorMessage.style.display = 'block';
                    successMessage.style.display = 'none';
                }
                return;
            }
            
            // Create new user
            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Show success
            if (successMessage) {
                successMessage.textContent = 'Account created successfully! Redirecting...';
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';
            }
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });
    }
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (searchInput) {
        // Show suggestions on input
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            if (query.length > 0) {
                const filtered = searchSuggestions.filter(s => s.toLowerCase().includes(query));
                showSuggestions(filtered.slice(0, 5));
            } else {
                hideSuggestions();
            }
        });
        
        // Handle search button click
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput.value.toLowerCase();
                if (query.length > 0) {
                    searchProducts(query);
                    hideSuggestions();
                }
            });
        }
        
        // Handle search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.toLowerCase();
                if (query.length > 0) {
                    searchProducts(query);
                    hideSuggestions();
                }
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                hideSuggestions();
            }
        });
    }
}

function showSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = '';
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'search-suggestion-item';
        item.textContent = suggestion;
        item.addEventListener('click', () => {
            document.getElementById('search-input').value = suggestion;
            searchProducts(suggestion.toLowerCase());
            hideSuggestions();
        });
        suggestionsContainer.appendChild(item);
    });
    suggestionsContainer.style.display = 'block';
}

function hideSuggestions() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

function searchProducts(query) {
    // Filter products based on query
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
    );
    
    // Find or create search results container
    let searchResultsContainer = document.getElementById('search-results');
    if (!searchResultsContainer) {
        // Create search results section
        const main = document.querySelector('main');
        if (main) {
            searchResultsContainer = document.createElement('div');
            searchResultsContainer.id = 'search-results';
            searchResultsContainer.className = 'search-results';
            searchResultsContainer.style.cssText = 'padding: 40px 0; background: #f5f5f5; min-height: 400px;';
            
            const titleDiv = document.createElement('h2');
            titleDiv.className = 'section-title';
            titleDiv.id = 'search-title';
            titleDiv.style.cssText = 'text-align: center; margin-bottom: 30px;';
            
            const containerDiv = document.createElement('div');
            containerDiv.className = 'container';
            
            const gridDiv = document.createElement('div');
            gridDiv.className = 'products-grid';
            gridDiv.id = 'search-products-grid';
            
            containerDiv.appendChild(gridDiv);
            searchResultsContainer.appendChild(titleDiv);
            searchResultsContainer.appendChild(containerDiv);
            
            main.insertBefore(searchResultsContainer, main.firstChild);
        }
    }
    
    const searchTitle = document.getElementById('search-title');
    const searchGrid = document.getElementById('search-products-grid');
    
    if (filtered.length > 0) {
        if (searchTitle) searchTitle.textContent = `Search Results for "${query}" (${filtered.length} products found)`;
        if (searchGrid) {
            searchGrid.innerHTML = '';
            filtered.forEach(product => {
                const productCard = createProductCard(product);
                searchGrid.appendChild(productCard);
            });
        }
        showNotification(`Found ${filtered.length} products matching "${query}"`);
    } else {
        if (searchTitle) searchTitle.textContent = `No products found for your search.`;
        if (searchGrid) {
            searchGrid.innerHTML = '<p style="text-align: center; padding: 40px; font-size: 1.2rem; color: #666;">No products found for your search.</p>';
        }
        showNotification(`No products found matching "${query}"`);
    }
}

// Add CSS for search results
const style = document.createElement('style');
style.textContent = `
    .search-results {
        padding: 40px 0;
        background: #f5f5f5;
    }
`;
document.head.appendChild(style);

// ========================================
// ACCOUNT DROPDOWN FUNCTIONALITY
// ========================================

function initAccountDropdown() {
    const accountLink = document.getElementById('account-link');
    const accountMenu = document.getElementById('account-menu');
    const logoutLink = document.getElementById('logout-link');
    
    if (accountLink && accountMenu) {
        accountLink.addEventListener('click', (e) => {
            e.preventDefault();
            accountMenu.style.display = accountMenu.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Handle logout
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentUser = null;
            localStorage.removeItem('currentUser');
            showNotification('Logged out successfully');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
    
    // Update account menu based on login status
    updateAccountMenu();
}

function updateAccountMenu() {
    const accountLink = document.getElementById('account-link');
    const logoutLink = document.getElementById('logout-link');
    
    if (currentUser) {
        if (accountLink) accountLink.textContent = currentUser.name;
        if (logoutLink) logoutLink.style.display = 'block';
    } else {
        if (accountLink) accountLink.textContent = 'Account';
        if (logoutLink) logoutLink.style.display = 'none';
    }
}

// ========================================
// CATEGORY PAGE FUNCTIONALITY
// ========================================

function loadCategoryPage() {
    // Get category from filename
    const path = window.location.pathname;
    const filename = path.split('/').pop() || path.split('\\').pop();
    let category = filename.replace('.html', '');
    
    // Update page title and heading
    const categoryNames = {
        'electronics': 'Electronics',
        'fashion': 'Fashion',
        'home': 'Home & Living'
    };
    
    // Update both category title elements (breadcrumb and main heading)
    const categoryTitles = document.querySelectorAll('#category-title');
    if (categoryTitles && categoryNames[category]) {
        categoryTitles.forEach(el => {
            if (el) el.textContent = categoryNames[category];
        });
    }
    
    // Filter products by category
    const categoryProducts = products.filter(p => p.category === category);
    
    // Load products
    const productsGrid = document.getElementById('category-products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = '';
        if (categoryProducts.length === 0) {
            productsGrid.innerHTML = '<p style="text-align: center; padding: 40px;">No products in this category yet.</p>';
        } else {
            categoryProducts.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        }
    }
}

// ========================================
// MOBILE MENU FUNCTIONALITY
// ========================================

function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navCenter = document.querySelector('.nav-center');
    const navRight = document.querySelector('.nav-right');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            
            // Toggle visibility of nav elements on mobile
            if (window.innerWidth <= 768) {
                if (mobileMenuToggle.classList.contains('active')) {
                    navCenter.classList.add('show');
                    navRight.classList.add('show');
                } else {
                    navCenter.classList.remove('show');
                    navRight.classList.remove('show');
                }
            }
        });
        
        // Close mobile menu when window is resized
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mobileMenuToggle.classList.remove('active');
                navCenter.classList.remove('show');
                navRight.classList.remove('show');
            }
        });
    }
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize page-specific functionality
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path === '/' || path.includes('index')) {
        loadHomePage();
    } else if (path.includes('product.html')) {
        loadProductPage();
    } else if (path.includes('cart.html')) {
        loadCartPage();
    } else if (path.includes('login.html')) {
        loadLoginPage();
    } else if (path.includes('signup.html')) {
        loadSignupPage();
    } else if (path.includes('electronics.html')) {
        loadCategoryPage();
    } else if (path.includes('fashion.html')) {
        loadCategoryPage();
    } else if (path.includes('home.html')) {
        loadCategoryPage();
    }
    
    // Initialize global features
    initSearch();
    initAccountDropdown();
});

