// Professional art collection
const products = [
    { id: 1, name: "Midnight Serenade", artist: "Elena Vasquez", price: 299, emoji: "🌙", category: "Painting", year: "2024" },
    { id: 2, name: "Digital Dreams", artist: "Marcus Chen", price: 199, emoji: "💫", category: "Digital Art", year: "2024" },
    { id: 3, name: "Urban Rhythms", artist: "Sarah Johnson", price: 449, emoji: "🏙️", category: "Photography", year: "2023" },
    { id: 4, name: "Ethereal Beauty", artist: "Isabella Rossi", price: 599, emoji: "🌸", category: "Painting", year: "2024" },
    { id: 5, name: "Abstract Harmony", artist: "David Kim", price: 349, emoji: "🎨", category: "Abstract", year: "2023" },
    { id: 6, name: "Golden Hour", artist: "Emma Thompson", price: 249, emoji: "🌅", category: "Photography", year: "2024" },
    { id: 7, name: "Sculptural Flow", artist: "James Wilson", price: 799, emoji: "🗿", category: "Sculpture", year: "2023" },
    { id: 8, name: "Digital Galaxy", artist: "Luna Park", price: 399, emoji: "🌌", category: "Digital Art", year: "2024" }
];

let cart = [];
let isCartOpen = false;

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('drukart_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('drukart_cart', JSON.stringify(cart));
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    showToast(`${product.name} added to cart!`);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showToast('Item removed from cart');
}

// Update quantity
function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Update cart UI
function updateCartUI() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
    
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    
    if (cartItemsDiv) {
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<div style="text-align: center; padding: 2rem;">Your cart is empty</div>';
            cartTotalSpan.textContent = '$0.00';
            return;
        }
        
        cartItemsDiv.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.artist}</small><br>
                    <small>$${item.price} × ${item.quantity}</small>
                </div>
                <div>
                    <button onclick="updateQuantity(${item.id}, -1)" style="background: none; border: 1px solid #ddd; padding: 5px 10px; cursor: pointer;">-</button>
                    <span style="margin: 0 10px;">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" style="background: none; border: 1px solid #ddd; padding: 5px 10px; cursor: pointer;">+</button>
                    <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: red; margin-left: 10px; cursor: pointer;">×</button>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalSpan.textContent = `$${total.toFixed(2)}`;
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDetails = cart.map(item => 
        `${item.name} by ${item.artist} (${item.quantity}x)`
    ).join('\n');
    
    if (confirm(`Order Summary:\n${orderDetails}\n\nTotal: $${total.toFixed(2)}\n\nProceed to checkout?`)) {
        showToast('Order placed successfully! Thank you for shopping at DrukArt 🎉');
        cart = [];
        saveCart();
        updateCartUI();
        document.getElementById('cartDropdown').classList.add('hidden');
        isCartOpen = false;
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.emoji}
                <div class="product-overlay">
                    <button class="quick-view" onclick="quickView(${product.id})">Quick View</button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-artist">by ${product.artist}</div>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Quick view
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    alert(`${product.name}\nArtist: ${product.artist}\nPrice: $${product.price}\nCategory: ${product.category}\nYear: ${product.year}\n\nThis artwork comes with a certificate of authenticity.`);
}

// Scroll to products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Newsletter subscription
function handleNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    showToast(`Thank you for subscribing! Check your inbox at ${email}`);
    e.target.reset();
}

// Cart dropdown toggle
function toggleCart() {
    const dropdown = document.getElementById('cartDropdown');
    isCartOpen = !isCartOpen;
    dropdown.classList.toggle('hidden');
}

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    const cartContainer = document.querySelector('.cart-container');
    const dropdown = document.getElementById('cartDropdown');
    
    if (cartContainer && !cartContainer.contains(e.target) && isCartOpen) {
        dropdown.classList.add('hidden');
        isCartOpen = false;
    }
});

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    loadCart();
    
    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', toggleCart);
    }
    
    // Close cart button
    const closeCart = document.querySelector('.close-cart');
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            document.getElementById('cartDropdown').classList.add('hidden');
            isCartOpen = false;
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletter);
    }
    
    // Search button
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = prompt('Search for artwork, artist, or category:');
            if (searchTerm) {
                const filtered = products.filter(p => 
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.category.toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (filtered.length > 0) {
                    showToast(`Found ${filtered.length} artworks matching "${searchTerm}"`);
                } else {
                    showToast(`No artworks found matching "${searchTerm}"`);
                }
            }
        });
    }
});