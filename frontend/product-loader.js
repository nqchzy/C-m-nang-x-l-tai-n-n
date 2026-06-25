// Product rendering utilities - shared between index.html and shop.html
const API_BASE = 'http://localhost:8000';

// Lưu toàn bộ danh sách sản phẩm để filter
window.allProducts = [];

function formatVND(number) {
    if (number === null || number === undefined || number === '') {
        return '0đ';
    }
    const num = Number(number);
    if (isNaN(num)) return '0đ';
    return num.toLocaleString('vi-VN') + 'đ';
}

function computeRatingValueAndCount(ratingObj) {
    let value = 0;
    let count = 0;
    if (!ratingObj) return {value, count};
    if (ratingObj && typeof ratingObj.stars === 'number' && ratingObj.count !== undefined) {
        value = ratingObj.stars;
        count = ratingObj.count;
    } else if (ratingObj && typeof ratingObj.stars === 'object' && ratingObj.stars !== null) {
        const stars = ratingObj.stars;
        let sum = 0, total = 0;
        for (const [starStr, cntStr] of Object.entries(stars)) {
            const s = parseInt(starStr), c = parseInt(cntStr);
            if (!isNaN(s) && !isNaN(c)) { sum += s * c; total += c; }
        }
        if (total > 0) { value = sum / total; count = total; }
    } else if (ratingObj && typeof ratingObj === 'object' && ratingObj !== null) {
        const stars = ratingObj;
        let sum = 0, total = 0;
        for (const [starStr, cntStr] of Object.entries(stars)) {
            const s = parseInt(starStr), c = parseInt(cntStr);
            if (!isNaN(s) && !isNaN(c)) { sum += s * c; total += c; }
        }
        if (total > 0) { value = sum / total; count = total; }
    } else if (typeof ratingObj === 'number') {
        value = ratingObj;
        count = 0;
    }
    return {value, count};
}

function renderStarsFromRating(ratingObj) {
    const {value} = computeRatingValueAndCount(ratingObj);
    const fullStars = Math.floor(value);
    const hasHalf = value - fullStars >= 0.5;
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) html += '<span class="star">★</span>';
        else if (i === fullStars + 1 && hasHalf) html += '<span class="star">⭐</span>';
        else html += '<span class="star">☆</span>';
    }
    return html;
}

function isImageUrl(url) {
    if (!url || typeof url !== 'string') return false;
    const lower = url.toLowerCase();
    return /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)(\?.*)?$/i.test(lower) || /^(https?:)?\/\//.test(lower);
}

function renderProductCard(product) {
    try {
        const bgStyle = product.bgStyle ? `style="background:${product.bgStyle}"` : '';
        const badgeClass = product.badge === 'bestseller' ? 'tag-bestseller'
                     : product.badge === 'new' ? 'tag-new'
                     : product.badge === 'sale' ? 'tag-sale'
                     : '';
        const badgeHtml = product.badge && product.badgeText
            ? `<span class="product-badge-tag ${badgeClass}">${product.badgeText}</span>`
            : '';

        let priceDisplay = product.tien;
        if (priceDisplay === null || priceDisplay === undefined || priceDisplay === '' || priceDisplay === 0) {
            priceDisplay = product.tienGoc;
        }
        const priceHtml = (product.tienGoc && product.tien && product.tienGoc !== product.tien)
            ? `<del>${formatVND(product.tienGoc)}</del>${formatVND(priceDisplay)}`
            : formatVND(priceDisplay || 0);

        let imageHtml = '';
        if (product.img && isImageUrl(product.img)) {
            imageHtml = `<img src="${product.img}" alt="${product.TieuDe || ''}" class="product-img" onerror="this.style.display='none'"/>`;
        } else {
            imageHtml = `<div class="img-placeholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f0f0;font-size:3rem">📦</div>`;
        }

        const {count} = computeRatingValueAndCount(product.rating);
        const starsHtml = renderStarsFromRating(product.rating);

        return `
            <div class="product-card" onclick="window.location.href='shop.html'" data-product-id="${product.id}">
                <div class="product-card-img" ${bgStyle}>
                    ${imageHtml}
                    ${badgeHtml}
                    <button class="wishlist-btn" onclick="event.stopPropagation();toggleWish(this)">♡</button>
                </div>
                <div class="product-card-body">
                    <h3>${product.TieuDe || 'Sản phẩm'}</h3>
                    <p>${product.MoTa || ''}</p>
                    <div class="stars">
                        ${starsHtml}
                        <span>(${count})</span>
                    </div>
                </div>
                <div class="product-meta" style="padding:0 20px 12px">
                    <div class="product-price">${priceHtml}</div>
                </div>
                <div class="product-card-footer">
                    <button class="btn-cart" onclick="event.stopPropagation();addToCartFromButton(this)">Thêm vào giỏ</button>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Error rendering product:', product, err);
        return '';
    }
}

function renderProducts(products) {
    const container = document.getElementById('productsGrid');
    if (!products || products.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;padding:40px">Không có sản phẩm nào trong danh mục này.</p>';
        return;
    }
    const isShopPage = window.location.pathname.includes('shop.html');
    const productsToShow = isShopPage ? products : products.slice(0, 4);
    container.innerHTML = productsToShow.map(renderProductCard).join('');
}

// Lấy category từ URL query string
function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || '';
}

// Map category slug sang tên hiển thị
const CATEGORY_LABELS = {
    'qua-tang-anh':   '🖼️ Quà tặng ảnh',
    'trang-suc':      '💍 Trang sức',
    'thoi-trang':     '👕 Thời trang',
    'do-uong':        '☕ Đồ uống',
    'trang-tri-nha':  '🕯️ Trang trí nhà',
    'hop-qua':        '📦 Hộp quà',
    'sach-nghe-thuat':'📚 Sách & Nghệ thuật',
    'do-bong-do-choi':'🧸 Đồ bông & Đồ chơi',
};

// Render thanh filter category (chỉ dùng trên shop.html)
function renderCategoryFilter(products, activeCategory) {
    const filterContainer = document.getElementById('categoryFilter');
    if (!filterContainer) return;

    // Lấy các category thực sự có sản phẩm
    const usedCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

    let html = `<button class="cat-filter-btn ${!activeCategory ? 'active' : ''}" onclick="filterByCategory('')">Tất cả</button>`;
    usedCategories.forEach(cat => {
        const label = CATEGORY_LABELS[cat] || cat;
        const isActive = activeCategory === cat;
        html += `<button class="cat-filter-btn ${isActive ? 'active' : ''}" onclick="filterByCategory('${cat}')">${label}</button>`;
    });
    filterContainer.innerHTML = html;
}

// Xử lý khi nhấn nút filter
window.filterByCategory = function(category) {
    // Cập nhật URL mà không reload trang
    const url = new URL(window.location.href);
    if (category) {
        url.searchParams.set('category', category);
    } else {
        url.searchParams.delete('category');
    }
    window.history.pushState({}, '', url.toString());

    // Lọc và render lại sản phẩm
    const filtered = category
        ? window.allProducts.filter(p => p.category === category)
        : window.allProducts;

    renderProducts(filtered);
    renderCategoryFilter(window.allProducts, category);
};

async function loadShopData() {
    const container = document.getElementById('productsGrid');
    if (!container) return;

    container.innerHTML = '<p style="text-align:center;grid-column:1/-1;padding:40px;color:var(--text-muted);">🔄 Đang tải sản phẩm...</p>';

    try {
        const response = await fetch(`${API_BASE}/data/shop.json`);
        if (!response.ok) throw new Error('Không thể tải dữ liệu shop');
        const data = await response.json();
        window.allProducts = data.products || [];

        const isShopPage = window.location.pathname.includes('shop.html');
        if (isShopPage) {
            const activeCategory = getCategoryFromURL();
            renderCategoryFilter(window.allProducts, activeCategory);

            const filtered = activeCategory
                ? window.allProducts.filter(p => p.category === activeCategory)
                : window.allProducts;

            renderProducts(filtered);
        } else {
            renderProducts(window.allProducts);
        }
    } catch (error) {
        console.error('Lỗi tải dữ liệu shop:', error);
        container.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:#e74c3c;padding:40px">⚠️ Không thể kết nối đến server. Vui lòng thử lại sau.</p>';
    }
}