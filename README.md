# 🩺 Cẩm Nang Sơ Cứu - Hướng Dẫn Xử Lý Tai Nạn

Website động cung cấp hướng dẫn sơ cứu chi tiết theo tiêu chuẩn y tế quốc tế. Xây dựng với HTML5, CSS3, JavaScript và Bootstrap 5.

## <i class="bi bi-clipboard-list"></i> Mô tả dự án

Cẩm nang sơ cứu là một website động giúp người dùng nhanh chóng tìm kiếm và học các kỹ năng sơ cứu cơ bản cho các tình huống khẩn cấp như:

- Ngừng tim - Hồi sức CPR
- Bỏng nhiệt & hóa chất
- Gãy xương & trật khớp
- Dị vật đường thở (Heimlich)
- Chảy máu nặng
- Đuối nước
- Ngộ độc thực phẩm & hóa chất
- Sốc phản vệ
- Đột quỵ (Stroke)
- Rắn cắn & côn trùng đốt
- Say nắng & kiệt sức nhiệt

## <i class="bi bi-rocket-takeoff"></i> Tính năng

### <i class="bi bi-star-fill"></i> Tính năng chính

- **Truy cập nhanh**: 8 nút truy cập nhanh đến các tình huống phổ biến
- **Accordion chi tiết**: 12+ hướng dẫn chi tiết có thể mở/đóng
- **Hồi sức CPR**: Hướng dẫn từng bước kỹ thuật ép tim ngoài lồng ngực
- **Nên & Không nên**: Danh sách các việc nên và không nên làm khi sơ cứu
- **Bộ sơ cứu**: Danh sách vật dụng cần có trong bộ sơ cứu cơ bản

### <i class="bi bi-palette"></i> Giao diện

- **Responsive**: Tương thích với mọi thiết bị (desktop, tablet, mobile)
- **Bootstrap 5**: Sử dụng framework Bootstrap 5 hiện đại
- **Animate.css**: Hiệu ứng animation chuyên nghiệp
- **Page Transitions**: Hiệu ứng chuyển trang mượt mà
- **Scroll Animations**: Hiệu ứng khi cuộn trang
- **Hover Effects**: Hiệu ứng hover cho các phần tử
- **Accessibility**: Hỗ trợ điều khiển bằng bàn phím và screen reader
- **Print-friendly**: Chế độ in tối ưu cho tài liệu

### 🔧 Kỹ thuật

- **HTML5**: Semantic HTML với ARIA labels
- **CSS3**: Custom CSS với CSS variables + Keyframe animations
- **JavaScript ES6+**: Vanilla JS với Bootstrap 5
- **Bootstrap 5**: Framework CSS/JS hiện đại
- **Bootstrap Icons**: Bộ icon chất lượng cao
- **Animate.css**: Thư viện animation CSS

### ✨ Hiệu ứng chạy

- **Page Load Animation**: Fade-in khi tải trang
- **Gradient Animation**: Hiệu ứng gradient chuyển động
- **Pulse Animation**: Hiệu ứng nhấp nháy cho nút khẩn cấp
- **Float Animation**: Hiệu ứng nổi cho các phần tử
- **Slide Animations**: Hiệu ứng trượt từ các hướng
- **Scale Animation**: Hiệu ứng phóng to/thu nhỏ
- **Rotate Animation**: Hiệu ứng xoay
- **Bounce Animation**: Hiệu ứng nảy
- **Glow Animation**: Hiệu ứng phát sáng
- **Card Hover Effects**: Hiệu ứng hover cho thẻ
- **Button Ripple Effect**: Hiệu ứng sóng cho nút
- **Counter Animation**: Hiệu ứng đếm số

## 📁 Cấu trúc dự án

```
project
├── index.html              # Trang chủ
├── pages/                  # Các trang con
│   ├── huong-dan.html     # Hướng dẫn chi tiết
│   ├── cpr.html           # Hồi sức CPR
│   ├── nen-khong-nen.html # Nên & Không nên
│   └── bo-kit.html        # Bộ sơ cứu
├── css/
│   └── style.css          # CSS tùy chỉnh + Animations
├── js/
│   └── main.js            # JavaScript chính + Page transitions
├── assets/
│   ├── images/            # Hình ảnh (nếu có)
│   └── fonts/             # Font tùy chỉnh (nếu có)
└── README.md              # Tài liệu dự án
```

## 🛠️ Cài đặt

### Yêu cầu

- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Không cần cài đặt server (có thể chạy trực tiếp)

### Chạy dự án

1. Clone hoặc tải dự án về máy
2. Mở file `index.html` bằng trình duyệt web
3. Hoặc sử dụng Live Server (VS Code extension)

```bash
# Nếu có Live Server
# Click chuột phải vào index.html -> Open with Live Server
```

## 📱 Sử dụng

### Truy cập nhanh

Nhấn vào các nút truy cập nhanh để mở hướng dẫn tương ứng:

- <i class="bi bi-heart-pulse-fill text-danger me-1"></i>Ngừng tim
- <i class="bi bi-fire text-warning me-1"></i>Bỏng
- <i class="bi bi-bone text-primary me-1"></i>Gãy xương
- <i class="bi bi-lightning-fill text-warning me-1"></i>Điện giật
- <i class="bi bi-emoji-dizzy text-info me-1"></i>Dị vật đường thở
- <i class="bi bi-droplet-fill text-danger me-1"></i>Chảy máu nặng
- <i class="bi bi-water text-primary me-1"></i>Đuối nước
- <i class="bi bi-skull text-secondary me-1"></i>Ngộ độc

### Hướng dẫn chi tiết

Mở các accordion để xem hướng dẫn chi tiết từng bước cho từng tình huống.

### Gọi cấp cứu

Nhấn nút "GỌI 115" để gọi trực tiếp đường dây cấp cứu khẩn cấp.

## 🎯 Tính năng mở rộng (Future)

- [ ] Thêm video hướng dẫn
- [ ] Quiz kiểm tra kiến thức
- [ ] Tìm kiếm và lọc
- [ ] Chế độ offline (PWA)
- [ ] Đa ngôn ngữ
- [ ] API cập nhật nội dung
- [ ] Dark mode
- [ ] Share trên mạng xã hội

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phát triển với mục đích giáo dục và tham khảo. Không thay thế cho đào tạo sơ cứu chuyên nghiệp.

## ⚠️ Lưu ý quan trọng

Tài liệu này chỉ mang tính chất hướng dẫn tham khảo. Không thay thế cho việc đào tạo sơ cứu chuyên nghiệp và tư vấn y tế.

Trong mọi tình huống khẩn cấp, hãy gọi **115** ngay lập tức.

## 📞 Đường dây khẩn cấp

- 🚑 Cấp cứu y tế: **115**
- 🚒 Cứu hỏa: **114**
- 🚔 Công an: **113**
- 🆘 Tìm kiếm cứu nạn: **112**

## 👨‍💻 Tác giả

Phát triển với ❤️ để giúp đỡ cộng đồng.

---

**Lưu ý**: Hãy học sơ cứu chuyên nghiệp và thường xuyên cập nhật kiến thức y tế mới nhất.
