# Giao diện FE2 - Quản lý vận hành trung tâm

## Mô tả
Đây là phần giao diện cho FE2 theo phân công trong file `ChiaViec.txt`. FE2 chịu trách nhiệm về **Vận hành trung tâm** bao gồm:

1. **Quản lý lớp học (Classes)**
2. **Phòng học & Lịch (Rooms/Schedule)**
3. **Điểm danh (Attendance)**
4. **Thông báo (Notifications)**
5. **Đơn đăng ký - Enroll Requests (Backoffice)**

## Cấu trúc file

```
src/Admin/
├── Classes.html          # Quản lý lớp học
├── Classes.css
├── Classes.js
├── Rooms.html           # Quản lý phòng học & lịch
├── Rooms.css
├── Rooms.js
├── Attendance.html      # Quản lý điểm danh
├── Attendance.css
├── Attendance.js
├── Notifications.html   # Quản lý thông báo
├── Notifications.css
├── Notifications.js
├── EnrollRequests.html  # Quản lý đơn đăng ký
├── EnrollRequests.css
└── EnrollRequests.js
```

## Tính năng chi tiết

### 1. Quản lý lớp học (Classes.html)
**Chức năng:**
- Hiển thị danh sách tất cả các lớp học
- Lọc theo khóa học, trạng thái
- Thêm/sửa/xóa lớp học
- Xem chi tiết lớp: thông tin giảng viên, lịch học, phòng học, sĩ số
- Quản lý học viên trong lớp
- Cảnh báo lớp gần full, trùng lịch giảng viên/phòng

**Trạng thái lớp:**
- Nháp
- Đang tuyển sinh
- Đang học
- Kết thúc

### 2. Phòng học & Lịch (Rooms.html)
**Chức năng:**
- **Tab 1: Danh sách phòng**
  - Hiển thị dạng card với thông tin: tên phòng, sức chứa, trang thiết bị, trạng thái
  - Phân loại: Phòng vật lý / Phòng online
  - Thêm/sửa/xóa phòng học
  
- **Tab 2: Lịch sử dụng phòng**
  - Xem lịch sử dụng phòng theo ngày
  - Hiển thị timeline buổi học
  - Cảnh báo xung đột phòng học

### 3. Điểm danh (Attendance.html)
**Chức năng:**
- **Thống kê tổng quan:**
  - Số buổi học hôm nay
  - Tỷ lệ có mặt
  - Học viên vắng có phép/không phép

- **Quản lý điểm danh:**
  - Tạo điểm danh mới cho buổi học
  - Xem/sửa điểm danh theo lớp, theo buổi
  - Trạng thái: Có mặt / Vắng có phép / Vắng không phép
  - Ghi chú cho từng học viên
  - Xuất Excel

- **Báo cáo học viên vắng nhiều:**
  - Danh sách học viên vắng > 30%
  - Gửi cảnh báo cho học viên

### 4. Thông báo (Notifications.html)
**Chức năng:**
- **Gửi thông báo:**
  - Thông báo chung / lớp học / lịch học / kiểm tra / học phí
  - Đối tượng: Toàn bộ học viên / Theo lớp / Cá nhân
  - Hẹn giờ gửi hoặc gửi ngay
  - Gửi qua Email và/hoặc hiển thị trong hệ thống

- **Quản lý thông báo:**
  - Xem danh sách thông báo đã gửi
  - Trạng thái: Đã gửi / Chờ gửi / Nháp
  - Theo dõi tỷ lệ đã đọc
  - Lịch sử gửi thông báo

### 5. Đơn đăng ký (EnrollRequests.html)
**Chức năng:**
- **Thống kê:**
  - Đơn mới chờ xử lý
  - Đã liên hệ
  - Hoàn tất tháng này
  - Từ chối/Hủy

- **Quản lý đơn:**
  - Xem chi tiết thông tin học viên đăng ký
  - Cập nhật trạng thái: Mới → Đã liên hệ → Đã xếp lớp → Đã đóng phí → Hoàn tất
  - Xếp lớp dự kiến cho học viên
  - Ghi chú quá trình xử lý
  - Lịch sử xử lý đơn

- **Thao tác nhanh:**
  - Gọi điện cho học viên
  - Gửi Email
  - Tạo học viên chính thức
  - Xếp lớp

## Thiết kế giao diện

### Màu sắc chủ đạo (theo FE1):
- **Primary:** `#4e73df` (Xanh dương)
- **Success:** `#1cc88a` (Xanh lá)
- **Warning:** `#f6c23e` (Vàng)
- **Danger:** `#e74a3b` (Đỏ)
- **Background:** `#f4f6f9` (Xám nhạt)

### Layout:
- **Sidebar:** Menu điều hướng cố định bên trái (250px)
- **Content:** Nội dung chính bên phải
- **Card:** Các thành phần được bọc trong card trắng với shadow nhẹ
- **Responsive:** Hỗ trợ hiển thị trên mobile

### Thành phần UI:
- **Buttons:** Primary, Secondary, Icon buttons
- **Tables:** Bảng dữ liệu với hover effect
- **Modals:** Form thêm/sửa dữ liệu
- **Badges:** Hiển thị trạng thái
- **Statistics Cards:** Card thống kê với icon màu sắc
- **Filters:** Thanh lọc dữ liệu
- **Pagination:** Phân trang

## Icons
Sử dụng **Font Awesome 6.0.0** CDN:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
```

## Lưu ý
- Tất cả các file đều là **giao diện tĩnh** (HTML/CSS/JS)
- JavaScript chỉ xử lý hiển thị/ẩn modal, tab switching, các thao tác UI cơ bản
- **Chưa có kết nối Backend/API** - cần được tích hợp sau
- Dữ liệu hiện tại là **dữ liệu mẫu** để demo giao diện

## Cách sử dụng
1. Mở file `Classes.html` để bắt đầu
2. Điều hướng qua các trang khác thông qua sidebar menu
3. Các modal sẽ hiển thị khi click vào nút "Thêm mới" hoặc "Chỉnh sửa"

## Tương thích
- **Desktop:** Chrome, Firefox, Edge, Safari
- **Mobile:** Responsive design cho màn hình nhỏ
- **Tablet:** Tối ưu cho iPad và các thiết bị tablet

## Tác giả
**FE2** - Phụ trách vận hành trung tâm

## Phiên bản
v1.0 - Ngày 24/02/2026
