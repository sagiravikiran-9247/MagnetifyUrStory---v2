// Initial Default Data (used if localStorage is empty)
const DEFAULT_CATEGORIES = ['Best Sellers', 'Trending Gifts', 'Birthday', 'Anniversary', 'Rakhis'];

const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    name: 'Baby Birth Announcement Frame',
    category: 'Best Sellers',
    typeBadge: 'Photo Frames',
    price: 699,
    image: './mywork1.jpg',
    badge: 'Best Seller 🔥',
    desc: 'Customized birth date, time, weight & family stats in luxury frame.'
  },
  {
    id: 'p2',
    name: 'Acrylic Couple Photo Magnet',
    category: 'Best Sellers',
    typeBadge: 'Photo Magnets',
    price: 499,
    image: './mywork2.jpg',
    badge: 'Best Seller 🔥',
    desc: 'High gloss scratchproof acrylic with strong magnetic backing.'
  },
  {
    id: 'p3',
    name: 'Round Acrylic Photo Keychain',
    category: 'Trending Gifts',
    typeBadge: 'Keychains',
    price: 299,
    image: './mywork3.jpg',
    badge: 'Trending ✨',
    desc: 'Double-sided acrylic photo keychain with metallic ring.'
  },
  {
    id: 'p4',
    name: 'Square Friends Memory Keychain',
    category: 'Trending Gifts',
    typeBadge: 'Keychains',
    price: 299,
    image: './mywork4.jpg',
    badge: 'Trending ✨',
    desc: 'Crystal square acrylic keychain featuring your favorite memory.'
  },
  {
    id: 'p5',
    name: 'Natural Wooden Photo Frame',
    category: 'Anniversary',
    typeBadge: 'Photo Frames',
    price: 549,
    image: './mywork5.jpg',
    badge: 'Anniversary Special ❤️',
    desc: 'Premium wooden tabletop frame with high resolution print.'
  },
  {
    id: 'p6',
    name: '3-Photo Memory Sequence Block',
    category: 'Trending Gifts',
    typeBadge: 'Photo Albums',
    price: 649,
    image: './mywork6.jpg',
    badge: '3-Photo Special 🎬',
    desc: 'Vertical 3-photo story block acrylic keepsake.'
  },
  {
    id: 'p7',
    name: 'Custom Photo Rakhi / Keychain Gift',
    category: 'Rakhis',
    typeBadge: 'Rakhis & Return Gifts',
    price: 349,
    image: './mywork7.jpg',
    badge: 'Rakhi Special 🪔',
    desc: 'Personalized photo Rakhi keepsake with glitter finish.'
  },
  {
    id: 'p8',
    name: 'Personalized Magazine Cover Frame',
    category: 'Birthday',
    typeBadge: 'Magazines',
    price: 799,
    image: './mywork8.jpg',
    badge: 'Custom Magazine 📰',
    desc: 'Vogue/Celebrity styled custom photo magazine print frame.'
  },
  {
    id: 'p9',
    name: 'Acrylic Fridge Magnet Set (Pack of 5)',
    category: 'Best Sellers',
    typeBadge: 'Return Gifts',
    price: 899,
    image: './mywork9.jpg',
    badge: 'Return Gifts 🎁',
    desc: 'Perfect return gift set for birthdays, weddings & corporate events.'
  }
];

// Normalize Image Paths for GitHub Pages compatibility
function fixImgPath(path) {
  if (!path) return './mywork2.jpg';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  // Clean any old assets/ subpath to point to root image
  let cleaned = path.replace(/^\.\/assets\//, './').replace(/^assets\//, './');
  if (!cleaned.startsWith('./')) {
    cleaned = './' + cleaned;
  }
  return cleaned;
}

// Helper functions for dynamic store data with path repair
function getStoreCategories() {
  const saved = localStorage.getItem('magnetify_categories');
  return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
}

function getStoreProducts() {
  const saved = localStorage.getItem('magnetify_products');
  if (!saved) return DEFAULT_PRODUCTS;
  
  try {
    const products = JSON.parse(saved);
    // Auto repair any old stored image paths in localStorage
    let updated = false;
    products.forEach(p => {
      const fixed = fixImgPath(p.image);
      if (fixed !== p.image) {
        p.image = fixed;
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem('magnetify_products', JSON.stringify(products));
    }
    return products;
  } catch (e) {
    return DEFAULT_PRODUCTS;
  }
}

// State
const state = {
  selectedProduct: 'Custom Photo Magnet',
  basePrice: 499,
  customText: 'Our Forever Story ✨ 2026',
  photoUrl: './mywork2.jpg',
  finish: 'white',
  includeGiftWrap: true,
  includeLed: false,
  phoneNumber: '9553819025',
  googleSheetScriptUrl: ''
};

// Toast notification
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }
}

// DYNAMICALLY RENDER CATEGORIES & PRODUCTS ON INDEX.HTML
function renderStorePage() {
  const categories = getStoreCategories();
  const products = getStoreProducts();

  // 1. Render Category Pills
  const catPillsContainer = document.querySelector('.category-pills');
  if (catPillsContainer) {
    catPillsContainer.innerHTML = `
      <button class="cat-pill active" onclick="filterCategory('All', this)">All Gifts</button>
      ${categories.map(c => `
        <button class="cat-pill" onclick="filterCategory('${c}', this)">✨ ${c}</button>
      `).join('')}
    `;
  }

  // 2. Render Product Cards Grid
  const productGrid = document.querySelector('.product-grid');
  if (productGrid) {
    productGrid.innerHTML = products.map(p => `
      <div class="product-card js-3d-tilt" data-category="${p.category}">
        <div class="product-img-box">
          <img src="${fixImgPath(p.image)}" alt="${p.name}" onerror="this.src='./mywork2.jpg'">
          <span class="product-badge">${p.badge || p.category}</span>
        </div>
        <div class="product-details">
          <span class="product-type-badge">${p.typeBadge || p.category}</span>
          <h4 class="product-title">${p.name}</h4>
          <p style="font-size: 12px; color: var(--text-muted);">${p.desc || 'Handcrafted customized keepsake.'}</p>
          <div class="product-price-bar">
            <span class="product-price">₹${p.price}</span>
            <button onclick="openOrderModal('${p.name.replace(/'/g, "\\'")}', ${p.price})" class="btn btn-whatsapp" style="font-size: 12px;">
              <img src="./whatsapp.png" alt="WhatsApp" style="width: 18px; height: 18px; object-fit: contain;">
              <span>Order on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Attach 3D Cursor Tilt & Spotlight Effect
  init3DTilt();
}

// INTERACTIVE 3D MOUSE TILT & SPOTLIGHT CURSOR HANDLER
function init3DTilt() {
  const tiltCards = document.querySelectorAll('.js-3d-tilt, .hero-3d-card, .marquee-photo-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -14;
      const rotateY = ((x - centerX) / centerX) * 14;
      
      // Update spotlight CSS variables
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// Category Filter Handler
function filterCategory(catName, btnEl) {
  const pills = document.querySelectorAll('.cat-pill');
  pills.forEach(p => p.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const cardCat = card.dataset.category || '';
    if (catName === 'All' || cardCat.includes(catName)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Order Form Handler (Direct WhatsApp + Google Sheets Log + Saved Orders)
function handleOrderSubmit(e) {
  e.preventDefault();

  const customerName = document.getElementById('custName').value;
  const customerPhone = document.getElementById('custPhone').value;
  const deliveryAddress = document.getElementById('custAddress').value;

  if (!customerName || !customerPhone) {
    alert('Please enter your Name and Mobile Number!');
    return;
  }

  const totalPrice = state.basePrice;

  // Order Payload
  const orderData = {
    timestamp: new Date().toLocaleString(),
    brand: 'Magnetify Ur Story (@magnetify_ur_story)',
    customerName,
    customerPhone,
    deliveryAddress: deliveryAddress || 'Visakhapatnam',
    productName: state.selectedProduct,
    customInscription: state.customText || 'None',
    totalPrice: `₹${totalPrice}`
  };

  // 1. Log to localStorage saved_orders (read by Admin Dashboard)
  let localOrders = JSON.parse(localStorage.getItem('saved_orders') || '[]');
  localOrders.unshift(orderData);
  localStorage.setItem('saved_orders', JSON.stringify(localOrders));

  // 2. Submit to Google Sheets Webhook if configured
  const sheetUrl = state.googleSheetScriptUrl || localStorage.getItem('google_sheet_url');
  if (sheetUrl) {
    fetch(sheetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    }).catch(err => console.log('Sheets submit notice:', err));
  }

  showToast('✅ Details Saved! Opening WhatsApp to complete order...');

  // Format WhatsApp Message directly to 9553819025
  const waText = `Hi Magnetify Ur Story! 👋 I want to confirm my custom order:

👤 *Name:* ${customerName}
📞 *Phone:* ${customerPhone}
📍 *Address:* ${deliveryAddress || 'Visakhapatnam'}

🎁 *Product:* ${state.selectedProduct}
💰 *Total Amount:* ${totalPrice.toString().startsWith('₹') ? totalPrice : '₹' + totalPrice}

I will send my photo attachment now! 📸`;

  const waUrl = `https://wa.me/919553819025?text=${encodeURIComponent(waText)}`;
  
  closeModal();
  setTimeout(() => {
    window.open(waUrl, '_blank');
  }, 800);
}

// Modal open / close
function openOrderModal(productName, price) {
  if (productName) {
    state.selectedProduct = productName;
    state.basePrice = price || 499;
  }
  const modalProdEl = document.getElementById('modalSelectedProduct');
  const modalPriceEl = document.getElementById('modalTotalPrice');

  if (modalProdEl) modalProdEl.textContent = state.selectedProduct;
  if (modalPriceEl) modalPriceEl.textContent = `₹${state.basePrice}`;
  
  const modal = document.getElementById('orderModal');
  if (modal) modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('orderModal');
  if (modal) modal.classList.remove('active');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  renderStorePage();
  const savedSheet = localStorage.getItem('google_sheet_url');
  if (savedSheet) state.googleSheetScriptUrl = savedSheet;
});

// Auto re-render when switching back to tab or when localStorage changes in admin
window.addEventListener('storage', () => {
  renderStorePage();
});

window.addEventListener('focus', () => {
  renderStorePage();
});
