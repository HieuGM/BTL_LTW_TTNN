# 👨‍🏫 Portal Giảng Viên - Anh Ngữ ABC

## 📋 Mô tả

Portal dành cho Giảng viên với đầy đủ chức năng quản lý lớp học, điểm danh, sổ đầu bài và nhập điểm theo yêu cầu trong file `ChucNang.md`.

## 🎯 Chức năng đã hoàn thành

### ✅ 4.1 Dashboard Giảng Viên
- **File:** `dashboard.html`, `dashboard.css`, `dashboard.js`
- **Chức năng:**
  - Hiển thị thống kê tổng quan (lớp đang dạy, tổng học viên, buổi học hôm nay, thông báo)
  - Lịch dạy hôm nay với quick actions (Điểm danh, Xem lớp)
  - Lịch dạy tuần này (xem theo tuần với navigation)
  - Danh sách lớp đang phụ trách (dạng card)
  - Thông báo từ giáo vụ (đọc/chưa đọc)

### ✅ 4.2 Quản Lý Lớp Giảng Dạy
- **File:** `classes.html`, `classes.css`, `classes.js`
- **Chức năng:**
  - Danh sách lớp với bộ lọc (Tất cả, Đang học, Sắp khai giảng)
  - Xem chi tiết lớp (Modal với tabs)
    - **Tab Thông tin:** Thông tin cơ bản lớp học
    - **Tab Học viên:** Danh sách học viên trong lớp
    - **Tab Lịch học:** Lịch học theo tuần
    - **Tab Tài liệu:** Danh sách tài liệu đã upload, upload tài liệu mới

### ✅ 4.3 Điểm Danh Buổi Học
- **File:** `attendance.html`, `attendance.css`, `attendance.js`
- **Chức năng:**
  - Chọn lớp và buổi học để điểm danh
  - Tạo buổi học mới
  - Điểm danh từng học viên với 3 trạng thái:
    - ✓ Có mặt (màu xanh)
    - ⚠ Vắng có phép (màu vàng)
    - ✗ Vắng không phép (màu đỏ)
  - Ghi chú cho từng học viên
  - Quick actions: Tất cả có mặt / Tất cả vắng
  - Thống kê tổng hợp (số lượng từng trạng thái)
  - Lưu và in điểm danh

### ✅ 4.4 Sổ Đầu Bài / Nội Dung Buổi Học
- **File:** `lesson-log.html`, `lesson-log.css`, `lesson-log.js`
- **Chức năng:**
  - Chọn lớp và buổi học
  - Nhập nội dung đã dạy
  - Giao bài tập về nhà
  - Upload tài liệu (pdf/doc/link)
  - Xem lịch sử sổ đầu bài

### ✅ 4.5 Nhập Điểm & Nhận Xét
- **File:** `grades.html`, `grades.css`, `grades.js`
- **Chức năng:**
  - Chọn lớp và loại bài kiểm tra
  - Nhập điểm theo kỹ năng (Listening/Speaking/Reading/Writing)
  - Hoặc nhập điểm tổng theo bài
  - Nhận xét tiến bộ học viên
  - Xem lịch sử điểm của học viên
  - Export kết quả

## 🎨 Thiết kế

### Màu sắc chính (tham khảo từ các trang khác):
- **Primary:** `#2563eb` (Xanh dương chủ đạo)
- **Success:** `#1cc88a` (Xanh lá - trạng thái tích cực)
- **Warning:** `#f6c23e` (Vàng - cảnh báo)
- **Danger:** `#e74a3b` (Đỏ - lỗi/vắng mặt)
- **Info:** `#36b9cc` (Xanh nhạt - thông tin)
- **Sidebar:** `#1f2937` (Xám đen - thanh bên)

### Layout:
- **Fixed Sidebar:** 260px, màu `#1f2937`
- **Content Area:** Flexible, padding 2rem
- **Cards:** White background, border-radius 10-12px, box-shadow
- **Responsive:** Mobile-friendly (sidebar ẩn trên mobile)

### Icons:
- Font Awesome 6.4.0 (CDN)
- Icons thống nhất với các trang khác

## 📁 Cấu trúc thư mục

```
src/Teacher/
├── teacher.css           # CSS chung cho toàn bộ portal
├── dashboard.html        # Dashboard giảng viên
├── dashboard.css         # CSS riêng cho dashboard
├── dashboard.js          # Logic dashboard
├── classes.html          # Quản lý lớp giảng dạy
├── classes.css           # CSS riêng cho lớp học
├── classes.js            # Logic quản lý lớp
├── attendance.html       # Điểm danh buổi học
├── attendance.css        # CSS riêng cho điểm danh
├── attendance.js         # Logic điểm danh
├── lesson-log.html       # Sổ đầu bài
├── lesson-log.css        # CSS riêng cho sổ đầu bài
├── lesson-log.js         # Logic sổ đầu bài
├── grades.html           # Nhập điểm & nhận xét
├── grades.css            # CSS riêng cho nhập điểm
├── grades.js             # Logic nhập điểm
└── README.md             # File này
```

## 🚀 Cách sử dụng

### Mở trang:
1. Mở `dashboard.html` để xem trang chủ giảng viên
2. Sử dụng sidebar để điều hướng giữa các trang
3. Mỗi trang có fake data để demo UI

### Navigation flow:
- **Dashboard** → Xem overview → Click "Điểm danh" → Chuyển đến trang điểm danh
- **Dashboard** → Xem lớp → Click "Chi tiết" → Xem modal chi tiết lớp
- **Classes** → Chọn lớp → Click "Điểm danh" → Chuyển đến trang điểm danh với lớp đã chọn

## 💾 Dữ liệu

### Fake Data (để demo):
- **Giảng viên:** Nguyễn Văn A (GV001)
- **Lớp học:** 3-4 lớp với các trạng thái khác nhau
- **Học viên:** Danh sách học viên mẫu cho mỗi lớp
- **Buổi học:** Lịch sử các buổi học đã qua và sắp tới
- **Điểm:** Điểm số mẫu cho các bài kiểm tra

### Tích hợp Backend:
Tất cả các chức năng đều có comment về cách tích hợp API:
```javascript
// TODO: Gửi request đến backend
fetch('/api/attendance/save', {
    method: 'POST',
    body: JSON.stringify(attendanceData)
})
```

## ✨ Tính năng nổi bật

1. **Real-time statistics:** Dashboard hiển thị số liệu thống kê trực quan
2. **Interactive attendance:** Điểm danh dễ dàng với color coding
3. **Quick actions:** Các nút action nhanh (điểm danh tất cả, lưu nhanh)
4. **Modal detail view:** Xem chi tiết lớp không cần chuyển trang
5. **Responsive design:** Tự động điều chỉnh cho mobile/tablet
6. **Consistent UI:** Thiết kế thống nhất với các portal khác (Admin, Student)

## 🔄 Cập nhật sau này

Các chức năng có thể mở rộng:
- [ ] Tích hợp WebSocket cho thông báo real-time
- [ ] Export điểm sang Excel/PDF
- [ ] Upload tài liệu đa phương tiện (video, audio)
- [ ] Chat với giáo vụ/học viên
- [ ] Quản lý lịch cá nhân (Google Calendar integration)
- [ ] Analytics: biểu đồ tiến bộ học viên

## 📝 Ghi chú

- Tất cả dữ liệu hiện tại đều là **fake data** để demo UI
- Cần tích hợp API backend để có chức năng thực tế
- Design responsive, test trên nhiều thiết bị
- Code đã được comment rõ ràng để dễ maintain

## 👥 Phân công (theo ChiaViec.md)

Trang này thuộc **FE4 - Portal Giảng viên** theo phân công trong file `ChiaViec.md`.

---

**Developed with ❤️ for Anh Ngữ ABC**
