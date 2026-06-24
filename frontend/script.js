// ============================================================
// STATE
// ============================================================
let currentStep = 0;
let currentColor = '#7C3AED';
let wrapCost = 0;
let darkMode = false;
let chatOpen = false;
let currentQty = 1;
let isLoggedIn = localStorage.getItem('giftifyUser') !== null;
let originalAccountHTML = '';

// ============================================================
// AUTHENTICATION
// ============================================================
function getCurrentUser() {
  return localStorage.getItem('giftifyUser');
}
function setCurrentUser(username) {
  localStorage.setItem('giftifyUser', username);
  isLoggedIn = true;
}
function clearUser() {
  localStorage.removeItem('giftifyUser');
  isLoggedIn = false;
}
async function registerUser(username, password) {
  try {
    const response = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Registration failed');
    setCurrentUser(username);
    showToast('Registration successful!');
    renderAccountPage();
  } catch (err) {
    showToast('Error: ' + err.message);
  }
}
async function loginUser(username, password) {
  try {
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Login failed');
    setCurrentUser(username);
    showToast('Login successful!');
    renderAccountPage();
  } catch (err) {
    showToast('Error: ' + err.message);
  }
}
function logout() {
  clearUser();
  renderAccountPage();
  showToast('Logged out');
}
function renderAccountPage() {
  const contentDiv = document.getElementById('account-content');
  if (!contentDiv) return;
  if (getCurrentUser()) {
    // Show dashboard (original content)
    contentDiv.innerHTML = originalAccountHTML;
    // Re-initialize any JS that depends on DOM elements inside dashboard
    // For simplicity, we rely on inline event handlers; they remain.
  } else {
    // Show login/register forms
    contentDiv.innerHTML = `
      <div class="auth-box">
        <div class="auth-tabs">
          <div class="tab active" onclick="switchAuthTab(0,this)">Login</div>
          <div class="tab" onclick="switchAuthTab(1,this)">Register</div>
        </div>
        <div class="auth-tab-content" id="auth-tab-0">
          <h3>Login to Your Account</h3>
          <div class="form-group">
            <label>Username</label>
            <input type="text" id="loginUsername" placeholder="Enter username"/>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="loginPassword" placeholder="Enter password"/>
          </div>
          <button class="btn btn-primary" onclick="handleLogin()">Login</button>
          <p class="toggle-link" onclick="switchAuthTab(1,this.parentNode.parentNode.querySelector('.auth-tabs .tab'))">Don't have an account? Register</p>
        </div>
        <div class="auth-tab-content" id="auth-tab-1" style="display:none;">
          <h3>Create New Account</h3>
          <div class="form-group">
            <label>Username</label>
            <input type="text" id="regUsername" placeholder="Choose username"/>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="regPassword" placeholder="Choose password"/>
          </div>
          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" id="regConfirmPassword" placeholder="Confirm password"/>
          </div>
          <button class="btn btn-primary" onclick="handleRegister()">Register</button>
          <p class="toggle-link" onclick="switchAuthTab(0,this.parentNode.parentNode.querySelector('.auth-tabs .tab'))">Already have an account? Login</p>
        </div>
      </div>
    `;
    addAuthStyles();
  }
}
function switchAuthTab(index, tabElement) {
  document.querySelectorAll('.auth-tabs .tab').forEach((t,i)=>{
    t.classList.toggle('active', i===index);
  });
  document.querySelectorAll('.auth-tab-content').forEach((c,i)=>{
    c.style.display = i===index ? 'block' : 'none';
  });
}
async function handleLogin() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  if (!username || !password) {
    showToast('Please enter both username and password');
    return;
  }
  await loginUser(username, password);
}
async function handleRegister() {
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const confirm = document.getElementById('regConfirmPassword').value.trim();
  if (!username || !password || !confirm) {
    showToast('Please fill all fields');
    return;
  }
  if (password !== confirm) {
    showToast('Passwords do not match');
    return;
  }
  await registerUser(username, password);
}
function addAuthStyles() {
  let style = document.getElementById('auth-styles');
  if (style) return;
  style = document.createElement('style');
  style.id = 'auth-styles';
  style.textContent = `
    .auth-box {
      max-width: 400px;
      margin: 40px auto;
      padding: 20px;
      background: var(--surface);
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .auth-tabs {
      display: flex;
      border-bottom: 1px solid var(--border);
      margin-bottom: 20px;
    }
    .auth-tabs .tab {
      padding: 10px 20px;
      cursor: pointer;
      border: none;
      background: transparent;
      font-size: 1rem;
      color: var(--text-light);
      position: relative;
    }
    .auth-tabs .tab.active {
      color: var(--purple);
      font-weight: 600;
    }
    .auth-tabs .tab.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--purple);
    }
    .auth-tab-content {
      display: none;
    }
    .auth-tab-content.active {
      display: block;
    }
    .form-group {
      margin-bottom: 16px;
    }
    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
      color: var(--text);
    }
    .form-group input {
      width: 100%;
      padding: 10px;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      font-size: 1rem;
      background: var(--background);
      color: var(--text);
    }
    .form-group input:focus {
      outline: none;
      border-color: var(--purple);
    }
    .btn-primary {
      width: 100%;
      padding: 12px;
      background: var(--purple);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-size: 1rem;
      cursor: pointer;
    }
    .btn-primary:hover {
      background: var(--purple-dark, #5b21b6);
    }
    .toggle-link {
      display: block;
      text-align: center;
      margin-top: 12px;
      color: var(--purple);
      cursor: pointer;
      font-size: 0.9rem;
    }
  `;
  document.head.appendChild(style);
}
// ============================================================
// SPA NAVIGATION
// ============================================================
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  window.scrollTo(0,0);
  if(id==='admin') document.getElementById('revenueChart') && buildChart();
  if(id==='account') renderAccountPage();
}
// ============================================================
// DARK MODE
// ============================================================
function toggleDark(){
  darkMode=!darkMode;
  document.body.classList.toggle('dark-mode',darkMode);
  document.querySelector('[onclick="toggleDark()"]').textContent=darkMode?'☀️':'🌙';
  showToast(darkMode?'Dark mode on 🌙':'Light mode on ☀️');
}
// ============================================================
// MOBILE MENU
// ============================================================
function toggleMobile(){
  document.getElementById('mobileMenu').classList.toggle('open');
}
// ============================================================
// NAVBAR SCROLL
// ============================================================
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>40);
  document.getElementById('scrollTop').classList.toggle('visible',window.scrollY>400);
});
// ============================================================
// CUSTOMIZE PAGE
// ============================================================
function setStep(n,btn){
  currentStep=n;
  document.querySelectorAll('.step-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  for(let i=0;i<4;i++) document.getElementById('c-step-'+i).style.display=i===n?'block':'none';
  document.getElementById('prevBtn').style.display=n>0?'':'none';
  document.getElementById('nextBtn').textContent=n===3?'Add to Cart 🛒':'Continue →';
}
function stepNav(dir){
  const tabs=document.querySelectorAll('.step-tab');
  const next=Math.max(0,Math.min(3,currentStep+dir));
  setStep(next,tabs[next]);
  if(currentStep===3&&dir===1){addToCart();showPage('cart');}
}
function selectStyle(el){
  el.closest('.style-options,.wrap-options')?.querySelectorAll('.style-opt,.wrap-opt').forEach(o=>o.classList.remove('active'));
  el.classList.add('active');
}
function selectWrap(el){
  document.querySelectorAll('.wrap-opt').forEach(o=>o.classList.remove('active'));
  el.classList.add('active');
  const txt=el.textContent;
  if(txt.includes('4.99')){wrapCost=4.99;document.getElementById('wrapPrice').textContent='$4.99';document.getElementById('wrapRow').style.display='';}
  else if(txt.includes('9.99')){wrapCost=9.99;document.getElementById('wrapPrice').textContent='$9.99';document.getElementById('wrapRow').style.display='';}
  else{wrapCost=0;document.getElementById('wrapRow').style.display='none';}
  updateTotal();
}
function updateTotal(){
  const base=29.99+wrapCost;
  document.getElementById('totalPrice').textContent='$'+base.toFixed(2);
  document.querySelector('.preview-card .btn.btn-primary').textContent='🛒 Add to Cart — $'+base.toFixed(2);
}
function updatePreview(){
  const main=document.getElementById('mainText')?.value||'Happy Birthday!';
  const sub=document.getElementById('subText')?.value||'';
  const el=document.getElementById('previewText');
  if(el) el.innerHTML=main+(sub?`<br><small style="font-weight:400;font-size:.8rem">${sub}</small>`:'');
}
function pickColor(el,hex){
  document.querySelectorAll('.color-swatch').forEach(s=>s.classList.remove('selected'));
  el.classList.add('selected');
  currentColor=hex;
  const d=document.getElementById('previewDisplay');
  if(d) d.style.background=`linear-gradient(135deg,${hex}22,${hex}44)`;
}
function fakeUpload(){
  const icon=document.getElementById('uploadIcon');
  icon.textContent='⏳';
  setTimeout(()=>{icon.textContent='✅';showToast('Photo uploaded successfully!');},1200);
}
// ============================================================
// PRODUCT DETAIL TABS
// ============================================================
function switchTab(n,btn){
  document.querySelectorAll('.info-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  for(let i=0;i<4;i++){const el=document.getElementById('tab-'+i);if(el)el.style.display=i===n?'block':'none';}
}
// ============================================================
// CART / WISHLIST
// ============================================================
function addToCart(){
  const badge=document.querySelector('.badge');
  if(badge){const n=parseInt(badge.textContent)+1;badge.textContent=n;}
  showToast('🎁 Added to cart!');
}
function toggleWish(btn){
  btn.classList.toggle('active');
  btn.textContent=btn.classList.contains('active')?'♥':'♡';
  showToast(btn.classList.contains('active')?'💝 Added to wishlist!':'Removed from wishlist');
}
function changeQty(delta,id){
  const el=document.getElementById(id||'qtyVal');
  if(!el)return;
  const val=Math.max(1,parseInt(el.textContent)+delta);
  el.textContent=val;
}
function applyCoupon(){
  const v=document.getElementById('couponInput').value.trim().toUpperCase();
  if(v==='GIFT15'||v==='BDAY20'){
    const disc=v==='BDAY20'?32.99:24.74;
    document.getElementById('discountRow').style.display='';
    document.getElementById('discAmt').textContent='-$'+disc.toFixed(2);
    document.getElementById('cartTotal').textContent='$'+(164.96-disc).toFixed(2);
    showToast('✅ Coupon applied! You saved $'+disc.toFixed(2));
  }else{showToast('❌ Invalid coupon code');}
}
function selectPay(el){
  document.querySelectorAll('.pay-method').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
}
// ============================================================
// ACCOUNT DASHBOARD
// ============================================================
function dashNav(btn,sectionId){
  document.querySelectorAll('.sidebar-link').forEach(l=>l.classList.remove('active'));
  btn.classList.add('active');
  ['dash-home','dash-orders','dash-designs','dash-wishlist','dash-tracking','dash-settings'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.style.display=id===sectionId?'block':'none';
  });
}
// ============================================================
// ADMIN
// ============================================================
function adminNav(btn){
  document.querySelectorAll('.admin-sidebar-link').forEach(l=>l.classList.remove('active'));
  btn.classList.add('active');
}
function buildChart(){
  const data=[28,35,42,31,48,62,55,70,58,75,82,65];
  const months=['J','F','M','A','M','J','J','A','S','O','N','D'];
  const max=Math.max(...data);
  const container=document.getElementById('revenueChart');
  if(!container||container.children.length>0)return;
  data.forEach((v,i)=>{
    const wrap=document.createElement('div');wrap.className='chart-bar-wrap';
    const bar=document.createElement('div');bar.className='chart-bar';
    bar.style.height='0px';bar.title='$'+v+'k';
    setTimeout(()=>{bar.style.height=Math.round((v/max)*140)+'px';},i*50+100);
    const lbl=document.createElement('div');lbl.className='chart-bar-label';lbl.textContent=months[i];
    wrap.appendChild(bar);wrap.appendChild(lbl);container.appendChild(wrap);
  });
}
// ============================================================
// OCCASIONS FILTER
// ============================================================
function filterOcc(el){
  document.querySelectorAll('.occ-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  showToast('Filtering by: '+el.textContent.trim());
}
// ============================================================
// CHAT
// ============================================================
function toggleChat(){
  chatOpen=!chatOpen;
  document.getElementById('chatWindow').classList.toggle('open',chatOpen);
}
const botReplies=[
  "Great choice! I'd recommend our Custom Photo Mug — it's our most-loved personalized gift 🎁",
  "For that occasion, our Engraved Necklace is perfect. Over 140 five-star reviews! ✨",
  "I can help you find the ideal gift! Tell me more about the recipient — age, interests?",
  "Absolutely! You can customize that fully with text, colors, and wrapping. Want to try our customizer?",
  "Our standard delivery takes 3–5 days, or express next-day for $9.99. 🚀"
];
function sendChat(){
  const input=document.getElementById('chatInput');
  const msg=input.value.trim();
  if(!msg)return;
  const msgs=document.getElementById('chatMessages');
  msgs.innerHTML+=`<div class="chat-msg user">${msg}</div>`;
  input.value='';
  msgs.scrollTop=msgs.scrollHeight;
  setTimeout(()=>{
    const reply=botReplies[Math.floor(Math.random()*botReplies.length)];
    msgs.innerHTML+=`<div class="chat-msg bot">${reply}</div>`;
    msgs.scrollTop=msgs.scrollHeight;
  },800);
}
// ============================================================
// SEARCH
// ============================================================
function handleSearch(){
  const q=document.getElementById('heroSearch').value.trim();
  if(q){showPage('occasions');showToast('Showing results for: "'+q+'"');}
}
// ============================================================
// NEWSLETTER
// ============================================================
function subscribe(){
  showToast('🎉 Welcome! 15% off code sent to your inbox!');
}
// ============================================================
// TOAST
// ============================================================
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2800);
}
// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded',()=>{
  // Save original account content for later restoration
  const acc = document.getElementById('account-content');
  if (acc) originalAccountHTML = acc.innerHTML;
  // Stagger product card appearance
  const cards=document.querySelectorAll('.product-card,.category-card,.occasion-card,.testimonial-card');
  const obs=new IntersectionObserver((entries)=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>{e.target.style.opacity='1';e.target.style.transform='translateY(0)';},i*60);
        obs.unobserve(e.target);
      }
    });
  },{threshold:.1});
  cards.forEach(c=>{c.style.opacity='0';c.style.transform='translateY(20px)';c.style.transition='opacity .4s ease, transform .4s ease';obs.observe(c);});
});