// ============================================================
// STATE
// ============================================================
let currentStep = 0;
let currentColor = '#7C3AED';
let wrapCost = 0;
let darkMode = false;
let currentQty = 1;

// ============================================================
// SPA NAVIGATION
// ============================================================
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  window.scrollTo(0, 0);
  if (id === 'admin') document.getElementById('revenueChart') && buildChart();
}

// ============================================================
// DARK MODE
// ============================================================
function toggleDark() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode', darkMode);
  document.querySelector('[onclick="toggleDark()"]').textContent = darkMode ? '☀️' : '🌙';
  showToast(darkMode ? 'Đã bật chế độ tối 🌙' : 'Đã tắt chế độ sáng ☀️');
}

// ============================================================
// MOBILE MENU
// ============================================================
function toggleMobile() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ============================================================
// NAVBAR SCROLL
// ============================================================
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
});

// ============================================================
// CUSTOMIZE PAGE
// ============================================================
function setStep(n, btn) {
  currentStep = n;
  document.querySelectorAll('.step-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  for (let i = 0; i < 4; i++) document.getElementById('c-step-' + i).style.display = i === n ? 'block' : 'none';
  document.getElementById('prevBtn').style.display = n > 0 ? '' : 'none';
  document.getElementById('nextBtn').textContent = n === 3 ? 'Thêm vào giỏ 🛒' : 'Tiếp tục →';
}

function stepNav(dir) {
  const tabs = document.querySelectorAll('.step-tab');
  const next = Math.max(0, Math.min(3, currentStep + dir));
  setStep(next, tabs[next]);
  if (currentStep === 3 && dir === 1) { addToCart(); showPage('cart'); }
}

function selectStyle(el) {
  el.closest('.style-options,.wrap-options')?.querySelectorAll('.style-opt,.wrap-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
}

function selectWrap(el) {
  document.querySelectorAll('.wrap-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  const txt = el.textContent;
  if (txt.includes('4.99')) { wrapCost = 4.99; document.getElementById('wrapPrice').textContent = '$4.99'; document.getElementById('wrapRow').style.display = ''; }
  else if (txt.includes('9.99')) { wrapCost = 9.99; document.getElementById('wrapPrice').textContent = '$9.99'; document.getElementById('wrapRow').style.display = ''; }
  else { wrapCost = 0; document.getElementById('wrapRow').style.display = 'none'; }
  updateTotal();
}

function updateTotal() {
  const base = 29.99 + wrapCost;
  document.getElementById('totalPrice').textContent = '$' + base.toFixed(2);
  document.querySelector('.preview-card .btn.btn-primary').textContent = '🛒 Thêm vào giỏ — $' + base.toFixed(2);
}

function updatePreview() {
  const main = document.getElementById('mainText')?.value || 'Happy Birthday!';
  const sub = document.getElementById('subText')?.value || '';
  const el = document.getElementById('previewText');
  if (el) el.innerHTML = main + (sub ? `<br><small style="font-weight:400;font-size:.8rem">${sub}</small>` : '');
}

function pickColor(el, hex) {
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  currentColor = hex;
  const d = document.getElementById('previewDisplay');
  if (d) d.style.background = `linear-gradient(135deg,${hex}22,${hex}44)`;
}

function fakeUpload() {
  const icon = document.getElementById('uploadIcon');
  icon.textContent = '⏳';
  setTimeout(() => { icon.textContent = '✅'; showToast('Ảnh đã được tải lên thành công!'); }, 1200);
}

// ============================================================
// PRODUCT DETAIL TABS
// ============================================================
function switchTab(n, btn) {
  document.querySelectorAll('.info-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.info-content').forEach(c => c.style.display = 'none');
  document.getElementById('tab-' + n).style.display = '';
}

// ============================================================
// CART FUNCTIONS
// ============================================================
function changeQty(delta, id) {
  const el = document.getElementById(id);
  let val = parseInt(el.textContent);
  val = Math.max(1, val + delta);
  el.textContent = val;
}

// ============================================================
// DASHBOARD NAVIGATION
// ============================================================
function dashNav(btn, tabId) {
  document.querySelectorAll('.sidebar-link').forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('[id^="dash-"]').forEach(t => t.style.display = 'none');
  document.getElementById(tabId).style.display = '';
}

// ============================================================
// ADMIN NAVIGATION
// ============================================================
function adminNav(btn) {
  document.querySelectorAll('.admin-sidebar-link').forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
}


// ============================================================
// SEARCH
// ============================================================
function handleSearch() {
  const query = document.getElementById('heroSearch').value.trim();
  if (query) {
    showToast(`Đang tìm kiếm "${query}"...`);
    // In a real app, you would redirect to search results page
    setTimeout(() => { window.location.href = 'shop.html'; }, 800);
  }
}

// ============================================================
// WISHLIST TOGGLE
// ============================================================
function toggleWish(btn) {
  btn.classList.toggle('active');
  showToast(btn.classList.contains('active') ? 'Đã thêm vào danh sách yêu thích' : 'Đã xóa khỏi danh sách yêu thích');
}

// ============================================================
// CART STATE
// ============================================================

function getCartKey() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      const name = u.username || u.email || 'guest';
      return `cart_${name}`;
    } catch (e) {
      console.error('Failed to parse user for cart key', e);
    }
  }
  return 'cart_guest';
}

// ============================================================
// CART HELPERS
// ============================================================
function getCart() {
  const key = getCartKey();
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
}

function saveCart(cart) {
  const key = getCartKey();
  localStorage.setItem(key, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => String(item.id) === String(product.id));
  if (existing) {
    existing.qty = (existing.qty || 0) + 1;
  } else {
    cart.push({
      ...product,
      qty: 1
    });
  }
  saveCart(cart);
  showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

function removeFromCart(id) {
  const cart = getCart().filter(item => String(item.id) !== String(id));
  saveCart(cart);
  renderCart(); // if on cart page
}

function updateCartQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find(i => String(i.id) === String(id));
  if (!item) return;
  item.qty = (item.qty || 0) + delta;
  if (item.qty <= 0) {
    // remove
    const newCart = cart.filter(i => String(i.id) !== String(id));
    saveCart(newCart);
  } else {
    saveCart(cart);
  }
  renderCart(); // if on cart page
}

// ============================================================
// CART RENDERING (for cart.html)
// ============================================================
async function renderCart() {
  let cart = getCart();
  const cartItemsContainer = document.querySelector('#cart-items');
  if (!cartItemsContainer) return; // not on cart page

  // Clear existing items
  cartItemsContainer.innerHTML = '';

  // If local cart is empty, try loading server-side orders for the current account
  if (cart.length === 0) {
    const userStr = localStorage.getItem('user');
    let userAcc = '';
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        userAcc = u.email || u.username || '';
      } catch (e) { /* ignore */ }
    }
    userAcc = userAcc || localStorage.getItem('email') || '';

    if (userAcc) {
      try {
        // Try server-enriched endpoint first
        const orderResp = await fetch(`${API_BASE}/orders/${encodeURIComponent(userAcc)}`);
        if (orderResp.ok) {
          const orderData = await orderResp.json();
          if (orderData && Array.isArray(orderData.products) && orderData.products.length) {
            cart = orderData.products.map(p => ({
              id: p.id,
              name: p.name,
              price: p.price,
              img: p.img,
              mota: p.mota,
              qty: p.quantity || 1
            }));
            // persist and use
            saveCart(cart);
          }
        } else {
          // fallback: read static orders.json and map with shop.json
          const resp = await fetch(`${API_BASE}/data/orders.json`);
          if (resp.ok) {
            const orders = await resp.json();
            const order = orders.find(o => (o.acc || '').toLowerCase() === (userAcc || '').toLowerCase());
            if (order && Array.isArray(order.products) && order.products.length) {
              const prodResp = await fetch(`${API_BASE}/data/shop.json`);
              if (prodResp.ok) {
                const shopData = await prodResp.json();
                const products = shopData.products || [];
                cart = order.products.map(p => {
                  const prod = products.find(x => String(x.id) === String(p.id));
                  return {
                    id: p.id,
                    name: prod ? (prod.TieuDe || prod.name || (`Sản phẩm #${p.id}`)) : (`Sản phẩm #${p.id}`),
                    price: prod ? prod.tien : 0,
                    img: prod ? prod.img : '',
                    mota: prod ? prod.MoTa || prod.MoTa : '',
                    qty: p.quantity || 1
                  };
                });
                saveCart(cart);
              }
            }
          }
        }
      } catch (e) {
        console.error('Failed to load orders from server', e);
      }
    }
  }

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-item" style="text-align:center; padding:40px; color:var(--text-muted);">
        Giỏ hàng của bạn trống<br>
        <a href="shop.html" class="btn btn-secondary" style="margin-top:16px;">Tiếp tục mua sắm</a>
      </div>
    `;
    updateCartTotals();
    return;
  }

  cart.forEach(item => {
  const itemId = item.id;
  const itemDiv = document.createElement('div');
  itemDiv.className = 'cart-item';
  const safeImg = item.img ? item.img.replace(/"/g, '&quot;') : '';
  const placeholder = 'https://via.placeholder.com/240x120?text=%F0%9F%8E%81';
  itemDiv.innerHTML = `
    <div class="cart-item-img">
      <img src="${safeImg}" alt="${item.name || ''}" onerror="this.onerror=null;this.src='${placeholder}';" style="width:100%;height:120px;object-fit:cover;border-radius:var(--radius);">
    </div>
    <div class="cart-item-info">
      <h3>${item.name || ''}</h3>
      <p>${item.mota || ''}</p>
      <div class="cart-item-meta">
        <div class="qty-control">
          <button class="qty-btn" onclick="updateCartQuantity('${itemId}', -1)">−</button>
          <span class="qty-val" id="qty-${itemId}">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQuantity('${itemId}', 1)">+</button>
        </div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <button class="cart-remove" onclick="removeFromCart('${itemId}')">×</button>
      </div>
    </div>
  `;
  cartItemsContainer.appendChild(itemDiv);
  });

  updateCartTotals();
}

function formatPrice(price) {
  if (typeof price === 'number') return price.toLocaleString('vi-VN') + 'đ';
  if (!price && price !== 0) return '';
  const n = parsePrice(price);
  return n ? n.toLocaleString('vi-VN') + 'đ' : String(price);
}

function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  const s = String(priceStr).replace(/[^\d.,-]/g, '').replace(/,/g, '.');
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function updateCartTotals() {
  const cart = getCart();
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += parsePrice(item.price) * item.qty;
  });
  const shipping = 0; // free shipping
  const discText = document.getElementById('discAmt')?.textContent || '';
  const discount = Math.abs(parsePrice(discText));
  const total = subtotal - discount;

  // Update summary
  const subtotalEl = document.querySelector('.summary-row:nth-child(1) span:last-child');
  const shippingEl = document.querySelector('.summary-row:nth-child(2) span:last-child');
  const totalEl = document.getElementById('cartTotal');
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = 'MIỄN PHÍ';
  if (totalEl) totalEl.textContent = formatPrice(total);

  // Update badge
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
  const badge = document.querySelector('.nav-actions .badge');
  if (badge) {
    badge.textContent = totalItems;
  }
  // Update cart page heading count if present
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    cartCountEl.textContent = `(${totalItems} món)`;
  }
}

// ============================================================
// ADD TO CART FROM BUTTON (used in shop.html)
// ============================================================
function addToCartFromButton(button) {
  const card = button.closest('.product-card');
  if (!card) return;
  const productId = card.dataset.productId;
  if (!productId) return;
  // Find product in global allProducts (set by shop.html)
  const product = window.allProducts?.find(p => p.id == productId);
  if (!product) {
    console.error('Product not found for id:', productId);
    return;
  }
  // Convert product to the format expected by addToCart
  // Ensure we have needed fields: id, name, price, img, mota
  const productForCart = {
    id: product.id,
    name: product.TieuDe || product.name || '',
    price: product.tien || '', // keep as string for display; parsePrice will handle
    img: product.img || '',
    mota: product.MoTa || ''
  };
  addToCart(productForCart);
}

// ============================================================
// COUPON APPLY
// ============================================================
function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  const discountRow = document.getElementById('discountRow');
  const discAmt = document.getElementById('discAmt');
  const cartTotal = document.getElementById('cartTotal');
  if (code === 'GIFT15') {
    const current = parsePrice(cartTotal.textContent);
    const discount = current * 0.15;
    discAmt.textContent = '−' + formatPrice(discount);
    discountRow.style.display = '';
    // update displayed total
    if (cartTotal) cartTotal.textContent = formatPrice(current - discount);
    showToast('Áp dụng mã giảm giá! Giảm 15%');
  } else {
    showToast('Mã giảm giá không hợp lệ');
  }
}

// ============================================================
// PAYMENT METHOD SELECT
// ============================================================
function selectPay(el) {
  document.querySelectorAll('.pay-method').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// ============================================================
// ADMIN CHART (simulated)
// ============================================================
function buildChart() {
  const chart = document.getElementById('revenueChart');
  const labels = document.getElementById('chartLabels');
  if (!chart || !labels) return;
  chart.innerHTML = '';
  labels.innerHTML = '';
  const data = [1200, 1900, 1500, 2200, 1800, 2500, 2100];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  data.forEach((value, i) => {
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = (value / 25) * 10 + 'px';
    chart.appendChild(bar);
    const label = document.createElement('div');
    label.className = 'chart-bar-label';
    label.textContent = months[i];
    labels.appendChild(label);
  });
}

// ============================================================
// AUTH CHECK
// ============================================================
function checkAuth() {
  const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const protectedPages = ['account.html'];
  const page = window.location.pathname.split('/').pop();
  if (protectedPages.includes(page) && !loggedIn) {
    window.location.href = 'login.html';
  }
}
document.addEventListener('DOMContentLoaded', checkAuth);