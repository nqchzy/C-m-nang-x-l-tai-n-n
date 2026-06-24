// ============================================================
// STATE
// ============================================================
let currentStep = 0;
let currentColor = '#7C3AED';
let wrapCost = 0;
let darkMode = false;
let chatOpen = false;
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
// CHAT TOGGLE
// ============================================================
function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chatWindow').classList.toggle('open', chatOpen);
}

// ============================================================
// SEND CHAT MESSAGE
// ============================================================
function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  const container = document.getElementById('chatMessages');
  container.innerHTML += `<div class="chat-msg user">${msg}</div>`;
  input.value = '';
  setTimeout(() => {
    container.innerHTML += `<div class="chat-msg bot">Cảm ơn! Tôi sẽ giúp bạn tìm món quà hoàn hảo. Dịp nào đó?</div>`;
    container.scrollTop = container.scrollHeight;
  }, 500);
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
// ADD TO CART
// ============================================================
function addToCart() {
  showToast('Sản phẩm đã được thêm vào giỏ hàng!');
  // Update cart badge (simplified)
  const badge = document.querySelector('.nav-actions .badge');
  if (badge) {
    let count = parseInt(badge.textContent);
    badge.textContent = count + 1;
  }
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
    const current = parseFloat(cartTotal.textContent.replace('$', ''));
    const discount = current * 0.15;
    discAmt.textContent = '−$' + discount.toFixed(2);
    discountRow.style.display = '';
    cartTotal.textContent = '$' + (current - discount).toFixed(2);
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