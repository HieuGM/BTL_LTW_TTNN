// Fake data for classes
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
        status: "active",
        statusText: "Đang học",
        startDate: "15/01/2024",
        endDate: "15/06/2024",
        progress: 45
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
        status: "active",
        statusText: "Đang học",
        startDate: "01/02/2024",
        endDate: "01/07/2024",
        progress: 30
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
        status: "active",
        statusText: "Đang học",
        startDate: "20/01/2024",
        endDate: "20/06/2024",
        progress: 50
    },
    {
        id: 4,
        name: "IELTS 7.0 Sáng",
        code: "IELTS-70-S02",
        course: "IELTS 7.0",
        schedule: "Thứ 3, 5, 7 - 08:00-10:00",
        room: "P204",
        students: 0,
        maxStudents: 20,
        status: "upcoming",
        statusText: "Sắp khai giảng",
        startDate: "01/04/2024",
        endDate: "01/09/2024",
        progress: 0
    }
];

const studentsData = {
    1: [
        { id: 1, code: "HV001", name: "Nguyễn Văn A", email: "nguyenvana@email.com", phone: "0912345678", status: "Đang học" },
        { id: 2, code: "HV002", name: "Trần Thị B", email: "tranthib@email.com", phone: "0923456789", status: "Đang học" },
        { id: 3, code: "HV003", name: "Lê Văn C", email: "levanc@email.com", phone: "0934567890", status: "Đang học" },
        { id: 4, code: "HV004", name: "Phạm Thị D", email: "phamthid@email.com", phone: "0945678901", status: "Đang học" },
        { id: 5, code: "HV005", name: "Hoàng Văn E", email: "hoangvane@email.com", phone: "0956789012", status: "Đang học" }
    ],
    2: [
        { id: 6, code: "HV006", name: "Vũ Thị F", email: "vuthif@email.com", phone: "0967890123", status: "Đang học" },
        { id: 7, code: "HV007", name: "Đỗ Văn G", email: "dovang@email.com", phone: "0978901234", status: "Đang học" },
        { id: 8, code: "HV008", name: "Bùi Thị H", email: "buithih@email.com", phone: "0989012345", status: "Đang học" }
    ],
    3: [
        { id: 9, code: "HV009", name: "Đinh Văn I", email: "dinhvani@email.com", phone: "0990123456", status: "Đang học" },
        { id: 10, code: "HV010", name: "Lý Thị K", email: "lythik@email.com", phone: "0901234567", status: "Đang học" }
    ],
    4: []
};

const scheduleData = {
    1: [
        { day: "Thứ 2", date: "04/03/2024", time: "08:00-10:00", room: "P201" },
        { day: "Thứ 4", date: "06/03/2024", time: "08:00-10:00", room: "P201" },
        { day: "Thứ 6", date: "08/03/2024", time: "08:00-10:00", room: "P201" }
    ],
    2: [
        { day: "Thứ 3", date: "05/03/2024", time: "18:30-20:00", room: "P105" },
        { day: "Thứ 5", date: "07/03/2024", time: "18:30-20:00", room: "P105" },
        { day: "Thứ 7", date: "09/03/2024", time: "18:30-20:00", room: "P105" }
    ],
    3: [
        { day: "Thứ 2", date: "04/03/2024", time: "14:00-16:00", room: "P303" },
        { day: "Thứ 4", date: "06/03/2024", time: "14:00-16:00", room: "P303" },
        { day: "Thứ 6", date: "08/03/2024", time: "14:00-16:00", room: "P303" }
    ]
};

const materialsData = {
    1: [
        { id: 1, name: "IELTS Reading Practice Test 1.pdf", type: "pdf", size: "2.5 MB", date: "15/02/2024" },
        { id: 2, name: "Listening Techniques.pptx", type: "pptx", size: "5.1 MB", date: "20/02/2024" },
        { id: 3, name: "Writing Task 2 Samples.docx", type: "docx", size: "1.8 MB", date: "25/02/2024" }
    ],
    2: [
        { id: 4, name: "Basic Conversation Topics.pdf", type: "pdf", size: "1.2 MB", date: "10/02/2024" },
        { id: 5, name: "Grammar Exercises.pdf", type: "pdf", size: "3.0 MB", date: "18/02/2024" }
    ],
    3: [
        { id: 6, name: "TOEIC Listening Part 1-4.mp3", type: "audio", size: "15.5 MB", date: "12/02/2024" },
        { id: 7, name: "Reading Comprehension.pdf", type: "pdf", size: "4.2 MB", date: "22/02/2024" }
    ]
};

let currentFilter = 'all';
let currentClassDetail = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadClasses();
    initFilterTabs();
    initDetailTabs();
    updateCounts();
    checkURLParams();
});

// Check URL parameters
function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('classId');
    if (classId) {
        viewClassDetail(parseInt(classId));
    }
}

// Update counts
function updateCounts() {
    const all = classesData.length;
    const active = classesData.filter(c => c.status === 'active').length;
    const upcoming = classesData.filter(c => c.status === 'upcoming').length;
    
    document.getElementById('countAll').textContent = all;
    document.getElementById('countActive').textContent = active;
    document.getElementById('countUpcoming').textContent = upcoming;
}

// Initialize filter tabs
function initFilterTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-status');
            loadClasses();
        });
    });
}

// Load classes
function loadClasses() {
    const container = document.getElementById('classesContainer');
    
    let filteredClasses = classesData;
    if (currentFilter !== 'all') {
        filteredClasses = classesData.filter(c => c.status === currentFilter);
    }
    
    if (filteredClasses.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-folder-open"></i>
                <h3>Không có lớp học</h3>
                <p>Không tìm thấy lớp học nào phù hợp với bộ lọc.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredClasses.map(cls => {
        const statusBadge = getStatusBadge(cls.statusText);
        const progressBar = cls.status === 'active' ? `
            <div class="progress-info">
                <small>Tiến độ: ${cls.progress}%</small>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${cls.progress}%"></div>
                </div>
            </div>
        ` : '';
        
        return `
            <div class="class-item">
                <div class="class-item-header">
                    <div class="class-title-group">
                        <h3>${cls.name}</h3>
                        <span class="class-code-badge">${cls.code}</span>
                    </div>
                    ${statusBadge}
                </div>
                <div class="class-item-body">
                    <div class="class-detail-row">
                        <i class="fas fa-book"></i>
                        <span><strong>Khóa học:</strong> ${cls.course}</span>
                    </div>
                    <div class="class-detail-row">
                        <i class="fas fa-calendar"></i>
                        <span><strong>Lịch học:</strong> ${cls.schedule}</span>
                    </div>
                    <div class="class-detail-row">
                        <i class="fas fa-door-open"></i>
                        <span><strong>Phòng:</strong> ${cls.room}</span>
                    </div>
                    <div class="class-detail-row">
                        <i class="fas fa-calendar-alt"></i>
                        <span><strong>Thời gian:</strong> ${cls.startDate} - ${cls.endDate}</span>
                    </div>
                    ${progressBar}
                </div>
                <div class="class-item-footer">
                    <div class="student-count">
                        <i class="fas fa-users"></i>
                        <span class="count">${cls.students}</span>
                        <span>/ ${cls.maxStudents} học viên</span>
                    </div>
                    <div class="class-actions">
                        <button class="btn btn-sm btn-primary" onclick="viewClassDetail(${cls.id})">
                            <i class="fas fa-eye"></i> Chi tiết
                        </button>
                        ${cls.status === 'active' ? `
                            <button class="btn btn-sm btn-success" onclick="goToAttendance(${cls.id})">
                                <i class="fas fa-clipboard-check"></i> Điểm danh
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Get status badge
function getStatusBadge(status) {
    const badges = {
        'Đang học': '<span class="badge badge-success">Đang học</span>',
        'Sắp khai giảng': '<span class="badge badge-warning">Sắp khai giảng</span>',
        'Đã kết thúc': '<span class="badge badge-info">Đã kết thúc</span>'
    };
    return badges[status] || '<span class="badge badge-secondary">Không rõ</span>';
}

// View class detail
function viewClassDetail(classId) {
    currentClassDetail = classesData.find(c => c.id === classId);
    if (!currentClassDetail) return;
    
    // Load basic info
    document.getElementById('detailClassCode').textContent = currentClassDetail.code;
    document.getElementById('detailCourse').textContent = currentClassDetail.course;
    document.getElementById('detailSchedule').textContent = currentClassDetail.schedule;
    document.getElementById('detailRoom').textContent = currentClassDetail.room;
    document.getElementById('detailStudents').textContent = `${currentClassDetail.students}/${currentClassDetail.maxStudents}`;
    document.getElementById('detailStartDate').textContent = currentClassDetail.startDate;
    document.getElementById('detailEndDate').textContent = currentClassDetail.endDate;
    document.getElementById('detailStatus').innerHTML = getStatusBadge(currentClassDetail.statusText);
    
    // Load students
    loadStudentsList(classId);
    
    // Load schedule
    loadScheduleDetail(classId);
    
    // Load materials
    loadMaterialsList(classId);
    
    // Show modal
    document.getElementById('classDetailModal').classList.add('show');
}

// Close class detail
function closeClassDetail() {
    document.getElementById('classDetailModal').classList.remove('show');
    currentClassDetail = null;
}

// Initialize detail tabs
function initDetailTabs() {
    const tabs = document.querySelectorAll('.detail-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            document.getElementById('tab' + tabName.charAt(0).toUpperCase() + tabName.slice(1)).classList.add('active');
        });
    });
}

// Load students list
function loadStudentsList(classId) {
    const tbody = document.getElementById('studentsList');
    const students = studentsData[classId] || [];
    
    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #6c757d;">
                    <i class="fas fa-user-slash" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
                    Chưa có học viên nào trong lớp
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = students.map((student, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${student.code}</td>
            <td><strong>${student.name}</strong></td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td><span class="badge badge-success">${student.status}</span></td>
        </tr>
    `).join('');
}

// Load schedule detail
function loadScheduleDetail(classId) {
    const container = document.getElementById('scheduleCalendar');
    const schedule = scheduleData[classId] || [];
    
    if (schedule.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>Chưa có lịch học</h3>
                <p>Lịch học sẽ được cập nhật sớm.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = schedule.map(lesson => `
        <div class="schedule-day">
            <div class="schedule-day-header">
                <span class="day-name">${lesson.day}</span>
                <span class="day-date">${lesson.date}</span>
            </div>
            <div class="schedule-time-slot">
                <i class="fas fa-clock"></i>
                <span>${lesson.time}</span>
            </div>
            <div class="schedule-time-slot">
                <i class="fas fa-door-open"></i>
                <span>Phòng ${lesson.room}</span>
            </div>
        </div>
    `).join('');
}

// Load materials list
function loadMaterialsList(classId) {
    const container = document.getElementById('materialsList');
    const materials = materialsData[classId] || [];
    
    if (materials.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file"></i>
                <h3>Chưa có tài liệu</h3>
                <p>Chưa có tài liệu học tập nào được upload.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = materials.map(material => {
        const icon = getFileIcon(material.type);
        return `
            <div class="material-item">
                <div class="material-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="material-info">
                    <div class="material-name">${material.name}</div>
                    <div class="material-meta">${material.size} • ${material.date}</div>
                </div>
                <div class="material-actions">
                    <button class="btn btn-sm btn-primary" onclick="downloadMaterial(${material.id})">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Get file icon
function getFileIcon(type) {
    const icons = {
        'pdf': 'fas fa-file-pdf',
        'docx': 'fas fa-file-word',
        'pptx': 'fas fa-file-powerpoint',
        'xlsx': 'fas fa-file-excel',
        'audio': 'fas fa-file-audio',
        'video': 'fas fa-file-video'
    };
    return icons[type] || 'fas fa-file';
}

// Action functions
function goToAttendance(classId) {
    window.location.href = `attendance.html?classId=${classId}`;
}

function uploadMaterial() {
    alert('Chức năng upload tài liệu sẽ được implement với backend');
}

function downloadMaterial(materialId) {
    alert('Đang tải tài liệu... (sẽ được implement với backend)');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('classDetailModal');
    if (event.target == modal) {
        closeClassDetail();
    }
}
