// Fake data for Teacher Dashboard
const teacherData = {
    name: "Nguyễn Văn A",
    teacherId: "GV001",
    email: "nguyenvana@abc.edu.vn"
};

const classesData = [
    {
        id: 1,
        name: "IELTS 6.5 Sáng",
        code: "IELTS-65-S01",
        course: "IELTS 6.5",
        schedule: "Thứ 2, 4, 6 - 08:00-10:00",
        room: "P201",
        students: 18,
        maxStudents: 20,
        status: "Đang học",
        startDate: "2024-01-15",
        endDate: "2024-06-15"
    },
    {
        id: 2,
        name: "Giao tiếp Cơ bản Tối",
        code: "GT-CB-T03",
        course: "Giao tiếp Cơ bản",
        schedule: "Thứ 3, 5, 7 - 18:30-20:00",
        room: "P105",
        students: 15,
        maxStudents: 15,
        status: "Đang học",
        startDate: "2024-02-01",
        endDate: "2024-07-01"
    },
    {
        id: 3,
        name: "TOEIC 650 Chiều",
        code: "TOEIC-650-C02",
        course: "TOEIC 650",
        schedule: "Thứ 2, 4, 6 - 14:00-16:00",
        room: "P303",
        students: 12,
        maxStudents: 18,
        status: "Đang học",
        startDate: "2024-01-20",
        endDate: "2024-06-20"
    }
];

const todaySchedule = [
    {
        time: "08:00 - 10:00",
        classId: 1,
        className: "IELTS 6.5 Sáng",
        classCode: "IELTS-65-S01",
        room: "P201",
        students: 18,
        status: "Chưa bắt đầu"
    },
    {
        time: "14:00 - 16:00",
        classId: 3,
        className: "TOEIC 650 Chiều",
        classCode: "TOEIC-650-C02",
        room: "P303",
        students: 12,
        status: "Chưa bắt đầu"
    }
];

const weekSchedule = [
    { day: "Thứ 2", time: "08:00-10:00", class: "IELTS 6.5 Sáng", room: "P201", students: 18, status: "Đã điểm danh" },
    { day: "Thứ 2", time: "14:00-16:00", class: "TOEIC 650 Chiều", room: "P303", students: 12, status: "Đã điểm danh" },
    { day: "Thứ 3", time: "18:30-20:00", class: "Giao tiếp Cơ bản Tối", room: "P105", students: 15, status: "Đã điểm danh" },
    { day: "Thứ 4", time: "08:00-10:00", class: "IELTS 6.5 Sáng", room: "P201", students: 18, status: "Sắp tới" },
    { day: "Thứ 4", time: "14:00-16:00", class: "TOEIC 650 Chiều", room: "P303", students: 12, status: "Sắp tới" },
    { day: "Thứ 5", time: "18:30-20:00", class: "Giao tiếp Cơ bản Tối", room: "P105", students: 15, status: "Sắp tới" },
    { day: "Thứ 6", time: "08:00-10:00", class: "IELTS 6.5 Sáng", room: "P201", students: 18, status: "Sắp tới" },
    { day: "Thứ 6", time: "14:00-16:00", class: "TOEIC 650 Chiều", room: "P303", students: 12, status: "Sắp tới" },
    { day: "Thứ 7", time: "18:30-20:00", class: "Giao tiếp Cơ bản Tối", room: "P105", students: 15, status: "Sắp tới" }
];

const notifications = [
    {
        id: 1,
        title: "Thông báo nghỉ học",
        message: "Lớp IELTS 6.5 Sáng sẽ nghỉ vào ngày 15/03 do giảng viên có việc đột xuất. Sẽ có lịch học bù.",
        time: "2 giờ trước",
        read: false,
        type: "warning"
    },
    {
        id: 2,
        title: "Cập nhật tài liệu",
        message: "Vui lòng cập nhật tài liệu học tập mới cho lớp TOEIC 650 Chiều trên hệ thống.",
        time: "1 ngày trước",
        read: false,
        type: "info"
    },
    {
        id: 3,
        title: "Họp giảng viên",
        message: "Họp toàn thể giảng viên vào 10:00 ngày 20/03 tại phòng họp tầng 4.",
        time: "3 ngày trước",
        read: true,
        type: "info"
    }
];

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadTeacherInfo();
    loadStats();
    loadTodaySchedule();
    loadWeekSchedule();
    loadClasses();
    loadNotifications();
    setCurrentDate();
    initWeekNavigation();
});

// Load teacher info
function loadTeacherInfo() {
    document.getElementById('teacherName').textContent = teacherData.name;
}

// Load statistics
function loadStats() {
    document.getElementById('totalClasses').textContent = classesData.length;
    
    const totalStudents = classesData.reduce((sum, cls) => sum + cls.students, 0);
    document.getElementById('totalStudents').textContent = totalStudents;
    
    document.getElementById('todayLessons').textContent = todaySchedule.length;
    
    const unreadNotifications = notifications.filter(n => !n.read).length;
    document.getElementById('notifications').textContent = unreadNotifications;
}

// Set current date
function setCurrentDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dateToday').textContent = today.toLocaleDateString('vi-VN', options);
}

// Load today's schedule
function loadTodaySchedule() {
    const container = document.getElementById('todaySchedule');
    
    if (todaySchedule.length === 0) {
        container.innerHTML = `
            <div class="empty-schedule">
                <i class="fas fa-calendar-times"></i>
                <p>Không có lịch dạy hôm nay</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = todaySchedule.map(lesson => `
        <div class="schedule-item">
            <div class="schedule-time">
                <i class="fas fa-clock"></i>
                ${lesson.time}
            </div>
            <div class="schedule-details">
                <div class="schedule-class">${lesson.className}</div>
                <div class="schedule-info">
                    <i class="fas fa-door-open"></i> ${lesson.room} • 
                    <i class="fas fa-users"></i> ${lesson.students} học viên
                </div>
            </div>
            <div class="schedule-actions">
                <button class="btn btn-sm btn-primary" onclick="takeAttendance(${lesson.classId})">
                    <i class="fas fa-clipboard-check"></i> Điểm danh
                </button>
                <button class="btn btn-sm btn-info" onclick="viewClassDetail(${lesson.classId})">
                    <i class="fas fa-eye"></i> Xem lớp
                </button>
            </div>
        </div>
    `).join('');
}

// Load week schedule
function loadWeekSchedule() {
    const tbody = document.getElementById('weekScheduleBody');
    
    tbody.innerHTML = weekSchedule.map(lesson => {
        const statusBadge = getStatusBadge(lesson.status);
        return `
            <tr>
                <td><strong>${lesson.day}</strong></td>
                <td>${lesson.time}</td>
                <td>${lesson.class}</td>
                <td><i class="fas fa-door-open"></i> ${lesson.room}</td>
                <td><i class="fas fa-users"></i> ${lesson.students}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join('');
}

// Get status badge
function getStatusBadge(status) {
    const badges = {
        'Đã điểm danh': '<span class="badge badge-success">Đã điểm danh</span>',
        'Sắp tới': '<span class="badge badge-warning">Sắp tới</span>',
        'Đã hủy': '<span class="badge badge-danger">Đã hủy</span>'
    };
    return badges[status] || '<span class="badge badge-info">Chưa rõ</span>';
}

// Load classes
function loadClasses() {
    const container = document.getElementById('classList');
    
    container.innerHTML = classesData.map(cls => `
        <div class="class-card" onclick="viewClassDetail(${cls.id})">
            <div class="class-card-header">
                <div>
                    <div class="class-name">${cls.name}</div>
                    <div class="class-code">${cls.code}</div>
                </div>
                <span class="badge badge-success">${cls.status}</span>
            </div>
            <div class="class-body">
                <div class="class-info-item">
                    <i class="fas fa-book"></i>
                    <span>${cls.course}</span>
                </div>
                <div class="class-info-item">
                    <i class="fas fa-calendar"></i>
                    <span>${cls.schedule}</span>
                </div>
                <div class="class-info-item">
                    <i class="fas fa-door-open"></i>
                    <span>Phòng ${cls.room}</span>
                </div>
            </div>
            <div class="class-footer">
                <div class="class-students">
                    <strong>${cls.students}</strong>/${cls.maxStudents} học viên
                </div>
                <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); viewClassDetail(${cls.id})">
                    Chi tiết
                </button>
            </div>
        </div>
    `).join('');
}

// Load notifications
function loadNotifications() {
    const container = document.getElementById('notificationsList');
    
    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="empty-schedule">
                <i class="fas fa-bell-slash"></i>
                <p>Không có thông báo mới</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = notifications.map(notif => {
        const iconClass = notif.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        const readClass = notif.read ? '' : 'unread';
        
        return `
            <div class="notification-item ${readClass}">
                <div class="notification-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notif.title}</div>
                    <div class="notification-message">${notif.message}</div>
                    <div class="notification-time"><i class="fas fa-clock"></i> ${notif.time}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Week navigation
function initWeekNavigation() {
    updateWeekRange();
    
    document.getElementById('prevWeek').addEventListener('click', function() {
        alert('Chức năng xem tuần trước (sẽ được implement với backend)');
    });
    
    document.getElementById('nextWeek').addEventListener('click', function() {
        alert('Chức năng xem tuần sau (sẽ được implement với backend)');
    });
}

function updateWeekRange() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const options = { day: '2-digit', month: '2-digit' };
    const start = startOfWeek.toLocaleDateString('vi-VN', options);
    const end = endOfWeek.toLocaleDateString('vi-VN', options);
    
    document.getElementById('weekRange').textContent = `${start} - ${end}`;
}

// Action functions
function takeAttendance(classId) {
    window.location.href = `attendance.html?classId=${classId}`;
}

function viewClassDetail(classId) {
    window.location.href = `classes.html?classId=${classId}`;
}
