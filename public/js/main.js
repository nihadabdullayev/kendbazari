// Intercept all API calls in production to route to Render backend
(function() {
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const baseUrl = isLocal ? '' : 'https://kendbazari-backend.onrender.com';
      input = baseUrl + input;
    }
    return originalFetch(input, init);
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Initialization
  initTheme();

  // Mobile Nav Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('nav--active');
      const spans = menuToggle.querySelectorAll('span');
      if (nav.classList.contains('nav--active')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // Header Scroll Effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    });
  }

  // Slider Logic (if on homepage)
  initSlider();

  // Initialize Cart Badge
  updateCartBadge();
});

/* --- THEME TOGGLE LOGIC --- */
function initTheme() {
  const savedTheme = localStorage.getItem('klik_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('klik_theme', theme);
  
  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  themeBtns.forEach(btn => {
    if (theme === 'dark') {
      btn.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 5a7 7 0 100 14 7 7 0 000-14z"></path></svg>`;
    } else {
      btn.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
    }
  });
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

/* --- CART ENGINE LOGIC --- */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('kb_cart')) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('kb_cart', JSON.stringify(cart));
  updateCartBadge();
  window.dispatchEvent(new Event('cartUpdated'));
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCartBadge() {
  const counts = document.querySelectorAll('.cart-count');
  const total = getCartCount();
  counts.forEach(c => c.textContent = total);
}

function calculateCartTotals() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function adjustCartItemQty(index, delta) {
  const cart = getCart();
  if (cart[index]) {
    cart[index].quantity = Math.max(1, cart[index].quantity + delta);
    saveCart(cart);
    renderCartItems();
  }
}

function renderCartItems() {
  const container = document.querySelector('.cart-items-container');
  if (!container) return;

  const cart = getCart();
  container.innerHTML = cart.map((item, index) => {
    let optionsStr = '';
    if (item.options && Object.keys(item.options).length > 0) {
      optionsStr = Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(', ');
    }
    return `
      <div class="cart-item" style="display:flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm); align-items:center;">
        <img src="${item.image}" alt="${item.title}" style="width:50px; height:50px; object-fit:cover; border-radius: var(--radius-sm);">
        <div style="flex:1;">
          <p style="margin:0; font-weight:600;">${item.title}</p>
          ${optionsStr ? `<p style="margin:2px 0 0 0; font-size:0.8rem; color:var(--text-muted); font-style:italic;">${optionsStr}</p>` : ''}
          <p style="margin:4px 0 0 0; color: var(--text-muted);">
            ${item.price.toLocaleString('az-AZ', {minimumFractionDigits:2})} AZN
            ${item.oldPrice ? `<span style="text-decoration:line-through; margin-left:8px; color: var(--text-muted);">${item.oldPrice.toLocaleString('az-AZ', {minimumFractionDigits:2})} AZN</span>` : ''}
          </p>
          <div class="qty-controls" style="display:flex; align-items:center; gap:4px; margin-top:4px;">
            <button onclick="adjustCartItemQty(${index}, -1)" style="padding:2px 6px;">-</button>
            <span>${item.quantity}</span>
            <button onclick="adjustCartItemQty(${index}, 1)" style="padding:2px 6px;">+</button>
          </div>
        </div>
        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red;">Sil</button>
      </div>
    `;
  }).join('');
}



function addToCart(productId, quantity = 1, options = {}) {
  const db = window.mockDB;
  if (!db) return;

  const product = db.products.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  // Check if item already exists in cart with matching options
  const existingItemIndex = cart.findIndex(item => 
    item.id === productId && 
    JSON.stringify(item.options) === JSON.stringify(options)
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: productId,
      title: product.title,
      price: product.price,

      image: product.image,
      options: options,
      quantity: quantity
    });
  }

  saveCart(cart);
  
  showToast(`${product.title} səbətə əlavə olundu!`);
  if (window.openCartDrawer) window.openCartDrawer();
  renderCartItems();
}

function removeFromCart(index) {
  const cart = getCart();
  if (cart[index]) {
    cart.splice(index, 1);
    saveCart(cart);
    renderCartItems();
  }
}

function updateCartQuantity(index, quantity) {
  const cart = getCart();
  if (cart[index]) {
    cart[index].quantity = Math.max(1, quantity);
    saveCart(cart);
  }
}

function buyNow(productId, quantity = 1, options = {}) {
  // Adds to cart and redirects to checkout directly
  const db = window.mockDB;
  if (!db) return;

  const product = db.products.find(p => p.id === productId);
  if (!product) return;

  // Let's add it to the cart instead of clearing it, so it's a full cart system!
  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => 
    item.id === productId && 
    JSON.stringify(item.options) === JSON.stringify(options)
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: productId,
      title: product.title,
      price: product.price,
      image: product.image,
      options: options,
      quantity: quantity
    });
  }
  
  saveCart(cart);
  window.location.href = '/checkout/';
}

function clearCart() {
  saveCart([]);
}

/* --- TOAST NOTIFICATION --- */
function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
    
    // Add toast container styles dynamically if not present
    const style = document.createElement('style');
    style.textContent = `
      .toast-container {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
      }
      .toast {
        background-color: var(--text-primary);
        color: var(--bg-primary);
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        font-family: var(--font-display);
        font-weight: 500;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid var(--border-light);
      }
      @keyframes slideIn {
        from { transform: translateY(100%) scale(0.9); opacity: 0; }
        to { transform: translateY(0) scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `🛒 <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

/* --- BANNER SLIDER --- */
function initSlider() {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  if (!slider || slides.length === 0) return;

  let currentSlide = 0;
  const prevBtn = document.querySelector('.slider-btn--prev');
  const nextBtn = document.querySelector('.slider-btn--next');

  function scrollToIndex(index) {
    currentSlide = (index + slides.length) % slides.length;
    // Calculate scroll offset based on slide width + gap (which is var(--spacing-md) = 16px)
    const gap = 16;
    const slideWidth = slides[0].offsetWidth;
    slider.scrollTo({
      left: currentSlide * (slideWidth + gap),
      behavior: 'smooth'
    });
  }

  // Update currentSlide based on actual scroll position (syncing trackpad/drag scroll with buttons)
  slider.addEventListener('scroll', () => {
    const gap = 16;
    const slideWidth = slides[0].offsetWidth;
    const scrollPosition = slider.scrollLeft;
    currentSlide = Math.round(scrollPosition / (slideWidth + gap));
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => scrollToIndex(currentSlide + 1));
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => scrollToIndex(currentSlide - 1));
  }

  // Auto scroll every 6 seconds
  let autoPlay = setInterval(() => {
    scrollToIndex(currentSlide + 1);
  }, 6000);

  // Pause autoplay on user interaction
  const pauseAutoPlay = () => {
    clearInterval(autoPlay);
  };

  slider.addEventListener('touchstart', pauseAutoPlay, { passive: true });
  if (nextBtn) nextBtn.addEventListener('click', pauseAutoPlay);
  if (prevBtn) prevBtn.addEventListener('click', pauseAutoPlay);

  // Mouse Drag-to-Scroll for Desktop
  let isDown = false;
  let isDragging = false;
  let startX;
  let scrollLeft;
  const DRAG_THRESHOLD = 5; // px — less than this is a click, not a drag

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    isDragging = false;
    slider.style.scrollBehavior = 'auto';
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    pauseAutoPlay();
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
    isDragging = false;
    slider.style.scrollBehavior = 'smooth';
    slider.classList.remove('slider--dragging');
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.style.scrollBehavior = 'smooth';
    if (isDragging) {
      slider.classList.remove('slider--dragging');
      scrollToIndex(currentSlide);
    }
    isDragging = false;
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const x = e.pageX - slider.offsetLeft;
    const walk = x - startX;
    if (!isDragging && Math.abs(walk) < DRAG_THRESHOLD) return;
    isDragging = true;
    e.preventDefault();
    slider.classList.add('slider--dragging');
    slider.scrollLeft = scrollLeft - walk * 1.5;
  });

  // Block link clicks only when an actual drag happened
  slider.addEventListener('click', (e) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}

/* --- SEO UTILITY FUNCTIONS --- */
function setMetaDescription(desc) {
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = desc;
}

function setCanonicalURL(url) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url || window.location.href;
}

function setOGTags(tags) {
  const defaults = {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content || '',
    image: window.location.origin + '/images/og-image.jpg',
    type: 'website',
    url: window.location.href
  };
  const finalTags = { ...defaults, ...tags };

  Object.entries(finalTags).forEach(([key, val]) => {
    let propertyName = `og:${key}`;
    let meta = document.querySelector(`meta[property="${propertyName}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', propertyName);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', val);
  });
}

function injectJSONLD(schemaObject, id) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaObject, null, 2);
}

// Automatically set canonical url on load
document.addEventListener('DOMContentLoaded', () => {
  setCanonicalURL();
});

