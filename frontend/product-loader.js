// Product rendering utilities - shared between index.html and shop.html
const API_BASE = 'http://localhost:8000';

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
    // Case 1: rating.stars is a number (average) and rating.count exists
    if (ratingObj && typeof ratingObj.stars === 'number' && ratingObj.count !== undefined) {
        value = ratingObj.stars;
        count = ratingObj.count;
    }
    // Case 2: rating.stars is an object mapping star -> count (nested form)
    else if (ratingObj && typeof ratingObj.stars === 'object' && ratingObj.stars !== null) {
        const stars = ratingObj.stars;
        let sum = 0;
        let total = 0;
        for (const [starStr, cntStr] of Object.entries(stars)) {
            const s = parseInt(starStr);
            const c = parseInt(cntStr);
            if (!isNaN(s) && !isNaN(c)) {
                sum += s * c;
                total += c;
            }
        }
        if (total > 0) {
            value = sum / total;
            count = total;
        }
    }
    // Case 3: ratingObj itself is an object mapping star -> count (flat form)
    else if (ratingObj && typeof ratingObj === 'object' && ratingObj !== null) {
        const stars = ratingObj;
        let sum = 0;
        let total = 0;
        for (const [starStr, cntStr] of Object.entries(stars)) {
            const s = parseInt(starStr);
            const c = parseInt(cntStr);
            if (!isNaN(s) && !isNaN(c)) {
                sum += s * c;
                total += c;
            }
        }
        if (total > 0) {
            value = sum / total;
            count = total;
        }
    }
    // fallback: maybe rating is just a number?
    else if (typeof ratingObj === 'number') {
        value = ratingObj;
        count = 0; // unknown
    }
    return {value, count};
}

function renderStarsFromRating(ratingObj) {
    const {value} = computeRatingValueAndCount(ratingObj);
    const fullStars = Math.floor(value);
    const hasHalf = value - fullStars >= 0.5;
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            html += '<span class="star">★</span>';
        } else if (i === fullStars + 1 && hasHalf) {
            html += '<span class="star">⭐</span>';
        } else {
            html += '<span class="star">☆</span>';
        }
    }
    return html;
}

function isImageUrl(url) {
    if (!url || typeof url !== 'string') return false;
    const lower = url.toLowerCase();
    // Match common image extensions, including URLs with query parameters
    return /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)(\?.*)?$/i.test(lower) || /^(https?:)?\/\//.test(lower);
}

function renderProductCard(product) {
    try {
        const bgStyle = product.bgStyle ? `style="background:${product.bgStyle}"` : '';
        
        // Badge
        const badgeClass = product.badge === 'bestseller' ? 'tag-bestseller'
                     : product.badge === 'new' ? 'tag-new'
                     : product.badge === 'sale' ? 'tag-sale'
                     : '';
        const badgeHtml = product.badge && product.badgeText
            ? `<span class="product-badge-tag ${badgeClass}">${product.badgeText}</span>`
            : '';
        
        // Price
        let priceDisplay = product.tien;
        if (priceDisplay === null || priceDisplay === undefined || priceDisplay === '' || priceDisplay === 0) {
            priceDisplay = product.tienGoc;
        }
        
        const priceHtml = (product.tienGoc && product.tien && product.tienGoc !== product.tien)
            ? `<del>${formatVND(product.tienGoc)}</del>${formatVND(priceDisplay)}`
            : formatVND(priceDisplay || 0);
        
        // Image
        let imageHtml = '';
        if (product.img && isImageUrl(product.img)) {
            imageHtml = `<img src="${product.img}" alt="${product.TieuDe || ''}" class="product-img" onerror="this.style.display='none'"/>`;
        } else {
            imageHtml = `<div class="img-placeholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f0f0;font-size:3rem">📦</div>`;
        }
        
        // Rating
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
                    <button class="btn-cart" onclick="event.stopPropagation();addToCart()">Thêm vào giỏ</button>
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
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1">Chưa có sản phẩm nào.</p>';
        return;
    }
    
    // Limit to 4 products on index.html, show all on shop.html
    const isShopPage = window.location.pathname.includes('shop.html');
    const productsToShow = isShopPage ? products : products.slice(0, 4);
    
    container.innerHTML = productsToShow.map(renderProductCard).join('');
}

async function loadShopData() {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    // Show loading state
    container.innerHTML = '<p style="text-align:center;grid-column:1/-1;padding:40px;color:var(--text-muted);">🔄 Đang tải sản phẩm...</p>';
    
    try {
        const response = await fetch(`${API_BASE}/data/shop.json`);
        if (!response.ok) throw new Error('Không thể tải dữ liệu shop');
        const data = await response.json();
        renderProducts(data.products || []);
    } catch (error) {
        console.error('Lỗi tải dữ liệu shop:', error);
        container.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:#e74c3c;padding:40px">⚠️ Không thể kết nối đến server. Vui lòng thử lại sau.</p>';
    }
}
