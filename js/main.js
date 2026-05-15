/**
 * CẨM NANG SƠ CỨU - MAIN JAVASCRIPT
 * Website động sử dụng HTML5, CSS3, JS, Bootstrap 5
 */

// ════════════════════════════════════════════════════════════════
// PAGE TRANSITION ANIMATIONS
// ════════════════════════════════════════════════════════════════

/**
 * Initialize page transition animations
 */
function initPageTransitions() {
  // Add fade-in animation to main content
  const main = document.querySelector('main');
  if (main) {
    main.style.opacity = '0';
    main.style.transform = 'translateY(20px)';

    setTimeout(() => {
      main.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      main.style.opacity = '1';
      main.style.transform = 'translateY(0)';
    }, 100);
  }

  // Animate elements with animate.css classes
  const animatedElements = document.querySelectorAll('.animate__animated');
  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    const delay = el.style.animationDelay || '0s';
    const delayMs = parseFloat(delay) * 1000;

    setTimeout(() => {
      el.style.opacity = '1';
    }, delayMs);
  });
}

/**
 * Handle page navigation with transition
 */
function handlePageNavigation() {
  // Add transition class to body when navigating
  document.body.classList.add('page-transitioning');

  // Remove transition class after animation completes
  setTimeout(() => {
    document.body.classList.remove('page-transitioning');
  }, 600);
}

// ════════════════════════════════════════════════════════════════
// ACCORDION / TOGGLE FUNCTIONALITY
// ════════════════════════════════════════════════════════════════

/**
 * Scrolls to and opens a specific accordion card
 * @param {string} id - Card element ID
 */
function openCard(id) {
  try {
    const card = document.getElementById(id);

    if (!card) {
      console.warn(`Card with ID '${id}' not found`);
      return;
    }

    // Find the collapse element
    const collapse = card.querySelector('.accordion-collapse');
    const button = card.querySelector('.accordion-button');

    if (!collapse || !button) {
      console.warn('Collapse or button element not found');
      return;
    }

    // Scroll to card with smooth behavior
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Open accordion after scroll completes
    setTimeout(() => {
      if (!collapse.classList.contains('show')) {
        // Use Bootstrap's collapse API
        const bsCollapse = new bootstrap.Collapse(collapse, {
          toggle: true
        });
      }
    }, 400);
  } catch (error) {
    console.error('Error opening card:', error);
  }
}

// ════════════════════════════════════════════════════════════════
// SCROLL REVEAL ANIMATION
// ════════════════════════════════════════════════════════════════

/**
 * Initializes Intersection Observer for scroll reveal animation
 * Elements with .reveal class fade in when scrolled into view
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length === 0) {
    console.log('No reveal elements found');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  reveals.forEach(el => observer.observe(el));
}

// ════════════════════════════════════════════════════════════════
// KIT ITEMS STAGGER ANIMATION
// ════════════════════════════════════════════════════════════════

/**
 * Adds staggered animation delay to kit items
 */
function initKitItemsAnimation() {
  const kitItems = document.querySelectorAll('.kit-item');

  kitItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.05}s`;
  });
}

// ════════════════════════════════════════════════════════════════
// PRINT FUNCTIONALITY
// ════════════════════════════════════════════════════════════════

/**
 * Handles print action with error handling
 */
function handlePrint() {
  try {
    window.print();
  } catch (error) {
    console.error('Print failed:', error);
    alert('Không thể in tài liệu. Vui lòng thử lại.');
  }
}

// ════════════════════════════════════════════════════════════════
// ACTIVE NAV LINK ON SCROLL
// ════════════════════════════════════════════════════════════════

/**
 * Updates active navigation link based on scroll position
 */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

// ════════════════════════════════════════════════════════════════
// SMOOTH SCROLL FOR NAV LINKS
// ════════════════════════════════════════════════════════════════

/**
 * Enables smooth scrolling for all anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#home') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
      }
    });
  });
}

// ════════════════════════════════════════════════════════════════
// EMERGENCY BUTTON PULSE ANIMATION
// ════════════════════════════════════════════════════════════════

/**
 * Adds pulse animation to emergency buttons
 */
function initEmergencyPulse() {
  const emergencyBtns = document.querySelectorAll('.btn-danger[href="tel:115"]');

  emergencyBtns.forEach(btn => {
    btn.style.animation = 'pulse-red 2s infinite';
  });
}

// ════════════════════════════════════════════════════════════════
// CARD HOVER EFFECTS
// ════════════════════════════════════════════════════════════════

/**
 * Initialize card hover effects
 */
function initCardHoverEffects() {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

// ════════════════════════════════════════════════════════════════
// BUTTON RIPPLE EFFECT
// ════════════════════════════════════════════════════════════════

/**
 * Initialize button ripple effect
 */
function initButtonRippleEffect() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: 100px;
        height: 100px;
        margin-left: -50px;
        margin-top: -50px;
      `;

      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// ══════════════════════════════════════════════════════════════════
// QUICK SEARCH FUNCTIONALITY
// ═════════════════════════════════════════════════════════════════

/**
 * Initialize quick search functionality
 */
function initQuickSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');

  if (!searchInput || !searchButton) return;

  // Define searchable content
  const searchableContent = [
    { title: 'Hướng Dẫn Sơ Cứu', url: '../pages/huong-dan.html', keywords: ['sơ cứu', 'hướng dẫn', 'tai nạn', 'cấp cứu'] },
    { title: 'Hồi Sức CPR', url: '../pages/cpr.html', keywords: ['cpr', 'hồi sức', 'ép tim', 'hô hấp'] },
    { title: 'Lưu Ý Quan Trọng', url: '../pages/nen-khong-nen.html', keywords: ['lưu ý', 'nên', 'không nên', 'sơ cứu'] },
    { title: 'Bộ Kit Sơ Cứu', url: '../pages/bo-kit.html', keywords: ['bộ kit', 'sơ cứu', 'dụng cụ', 'thuốc'] },
    { title: 'Ngừng tim - CPR khẩn cấp', url: '../pages/huong-dan.html#ngung-tim', keywords: ['ngừng tim', 'cpr', 'khẩn cấp', 'ép tim'] },
    { title: 'Bỏng nhiệt / hóa chất', url: '../pages/huong-dan.html#bong', keywords: ['bỏng', 'nhiệt', 'hóa chất', 'laze'] },
    { title: 'Gãy xương - Cố định tạm thời', url: '../pages/huong-dan.html#gay-xuong', keywords: ['gãy xương', 'cố định', 'xương', 'thoái vị'] },
    { title: 'Điện giật - Tách nguồn điện', url: '../pages/huong-dan.html#dien-giat', keywords: ['điện giật', 'tách nguồn', 'điện', 'sập'] },
    { title: 'Dị vật đường thở - Nghiệm pháp Heimlich', url: '../pages/huong-dan.html#di-vat', keywords: ['dị vật', 'đường thở', 'heimlich', 'ngạt'] },
    { title: 'Chảy máu nặng - Cầm máu khẩn cấp', url: '../pages/huong-dan.html#xuat-huyet', keywords: ['chảy máu', 'cầm máu', 'xuất huyết', 'băng'] },
    { title: 'Đuối nước - Cứu nạn & hồi sức', url: '../pages/huong-dan.html#duoi-nuoc', keywords: ['đuối nước', 'cứu nạn', 'nước', 'hô hấp'] },
    { title: 'Ngộ độc - Thực phẩm / hóa chất', url: '../pages/huong-dan.html#ngo-doc', keywords: ['ngộ độc', 'thực phẩm', 'hóa chất', 'niềm'] },
    { title: 'Sốc phản vệ - Dị ứng nặng', url: '../pages/huong-dan.html#collapseSocPhanVe', keywords: ['sốc phản vệ', 'dị ứng', 'epipen', 'côn trùng'] },
    { title: 'Đột quỵ - Stroke Test FAST', url: '../pages/huong-dan.html#collapseDotQuy', keywords: ['đột quỵ', 'stroke', 'fast test', 'mặt'] },
    { title: 'Rắn cắn & côn trùng đốt', url: '../pages/huong-dan.html#collapseRanCan', keywords: ['rắn cắn', 'côn trùng', 'nọc độc', 'đốt'] },
    { title: 'Say nắng & kiệt sức nhiệt', url: '../pages/huong-dan.html#collapseSayNang', keywords: ['say nắng', 'kiệt sức', 'nhiệt độ', 'nóng'] }
  ];

  // Perform search
  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();

    // Clear previous results
    clearSearchResults();

    if (query.length < 2) {
      showSearchHelper();
      return;
    }

    // Search through content
    const results = searchableContent.filter(item => {
      return item.title.toLowerCase().includes(query) ||
             item.keywords.some(keyword => keyword.toLowerCase().includes(query));
    });

    // Display results
    if (results.length > 0) {
      displaySearchResults(results, query);
    } else {
      showNoResults();
    }
  }

  // Display search results
  function displaySearchResults(results, query) {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results position-absolute w-100';
    resultsContainer.style.zIndex = '1050';
    resultsContainer.style.backgroundColor = 'white';
    resultsContainer.style.border = '1px solid #ddd';
    resultsContainer.style.borderRadius = '8px';
    resultsContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    resultsContainer.style.maxHeight = '300px';
    resultsContainer.style.overflowY = 'auto';
    resultsContainer.style.marginTop = '5px';
    resultsContainer.style.top = '100%';
    resultsContainer.style.left = '0';

    const header = document.createElement('div');
    header.className = 'p-3 border-bottom';
    header.innerHTML = `<h6 class="mb-0 text-danger">Tìm thấy ${results.length} kết quả cho "${query}"</h6>`;
    resultsContainer.appendChild(header);

    const list = document.createElement('div');
    list.className = 'p-3';

    results.forEach(result => {
      const item = document.createElement('a');
      item.href = result.url;
      item.className = 'd-block p-2 mb-2 text-decoration-none border rounded';
      item.style.backgroundColor = '#f8f9fa';
      item.style.cursor = 'pointer';
      item.innerHTML = `
        <div class="fw-bold">${result.title}</div>
        <small class="text-muted">${getUrlDescription(result.url)}</small>
      `;
      list.appendChild(item);
    });

    resultsContainer.appendChild(list);

    // Append to input group parent
    const searchContainer = searchInput.closest('.input-group') || searchInput.parentNode;
    searchContainer.parentNode.appendChild(resultsContainer);
  }

  // Get description based on URL
  function getUrlDescription(url) {
    const descriptions = {
      'pages/huong-dan.html': 'Hướng dẫn chi tiết xử lý 12+ tình huống tai nạn',
      'pages/cpr.html': 'Kỹ thuật hồi sức CPR từng bước',
      'pages/nen-khong-nen.html': 'Những việc nên và không nên làm khi sơ cứu',
      'pages/bo-kit.html': 'Danh sách dụng cụ thiết yếu trong bộ sơ cứu'
    };
    return descriptions[url] || 'Trang tài liệu sơ cứu';
  }

  // Clear search results
  function clearSearchResults() {
    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
      existingResults.remove();
    }
    const existingHelper = document.querySelector('.search-helper');
    if (existingHelper) {
      existingHelper.remove();
    }
    const existingNoResults = document.querySelector('.search-no-results');
    if (existingNoResults) {
      existingNoResults.remove();
    }
  }

  // Show search helper text
  function showSearchHelper() {
    clearSearchResults();
    const helper = document.createElement('div');
    helper.className = 'search-helper text-muted fst-italic p-3';
    helper.innerHTML = 'Nhập từ khóa tìm kiếm (ít nhất 2 ký tự)...';
    const searchItem = searchInput.closest('.nav-item');
    if (searchItem) {
      searchItem.appendChild(helper);
    } else {
      searchInput.parentNode.appendChild(helper);
    }
  }

  // Show no results
  function showNoResults() {
    clearSearchResults();
    const noResults = document.createElement('div');
    noResults.className = 'search-no-results text-muted p-3';
    noResults.innerHTML = 'Không tìm thấy kết quả phù hợp.';
    const searchItem = searchInput.closest('.nav-item');
    if (searchItem) {
      searchItem.appendChild(noResults);
    } else {
      searchInput.parentNode.appendChild(noResults);
    }
  }

  // Event listeners
  searchButton.addEventListener('click', performSearch);

  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });

  // Track if input has been focused at least once
  let hasBeenFocused = false;

  // Hide helper when input gains focus
  searchInput.addEventListener('focus', function() {
    hasBeenFocused = true;
    const existingHelper = document.querySelector('.search-helper');
    if (existingHelper) {
      existingHelper.remove();
    }
  });

  // Show helper when input is empty and loses focus (only if has been focused)
  searchInput.addEventListener('blur', function() {
    const value = searchInput.value.trim();
    if (hasBeenFocused && value.length < 2) {
      clearSearchResults();
      showSearchHelper();
    }
  });

  // Hide results when clicking elsewhere (only show helper if input has been focused)
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchButton.contains(e.target)) {
      clearSearchResults();
      const value = searchInput.value.trim();
      if (hasBeenFocused && value.length < 2) {
        showSearchHelper();
      }
    }
  });

  // Do NOT initialize with helper text - wait for user interaction
}

// ════════════════════════════════════════════════════════════════
// COUNTER ANIMATION
// ════════════════════════════════════════════════════════════════

/**
 * Animate counter numbers
 * @param {HTMLElement} element - Counter element
 * @param {number} target - Target number
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
}

/**
 * Initialize all counter animations
 */
function initCounters() {
  const counters = document.querySelectorAll('.counter');

  counters.forEach(counter => {
    const target = parseInt(counter.textContent);
    animateCounter(counter, target);
  });
}

// ════════════════════════════════════════════════════════════════
// EVENT LISTENERS & INITIALIZATION
// ════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing Cẩm Nang Sơ Cứu...');

  try {
    // Initialize page transitions
    initPageTransitions();

    // Initialize all features
    initScrollReveal();
    initKitItemsAnimation();
    initActiveNavOnScroll();
    initSmoothScroll();
    initEmergencyPulse();
    initCardHoverEffects();
    initButtonRippleEffect();
    initCounters();
    initQuickSearch(); // Initialize quick search

    // Handle hash navigation for accordion sections
    handleHashNavigation();

    console.log('✅ Page initialized successfully');
  } catch (error) {
    console.error('❌ Initialization failed:', error);
  }
});

// Handle hash navigation for accordion sections
function handleHashNavigation() {
  const hash = window.location.hash;
  if (hash) {
    // Remove the # prefix
    const sectionId = hash.substring(1);

    // Check if it's an accordion section
    const accordionItem = document.getElementById(sectionId);
    if (accordionItem && accordionItem.classList.contains('accordion-item')) {
      // Open the accordion card
      openCard(sectionId);

      // Update active nav link based on hash
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash) {
          link.classList.add('active');
        }
      });
    }
  }

  // Also handle hash changes (for SPA-like behavior)
  window.addEventListener('hashchange', handleHashNavigation);
}

// ════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ════════════════════════════════════════════════════════════════

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format phone number for display
 * @param {string} phone - Phone number string
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(phone) {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
  if (match) {
    return match[1] + ' ' + match[2] + ' ' + match[3];
  }
  return phone;
}

/**
 * Get current time in Vietnamese format
 * @returns {string} Formatted time string
 */
function getCurrentTimeVN() {
  const now = new Date();
  return now.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// ════════════════════════════════════════════════════════════════
// KEYBOARD NAVIGATION
// ════════════════════════════════════════════════════════════════

/**
 * Handle keyboard navigation for accessibility
 */
document.addEventListener('keydown', (e) => {
  // ESC key closes mobile menu
  if (e.key === 'Escape') {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  }
});

// ════════════════════════════════════════════════════════════════
// DYNAMIC CONTENT LOADING (Future Enhancement)
// ════════════════════════════════════════════════════════════════

/**
 * Load emergency hotlines dynamically
 * Can be extended to fetch from API
 */
function loadEmergencyHotlines() {
  const hotlines = [
    { name: 'Cấp cứu y tế', number: '115', icon: 'bi-ambulance' },
    { name: 'Cứu hỏa', number: '114', icon: 'bi-fire' },
    { name: 'Công an', number: '113', icon: 'bi-shield-check' },
    { name: 'Tìm kiếm cứu nạn', number: '112', icon: 'bi-life-preserver' }
  ];

  // This can be used to dynamically populate the emergency bar
  // Currently implemented statically in HTML for simplicity
  console.log('Emergency hotlines loaded:', hotlines);
}

// Load hotlines on init
loadEmergencyHotlines();
