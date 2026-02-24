# FE3 - Admin Module

Giao diện quản lý Admin cho hệ thống Quản lý Trung tâm Ngoại ngữ (TTNN)

## 📁 Cấu trúc thư mục

```
FE3/
├── css/
│   └── style.css           # File CSS chính
├── dashboard.html          # Trang Dashboard Admin
├── courses.html            # Danh sách khóa học
├── course-form.html        # Form thêm/sửa khóa học
├── reports.html            # Báo cáo & Thống kê
├── settings.html           # Cấu hình & Audit Log
└── README.md              # File hướng dẫn này
```

## 📋 Chức năng đã triển khai

### 1. Dashboard Admin (`dashboard.html`)
- ✅ Tổng quan thống kê (học viên, lớp học, doanh thu, công nợ)
- ✅ Widget hiển thị số liệu quan trọng
- ✅ Danh sách việc cần xử lý
- ✅ Buổi học hôm nay
- ✅ Thông báo hệ thống
- ✅ Lớp học gần đây

### 2. Quản lý khóa học (`courses.html`, `course-form.html`)
- ✅ Danh sách khóa học với bộ lọc
- ✅ Thêm/Sửa/Xóa khóa học
- ✅ Form chi tiết khóa học:
  - Thông tin cơ bản (mã, tên, mô tả, trình độ)
  - Chi tiết khóa học (mục tiêu, số buổi, giáo trình)
  - Học phí và gói thanh toán
  - Cài đặt khác
- ✅ Modal xác nhận xóa

### 3. Báo cáo - Thống kê (`reports.html`)
- ✅ 3 loại báo cáo với tabs:
  - **Báo cáo chuyên cần**: Tỷ lệ tham gia theo lớp, học viên vắng nhiều
  - **Báo cáo học tập**: Điểm trung bình, xếp loại, kết quả theo kỹ năng
  - **Báo cáo tài chính**: Doanh thu, công nợ theo khóa học, công nợ quá hạn
- ✅ Bộ lọc theo ngày, lớp, khóa học
- ✅ Nút xuất Excel/PDF
- ✅ Biểu đồ tiến độ (progress bar)

### 4. Cấu hình & Audit Log (`settings.html`)
- ✅ Quản lý phân quyền:
  - Phân quyền theo vai trò (Admin, Giáo vụ, Kế toán, Giảng viên, Học viên)
  - Matrix quyền CRUD cho từng module
- ✅ Nhật ký hoạt động:
  - Lịch sử chi tiết các thao tác
  - Bộ lọc theo người dùng, hành động, module, ngày
  - Thống kê hoạt động

## 🎨 Thiết kế & Tính năng UI

### Layout
- Sidebar cố định bên trái (260px)
- Header sticky phía trên với search, notifications, user menu
- Responsive design (mobile-friendly)
- Color scheme hiện đại với biến CSS

### Components
- **Cards**: Thẻ thông tin với shadow và hover effect
- **Tables**: Bảng responsive với pagination
- **Forms**: Input, select, textarea với validation
- **Buttons**: Nhiều kiểu (primary, secondary, success, danger, outline)
- **Badges**: Hiển thị trạng thái
- **Alerts**: Thông báo với 4 loại (success, warning, danger, info)
- **Modals**: Popup xác nhận
- **Tabs**: Chuyển đổi giữa các view

### Icons
Sử dụng Font Awesome 6.4.0 (CDN)

## 🚀 Cách sử dụng

### 1. Mở file HTML trực tiếp
```bash
# Mở Dashboard
# Double-click vào file dashboard.html
# hoặc
start dashboard.html  # Windows
open dashboard.html   # Mac
```

### 2. Chạy với Local Server (Khuyến nghị)
```bash
# Sử dụng Python
python -m http.server 8000

# Hoặc sử dụng Live Server trong VS Code
# Right-click -> Open with Live Server
```

Sau đó truy cập: `http://localhost:8000/dashboard.html`

## 🔗 Điều hướng giữa các trang

- **Dashboard**: `dashboard.html`
- **Quản lý khóa học**: `courses.html`
- **Thêm/Sửa khóa học**: `course-form.html`
- **Báo cáo**: `reports.html`
- **Cấu hình**: `settings.html`

## 📝 Lưu ý khi phát triển

### Backend Integration
Các file HTML hiện tại là static. Để tích hợp với backend:

1. **API Endpoints cần có:**
   ```
   GET    /api/courses          # Danh sách khóa học
   POST   /api/courses          # Tạo khóa học mới
   GET    /api/courses/:id      # Chi tiết khóa học
   PUT    /api/courses/:id      # Cập nhật khóa học
   DELETE /api/courses/:id      # Xóa khóa học
   
   GET    /api/reports/attendance    # Báo cáo chuyên cần
   GET    /api/reports/academic      # Báo cáo học tập
   GET    /api/reports/finance       # Báo cáo tài chính
   
   GET    /api/audit-logs             # Nhật ký hoạt động
   GET    /api/permissions/:role      # Quyền theo vai trò
   PUT    /api/permissions/:role      # Cập nhật quyền
   ```

2. **JavaScript Functions cần implement:**
   - Form submission handlers
   - AJAX/Fetch calls
   - Data binding
   - Real-time updates
   - Chart rendering (Chart.js hoặc ApexCharts)

3. **Authentication & Authorization:**
   - Token-based auth (JWT)
   - Session management
   - Role-based access control

### Responsive Design
Các breakpoints đã được định nghĩa:
- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

### Browser Support
- Chrome/Edge: ✅ (Latest 2 versions)
- Firefox: ✅ (Latest 2 versions)
- Safari: ✅ (Latest 2 versions)
- IE11: ❌ (Not supported)

## 🎯 Roadmap phát triển

### Phase 1 - Hoàn thiện UI (✅ Đã xong)
- [x] Dashboard với widgets
- [x] Quản lý khóa học CRUD
- [x] 3 loại báo cáo
- [x] Phân quyền & Audit log

### Phase 2 - Backend Integration (Tiếp theo)
- [ ] Kết nối API
- [ ] Authentication
- [ ] Real data binding
- [ ] Form validation
- [ ] Error handling

### Phase 3 - Advanced Features
- [ ] Charts & Graphs (Chart.js)
- [ ] Real-time notifications (WebSocket)
- [ ] Export Excel/PDF functionality
- [ ] Advanced filters & search
- [ ] Bulk actions
- [ ] Drag & drop

### Phase 4 - Optimization
- [ ] Performance optimization
- [ ] Lazy loading
- [ ] Code splitting
- [ ] PWA support
- [ ] Dark mode

## 🛠️ Technologies

- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Custom Properties
- **Font Awesome 6.4.0**: Icons
- **JavaScript (Vanilla)**: Interactivity

## 📞 Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team FE3.

---

**© 2024 - FE3 Team - Hệ thống Quản lý Trung tâm Ngoại ngữ**
