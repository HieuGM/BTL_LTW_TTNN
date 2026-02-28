// Courses Management JavaScript

// Sample courses data
let coursesData = [
    {
        id: 'course001',
        code: 'IELTS-001',
        name: 'IELTS Foundation',
        level: 'Cơ bản',
        description: 'Khóa học IELTS cơ bản cho người mới bắt đầu',
        target: 'IELTS 5.0-5.5',
        sessions: 60,
        tuition: 6500000,
        materials: 'Cambridge IELTS 1-10',
        status: 'active',
        students: 120
    },
    {
        id: 'course002',
        code: 'IELTS-002',
        name: 'IELTS Intermediate',
        level: 'Trung cấp',
        description: 'Khóa học IELTS trung cấp',
        target: 'IELTS 6.0-6.5',
        sessions: 80,
        tuition: 8500000,
        materials: 'Cambridge IELTS 11-15',
        status: 'active',
        students: 95
    },
    {
        id: 'course003',
        code: 'TOEIC-001',
        name: 'TOEIC Cơ bản',
        level: 'Cơ bản',
        description: 'Khóa học TOEIC cho người mới',
        target: 'TOEIC 450-650',
        sessions: 40,
        tuition: 5500000,
        materials: 'Longman TOEIC',
        status: 'active',
        students: 85
    },
    {
        id: 'course004',
        code: 'TOEIC-002',
        name: 'TOEIC 650+',
        level: 'Trung cấp',
        description: 'Khóa học TOEIC 650 trở lên',
        target: 'TOEIC 650-850',
        sessions: 50,
        tuition: 6800000,
        materials: 'ETS TOEIC Official',
        status: 'active',
        students: 72
    },
    {
        id: 'course005',
        code: 'CONV-001',
        name: 'Giao tiếp cơ bản',
        level: 'Cơ bản',
        description: 'Khóa học giao tiếp tiếng Anh cho người đi làm',
        target: 'Giao tiếp tự tin',
        sessions: 30,
        tuition: 4200000,
        materials: 'English for Business',
        status: 'active',
        students: 65
    },
    {
        id: 'course006',
        code: 'IELTS-003',
        name: 'IELTS Advanced',
        level: 'Nâng cao',
        description: 'Khóa học IELTS nâng cao',
        target: 'IELTS 7.0+',
        sessions: 100,
        tuition: 12000000,
        materials: 'Cambridge IELTS 16+',
        status: 'inactive',
        students: 0
    }
];

let courseToDelete = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCourses();
    setupFilters();
    setupSearch();
});

// Load courses
function loadCourses(filteredData = null) {
    const tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;
    
    const data = filteredData || coursesData;
    tbody.innerHTML = '';
    
    data.forEach(course => {
        const row = createCourseRow(course);
        tbody.appendChild(row);
    });
    
    updatePagination(data.length);
}

function createCourseRow(course) {
    const tr = document.createElement('tr');
    
    const statusMap = {
        'active': { text: 'Đang mở', class: 'badge-success' },
        'inactive': { text: 'Tạm ngưng', class: 'badge-secondary' }
    };
    
    const status = statusMap[course.status] || statusMap['active'];
    
    tr.innerHTML = `
        <td><strong>${course.code}</strong></td>
        <td>${course.name}</td>
        <td>${course.level}</td>
        <td>${course.target}</td>
        <td>${course.sessions} buổi</td>
        <td><strong>${formatCurrency(course.tuition)}</strong></td>
        <td>${course.students} HV</td>
        <td><span class="badge ${status.class}">${status.text}</span></td>
        <td>
            <div class="table-actions">
                <button class="btn btn-outline btn-sm" onclick="viewCourse('${course.id}')" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-outline btn-sm" onclick="editCourse('${course.id}')" title="Chỉnh sửa">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteCourse('${course.id}')" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return tr;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(amount);
}

// View course details
function viewCourse(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
    
    alert(`Chi tiết khóa học:\n\n` +
          `Mã: ${course.code}\n` +
          `Tên: ${course.name}\n` +
          `Trình độ: ${course.level}\n` +
          `Mục tiêu: ${course.target}\n` +
          `Số buổi: ${course.sessions}\n` +
          `Học phí: ${formatCurrency(course.tuition)}\n` +
          `Giáo trình: ${course.materials}\n` +
          `Học viên đang học: ${course.students}\n` +
          `Mô tả: ${course.description}`);
}

// Edit course
function editCourse(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
    
    // Navigate to course form page with course ID
    window.location.href = `course-form.html?id=${courseId}`;
}

// Delete course
function deleteCourse(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
    
    courseToDelete = courseId;
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.add('active');
        
        // Update modal content
        const modalBody = modal.querySelector('.modal-body p');
        if (modalBody) {
            modalBody.textContent = `Bạn có chắc chắn muốn xóa khóa học "${course.name}" không?`;
        }
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.remove('active');
    }
    courseToDelete = null;
}

function confirmDelete() {
    if (!courseToDelete) return;
    
    const course = coursesData.find(c => c.id === courseToDelete);
    
    if (course && course.students > 0) {
        if (!confirm(`⚠️ Cảnh báo: Khóa học này có ${course.students} học viên đang học.\n\nBạn có chắc chắn muốn xóa?`)) {
            closeDeleteModal();
            return;
        }
    }
    
    coursesData = coursesData.filter(c => c.id !== courseToDelete);
    loadCourses();
    closeDeleteModal();
    showNotification('Đã xóa khóa học thành công!', 'success');
}

// Setup filters
function setupFilters() {
    const levelFilter = document.getElementById('levelFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (levelFilter) {
        levelFilter.addEventListener('change', applyFilters);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    const levelFilter = document.getElementById('levelFilter')?.value;
    const statusFilter = document.getElementById('statusFilter')?.value;
    const searchQuery = document.getElementById('searchCourse')?.value.toLowerCase();
    
    let filtered = coursesData;
    
    // Filter by level
    if (levelFilter) {
        filtered = filtered.filter(c => c.level === levelFilter);
    }
    
    // Filter by status
    if (statusFilter) {
        filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(searchQuery) ||
            c.code.toLowerCase().includes(searchQuery) ||
            c.description.toLowerCase().includes(searchQuery)
        );
    }
    
    loadCourses(filtered);
}

// Setup search
function setupSearch() {
    const searchInput = document.getElementById('searchCourse');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
}

// Update pagination
function updatePagination(totalCourses) {
    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
        paginationInfo.innerHTML = `Hiển thị <strong>1-${Math.min(totalCourses, 10)}</strong> trong tổng số <strong>${totalCourses}</strong> khóa học`;
    }
}

// Navigate to add course page
function addNewCourse() {
    window.location.href = 'course-form.html';
}

// Close modal on overlay click
const deleteModal = document.getElementById('deleteModal');
if (deleteModal) {
    deleteModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeDeleteModal();
        }
    });
}

// Notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#1cc88a' : type === 'error' ? '#e74a3b' : type === 'warning' ? '#f6c23e' : '#4e73df'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        min-width: 250px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations CSS
if (!document.getElementById('courses-animations')) {
    const style = document.createElement('style');
    style.id = 'courses-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

console.log('Courses page loaded successfully');
