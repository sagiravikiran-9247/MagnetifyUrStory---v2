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
    badge: 'Best Seller 🔥'
  },
  {
    id: 'p2',
    name: 'Acrylic Couple Photo Magnet',
    category: 'Best Sellers',
    typeBadge: 'Photo Magnets',
    price: 499,
    image: './mywork2.jpg',
    badge: 'Best Seller 🔥'
  },
  {
    id: 'p3',
    name: 'Round Acrylic Photo Keychain',
    category: 'Trending Gifts',
    typeBadge: 'Keychains',
    price: 299,
    image: './mywork3.jpg',
    badge: 'Trending ✨'
  },
  {
    id: 'p4',
    name: 'Square Friends Memory Keychain',
    category: 'Trending Gifts',
    typeBadge: 'Keychains',
    price: 299,
    image: './mywork4.jpg',
    badge: 'Trending ✨'
  },
  {
    id: 'p5',
    name: 'Natural Wooden Photo Frame',
    category: 'Anniversary',
    typeBadge: 'Photo Frames',
    price: 549,
    image: './mywork5.jpg',
    badge: 'Anniversary Special ❤️'
  },
  {
    id: 'p6',
    name: '3-Photo Memory Sequence Block',
    category: 'Trending Gifts',
    typeBadge: 'Photo Albums',
    price: 649,
    image: './mywork6.jpg',
    badge: '3-Photo Special 🎬'
  },
  {
    id: 'p7',
    name: 'Custom Photo Rakhi / Keychain Gift',
    category: 'Rakhis',
    typeBadge: 'Rakhis & Return Gifts',
    price: 349,
    image: './mywork7.jpg',
    badge: 'Rakhi Special 🪔'
  },
  {
    id: 'p8',
    name: 'Personalized Magazine Cover Frame',
    category: 'Birthday',
    typeBadge: 'Magazines',
    price: 799,
    image: './mywork8.jpg',
    badge: 'Custom Magazine 📰'
  },
  {
    id: 'p9',
    name: 'Acrylic Fridge Magnet Set (Pack of 5)',
    category: 'Best Sellers',
    typeBadge: 'Return Gifts',
    price: 899,
    image: './mywork9.jpg',
    badge: 'Return Gifts 🎁'
  }
];

// Image Path Normalizer
function fixImgPath(path) {
  if (!path) return './mywork2.jpg';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  let cleaned = path.replace(/^\.\/assets\//, './').replace(/^assets\//, './');
  if (!cleaned.startsWith('./')) {
    cleaned = './' + cleaned;
  }
  return cleaned;
}

// Helper to get Categories
function getCategories() {
  const saved = localStorage.getItem('magnetify_categories');
  return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
}

// Helper to save Categories
function saveCategories(cats) {
  localStorage.setItem('magnetify_categories', JSON.stringify(cats));
}

// Helper to get Products with Path Repair
function getProducts() {
  const saved = localStorage.getItem('magnetify_products');
  if (!saved) return DEFAULT_PRODUCTS;
  try {
    const prods = JSON.parse(saved);
    prods.forEach(p => p.image = fixImgPath(p.image));
    return prods;
  } catch(e) {
    return DEFAULT_PRODUCTS;
  }
}

// Helper to save Products
function saveProducts(prods) {
  prods.forEach(p => p.image = fixImgPath(p.image));
  localStorage.setItem('magnetify_products', JSON.stringify(prods));
}

// Toast
function showAdminToast(msg) {
  const toast = document.getElementById('adminToast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

// ADMIN AUTHENTICATION
function checkAuth() {
  const isAuth = localStorage.getItem('admin_authenticated');
  const loginScreen = document.getElementById('adminLoginScreen');
  if (isAuth === 'true') {
    if (loginScreen) loginScreen.style.display = 'none';
  } else {
    if (loginScreen) loginScreen.style.display = 'flex';
  }
}

function handleAdminLogin(e) {
  e.preventDefault();
  const u = document.getElementById('adminUser').value.trim();
  const p = document.getElementById('adminPass').value.trim();

  // Credentials: 9553819025 / mylove
  if (u === '9553819025' && p === 'mylove') {
    localStorage.setItem('admin_authenticated', 'true');
    checkAuth();
    showAdminToast('Welcome Admin! Login Successful 🎉');
  } else {
    alert('Invalid Credentials! Please check Login ID and Password.');
  }
}

function adminLogout() {
  localStorage.removeItem('admin_authenticated');
  checkAuth();
}

// TAB SWITCHING
function switchAdminTab(tabId, btnEl) {
  document.querySelectorAll('.admin-tab-content').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  const activeTab = document.getElementById(tabId);
  if (activeTab) activeTab.style.display = 'block';
  if (btnEl) btnEl.classList.add('active');
}

// RENDER PRODUCTS IN ADMIN TABLE
function renderAdminProducts() {
  const products = getProducts();
  const tableBody = document.getElementById('adminProductsTable');
  const catSelect = document.getElementById('newProdCategory');
  const categories = getCategories();

  // Populate Add Form Category Dropdown
  if (catSelect) {
    catSelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  // Update Stats
  const statProd = document.getElementById('statTotalProducts');
  if (statProd) statProd.textContent = products.length;

  if (!tableBody) return;

  tableBody.innerHTML = products.map(p => `
    <tr>
      <td><img src="${fixImgPath(p.image)}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: cover;" onerror="this.src='./mywork2.jpg'"></td>
      <td><strong>${p.name}</strong><br><span style="font-size:11px; color:#77569b;">${p.typeBadge || 'Custom Gift'}</span></td>
      <td><span class="product-type-badge">${p.category}</span></td>
      <td>
        <input type="number" id="price_${p.id}" class="price-input-small" value="${p.price}">
        <button onclick="updateProductPrice('${p.id}')" class="btn btn-secondary" style="padding: 4px 10px; font-size: 11px; margin-left: 6px;">Save Price 💾</button>
      </td>
      <td>
        <button onclick="deleteProduct('${p.id}')" class="btn btn-secondary" style="padding: 6px 12px; font-size: 11px; color: #ff4e78; border-color: #ff4e78;">Delete 🗑️</button>
      </td>
    </tr>
  `).join('');
}

// UPDATE ITEM PRICE
function updateProductPrice(id) {
  const products = getProducts();
  const inputEl = document.getElementById(`price_${id}`);
  if (!inputEl) return;

  const newPrice = parseInt(inputEl.value, 10);
  const target = products.find(p => p.id === id);

  if (target && !isNaN(newPrice)) {
    target.price = newPrice;
    saveProducts(products);
    showAdminToast(`Updated price for "${target.name}" to ₹${newPrice}!`);
    renderAdminProducts();
  }
}

// ADD NEW PRODUCT
function addNewProduct(e) {
  e.preventDefault();
  const name = document.getElementById('newProdName').value;
  const category = document.getElementById('newProdCategory').value;
  const price = parseInt(document.getElementById('newProdPrice').value, 10);
  const image = fixImgPath(document.getElementById('newProdImg').value || './mywork2.jpg');

  const products = getProducts();
  const newProduct = {
    id: 'p_' + Date.now(),
    name,
    category,
    typeBadge: category,
    price,
    image,
    badge: 'New Item ✨'
  };

  products.unshift(newProduct);
  saveProducts(products);
  showAdminToast(`Added "${name}" to store!`);
  document.getElementById('newProdName').value = '';
  document.getElementById('newProdPrice').value = '';
  renderAdminProducts();
}

// DELETE PRODUCT
function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product from your store?')) {
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    showAdminToast('Product deleted from store.');
    renderAdminProducts();
  }
}

// RENDER CATEGORIES
function renderAdminCategories() {
  const categories = getCategories();
  const listEl = document.getElementById('adminCategoriesList');

  // Update Stats
  const statCat = document.getElementById('statTotalCategories');
  if (statCat) statCat.textContent = categories.length;

  if (!listEl) return;

  listEl.innerHTML = categories.map(c => `
    <div style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 99px; background: #ebdcf9; border: 1px solid #77569b; color: #4a2c66; font-weight: 800; font-size: 13px;">
      <span>${c}</span>
      <button onclick="deleteCategory('${c}')" style="background: none; border: none; color: #ff4e78; font-weight: 800; cursor: pointer;">&times;</button>
    </div>
  `).join('');
}

// ADD CATEGORY
function addNewCategory(e) {
  e.preventDefault();
  const catInput = document.getElementById('newCatName');
  const val = catInput.value.trim();

  if (val) {
    const categories = getCategories();
    if (!categories.includes(val)) {
      categories.push(val);
      saveCategories(categories);
      showAdminToast(`Category "${val}" added!`);
      catInput.value = '';
      renderAdminCategories();
      renderAdminProducts();
    } else {
      alert('Category already exists!');
    }
  }
}

// DELETE CATEGORY
function deleteCategory(catName) {
  if (confirm(`Delete category "${catName}"?`)) {
    let categories = getCategories();
    categories = categories.filter(c => c !== catName);
    saveCategories(categories);
    showAdminToast(`Category "${catName}" removed.`);
    renderAdminCategories();
    renderAdminProducts();
  }
}

// RENDER ORDERS LOG
function renderAdminOrders() {
  const orders = JSON.parse(localStorage.getItem('saved_orders') || '[]');
  const tableBody = document.getElementById('adminOrdersTable');

  const statOrd = document.getElementById('statTotalOrders');
  if (statOrd) statOrd.textContent = orders.length;

  if (!tableBody) return;

  if (orders.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#77569b; padding:20px;">No customer orders logged yet. Orders submitted by customers will appear here!</td></tr>`;
    return;
  }

  tableBody.innerHTML = orders.map(o => `
    <tr>
      <td>${o.timestamp}</td>
      <td><strong>${o.customerName}</strong></td>
      <td><a href="https://wa.me/91${o.customerPhone}" target="_blank" style="color:#25d366; font-weight:800; text-decoration:none;">📞 ${o.customerPhone}</a></td>
      <td>${o.productName}</td>
      <td><strong style="color:#4a2c66;">${o.totalPrice}</strong></td>
      <td>${o.deliveryAddress}</td>
    </tr>
  `).join('');
}

function clearOrdersLog() {
  if (confirm('Clear customer order history?')) {
    localStorage.removeItem('saved_orders');
    renderAdminOrders();
    showAdminToast('Orders log cleared.');
  }
}

// INITIALIZE ON DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  renderAdminProducts();
  renderAdminCategories();
  renderAdminOrders();
});
