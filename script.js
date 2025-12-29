// ===== PRODUCT DATA =====

// ========================================
// PRODUCTOS PARA HOMBRES
// ========================================
const menProducts = [
    {
        id: 1,
        name: 'Chaqueta de Cuero Negra',
        price: 89990,
        image: 'images/black_leather_jacket.png',
        description: 'Chaqueta de cuero premium con diseño urbano',
        category: 'men',
        sizes: ['S', 'M', 'L', 'XL'],
        unavailableSizes: ['L'] // Talla no disponible
    },
    {
        id: 2,
        name: 'Zapatillas Negras Deportivas',
        price: 59990,
        image: 'images/black_sneakers.png',
        description: 'Zapatillas deportivas de alta calidad',
        category: 'men',
        sizes: ['38', '39', '40', '41', '42', '43'],
        unavailableSizes: ['40', '43'] // Tallas no disponibles
    },
    {
        id: 3,
        name: 'Abrigo Blanco Elegante',
        price: 119990,
        image: 'images/white_coat.png',
        description: 'Abrigo elegante para ocasiones especiales',
        category: 'men',
        sizes: ['S', 'M', 'L', 'XL'],
        unavailableSizes: ['S', 'XL'] // Tallas no disponibles
    },
    {
        id: 4,
        name: 'Camiseta Blanca Premium',
        price: 29990,
        image: 'images/white_tshirt.png',
        description: 'Camiseta básica de algodón premium',
        category: 'men',
        sizes: ['S', 'M', 'L', 'XL'],
        unavailableSizes: ['M'] // Talla no disponible
    },
    {
        id: 5,
        name: 'Camiseta Negra Premium',
        price: 18990,
        image: 'images/black_tshirt.png',
        description: 'Camiseta básica de algodón premium',
        category: 'men',
        sizes: ['S', 'M', 'L', 'XL'],
        unavailableSizes: [] // Todas las tallas disponibles
    },
    {
        id: 6,
        name: 'Pantalon Negro Deportivo',
        price: 29990,
        image: 'images/pants_sport.png',
        description: 'Pantalon negro de algodón premium',
        category: 'men',
        sizes: ['S', 'M', 'L', 'XL'],
        unavailableSizes: ['S', 'L'] // Tallas no disponibles
    }
];

// ========================================
// PRODUCTOS PARA MUJERES
// ⚠️ AGREGA TUS PRODUCTOS DE MUJERES AQUÍ ⚠️
// ========================================
const womenProducts = [
    // 👇 PRODUCTO DE EJEMPLO - AGREGA MÁS AQUÍ 👇
    {
        id: 100,
        name: 'Top Negro Elegante',
        price: 34990,
        image: 'images/black_top.png',
        description: 'Top negro elegante para cualquier ocasión',
        category: 'women',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        unavailableSizes: ['XS', 'L', 'XL'] // Tallas no disponibles
    },
    {
        id: 101,
        name: 'Calza Deportiva Negra',
        price: 17990,
        image: 'images/calzadeportivanegra.png',
        description: 'Calza deportiva negra para la actividad fisica',
        category: 'women',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        unavailableSizes: ['XS', 'L', 'XL'] // Tallas no disponibles
    },
    {
        id: 102,
        name: 'Poleron Verde Deportivo',
        price: 19990,
        image: 'images/poleronverde.png',
        description: 'Poleron verde deportivo para la actividad fisica',
        category: 'women',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        unavailableSizes: ['XS'] // Tallas no disponibles
    }
    // 👇 AGREGA MÁS PRODUCTOS DE MUJERES AQUÍ 👇
];

// Combinar todos los productos
const allProducts = [...menProducts, ...womenProducts];
const products = allProducts;

// ===== CART STATE =====
let cart = [];
let currentCategory = 'men'; // Track current category
let selectedSizes = {}; // Track selected sizes for each product { productId: size }

// ===== DOM ELEMENTS =====
const productsGrid = document.getElementById('products-grid');
const sectionTitle = document.getElementById('section-title');
const categoryToggle = document.getElementById('category-toggle');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const cartFooter = document.getElementById('cart-footer');
const whatsappCheckout = document.getElementById('whatsapp-checkout');
const instagramCheckout = document.getElementById('instagram-checkout');

// ===== UTILITY FUNCTIONS =====
function formatPrice(price) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(price);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Add animation
    cartCount.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
    }, 200);
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatPrice(total);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// ===== CATEGORY TOGGLE =====
function toggleCategory() {
    // Switch category
    currentCategory = currentCategory === 'men' ? 'women' : 'men';

    // Update UI
    if (currentCategory === 'men') {
        sectionTitle.textContent = 'Colección Hombres';
        categoryToggle.textContent = 'Ver Colección Mujeres';
    } else {
        sectionTitle.textContent = 'Colección Mujeres';
        categoryToggle.textContent = 'Ver Colección Hombres';
    }

    // Re-render products
    renderProducts();

    // Reset selected sizes when switching categories
    selectedSizes = {};

    // Scroll to products section smoothly
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// ===== SIZE SELECTION =====
function handleSizeSelection(e) {
    const productId = parseInt(e.target.closest('.product-card').dataset.productId);
    const size = e.target.dataset.size;

    // Update state
    selectedSizes[productId] = size;

    // Update UI (active class)
    const productCard = e.target.closest('.product-card');
    productCard.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
}

// ===== RENDER FUNCTIONS =====
function renderProductCard(product) {
    const sizesHTML = product.sizes.map(size => {
        const isUnavailable = product.unavailableSizes.includes(size);
        return `<button class="size-btn ${isUnavailable ? 'unavailable' : ''}" data-size="${size}" ${isUnavailable ? 'disabled' : ''}>${size}</button>`;
    }).join('');

    return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-image-container">
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          class="product-image"
          loading="lazy"
        >
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <div class="sizes-container">
          <p class="sizes-label">Tallas:</p>
          <div class="sizes-grid">
            ${sizesHTML}
          </div>
        </div>
        <button 
          class="add-to-cart-btn" 
          data-product-id="${product.id}"
          aria-label="Agregar ${product.name} al carrito"
        >
          Agregar al Carrito
        </button>
      </div>
    </article>
  `;
}

function renderProducts() {
    const productsToShow = currentCategory === 'men' ? menProducts : womenProducts;

    if (productsToShow.length > 0) {
        productsGrid.innerHTML = productsToShow.map(product => renderProductCard(product)).join('');
    } else {
        productsGrid.innerHTML = `
    < div style = "grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: #666;" >
        <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Próximamente</h3>
        <p>Estamos preparando nuestra colección de mujeres. ¡Vuelve pronto!</p>
      </div >
    `;
    }

    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });

    // Add event listeners to all size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
        if (!btn.disabled) {
            btn.addEventListener('click', handleSizeSelection);
        }
    });
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
        cartFooter.style.display = 'none';
        return;
    }

    cartFooter.style.display = 'block';

    cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" data - item - id="${item.id}">
        <img
            src="${item.image}"
            alt="${item.name}"
            class="cart-item-image"
        >
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">Talla: ${item.size} | ${formatPrice(item.price)} x ${item.quantity}</div>
            </div>
            <button
                class="remove-item"
                data-item-id="${item.cartItemId}"
                aria-label="Eliminar ${item.name} del carrito"
            >
                🗑️
            </button>
        </div>
`).join('');

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', handleRemoveFromCart);
    });

    updateCartTotal();
}

// ===== CART FUNCTIONS =====
function handleAddToCart(e) {
    const productId = parseInt(e.target.dataset.productId);
    const product = products.find(p => p.id === productId);

    if (!product) return;

    // Check if size is selected
    const selectedSize = selectedSizes[productId];
    if (!selectedSize) {
        alert('Por favor, selecciona una talla antes de agregar al carrito.');
        return;
    }

    const cartItemId = `${productId}-${selectedSize}`;
    const existingItem = cart.find(item => item.cartItemId === cartItemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            cartItemId: cartItemId,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity: 1
        });
    }

    updateCartCount();
    saveCart();

    // Visual feedback
    const btn = e.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Agregado';
    btn.style.backgroundColor = '#25D366';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
    }, 1000);
}

function handleRemoveFromCart(e) {
    const cartItemId = e.target.dataset.itemId;
    const item = cart.find(item => item.cartItemId === cartItemId);

    if (item) {
        if (item.quantity > 1) {
            // Decrementar cantidad
            item.quantity -= 1;
        } else {
            // Eliminar del carrito si la cantidad es 1
            cart = cart.filter(item => item.cartItemId !== cartItemId);
        }
    }

    updateCartCount();
    saveCart();
    renderCart();
}

// ===== CHECKOUT FUNCTIONS =====
function generateOrderMessage() {
    let message = '🛍️ *Nuevo Pedido - NOIR & BLANC*\n\n';
    message += '*Productos:*\n';

    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (Talla: ${item.size})\n`;
        message += `   Cantidad: ${item.quantity} \n`;
        message += `   Precio: ${formatPrice(item.price * item.quantity)} \n\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `* Total: ${formatPrice(total)}*\n\n`;
    message += '¡Gracias por tu preferencia! 🖤🤍';

    return encodeURIComponent(message);
}

function handleWhatsAppCheckout() {
    if (cart.length === 0) return;

    const message = generateOrderMessage();
    // Reemplaza con tu número de WhatsApp (formato internacional sin +)
    const phoneNumber = '56912345678';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappURL, '_blank');
}

function handleInstagramCheckout() {
    if (cart.length === 0) return;

    // Reemplaza con tu usuario de Instagram
    const instagramUsername = 'nikoo.dev';
    const instagramURL = `https://instagram.com/${nikoo.dev}`;

    // Show alert with order details
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    window.open(instagramURL, '_blank');
}

// ===== MODAL FUNCTIONS =====
function openCart() {
    renderCart();
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');

function toggleMobileMenu() {
    navbar.classList.toggle('active');
    const isOpen = navbar.classList.contains('active');
    menuToggle.textContent = isOpen ? '✕' : '☰';
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
}

function closeMobileMenu() {
    navbar.classList.remove('active');
    menuToggle.textContent = '☰';
    menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
}

// ===== ACTIVE NAV LINK =====
function updateActiveNavLink() {
    const sections = ['hero', 'products', 'footer'];
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                currentSection = sectionId;
            }
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === currentSection) {
            link.classList.add('active');
        }
    });
}

// ===== HEADER SCROLL EFFECT =====
function handleScroll() {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.style.padding = '0.75rem 2rem';
        header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.padding = '1rem 2rem';
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();
}

// ===== EVENT LISTENERS =====
cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartModal);
whatsappCheckout.addEventListener('click', handleWhatsAppCheckout);
instagramCheckout.addEventListener('click', handleInstagramCheckout);

// Category toggle
categoryToggle.addEventListener('click', toggleCategory);

// Mobile menu toggle
menuToggle.addEventListener('click', toggleMobileMenu);

// Navigation links - smooth scroll and close mobile menu
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            closeMobileMenu();
        }
    });
});

// Close modal when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        closeCartModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (cartModal.classList.contains('active')) {
            closeCartModal();
        }
        if (navbar.classList.contains('active')) {
            closeMobileMenu();
        }
    }
});

// Scroll effect
window.addEventListener('scroll', handleScroll);

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderProducts();

    // Smooth scroll for hero CTA
    const heroCTA = document.querySelector('.hero-cta');
    if (heroCTA) {
        heroCTA.addEventListener('click', (e) => {
            e.preventDefault();
            const productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

