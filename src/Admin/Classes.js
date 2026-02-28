// Classes Management JavaScript

// Sample data storage (in production, this would be from a database/API)
let classesData = [
    {
        id: 'CLS001',
        name: 'IELTS 6.5 - Sáng',
        course: 'IELTS Foundation',
        teacher: 'Nguyễn Văn A',
        schedule: 'T2-T4-T6 (8:00-10:00)',
        room: 'Phòng 101',
        currentStudents: 15,
        maxStudents: 20,
        status: 'ongoing',
        startDate: '2026-01-15',
        endDate: '2026-04-15',
        notes: ''
    },
    {
        id: 'CLS002',
        name: 'TOEIC 650+ - Tối',
        course: 'TOEIC Cơ bản',
        teacher: 'Trần Thị B',
        schedule: 'T3-T5-T7 (18:00-20:00)',
        room: 'Phòng 102',
        currentStudents: 18,
        maxStudents: 20,
        status: 'recruiting',
        startDate: '2026-03-01',
        endDate: '2026-05-30',
        notes: ''
    }
];

let currentEditingClassId = null;

// Pagination variables
let currentPage = 1;
const itemsPerPage = 10;
let filteredClassesData = []; // Store filtered data for pagination

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    filteredClassesData = [...classesData]; // Initialize with all data
    loadClasses();
    setupFilters();
});

function loadClasses() {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredClassesData.slice(startIndex, endIndex);
    
    if (paginatedData.length === 0 && filteredClassesData.length > 0) {
        // If current page has no data, go back to page 1
        currentPage = 1;
        loadClasses();
        return;
    }
    
    paginatedData.forEach(classItem => {
        const row = createClassRow(classItem);
        tbody.appendChild(row);
    });
    
    updatePagination();
}

function createClassRow(classItem) {
    const tr = document.createElement('tr');
    
    const capacityStatus = classItem.currentStudents >= classItem.maxStudents ? 'full' : 
                           classItem.currentStudents >= classItem.maxStudents * 0.8 ? 'warning' : '';
    
    const statusMap = {
        'draft': 'Nháp',
        'recruiting': 'Đang tuyển',
        'ongoing': 'Đang học',
        'completed': 'Kết thúc'
    };
    
    tr.innerHTML = `
        <td>${classItem.id}</td>
        <td>${classItem.name}</td>
        <td>${classItem.course}</td>
        <td>${classItem.teacher}</td>
        <td>${classItem.schedule}</td>
        <td><span class="capacity ${capacityStatus}">${classItem.currentStudents}/${classItem.maxStudents}</span></td>
        <td><span class="badge badge-${classItem.status}">${statusMap[classItem.status]}</span></td>
        <td>
            <button class="btn-icon" title="Xem chi tiết" onclick="viewClassDetail('${classItem.id}')">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon" title="Chỉnh sửa" onclick="editClass('${classItem.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon btn-danger" title="Xóa" onclick="deleteClass('${classItem.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    return tr;
}

function showAddClassModal() {
    currentEditingClassId = null;
    document.querySelector('.modal-header h2').textContent = 'Thêm lớp mới';
    document.getElementById('classModal').style.display = 'block';
    resetForm();
}

function closeModal() {
    document.getElementById('classModal').style.display = 'none';
    resetForm();
}

function resetForm() {
    const form = document.querySelector('#classModal form') || document.querySelector('#classModal .modal-body');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            } else if (input.type === 'number') {
                input.value = '20';
            } else {
                input.value = '';
            }
        });
    }
}

function viewClassDetail(classId) {
    const classItem = classesData.find(c => c.id === classId);
    if (!classItem) return;
    
    alert(`Chi tiết lớp ${classId}:\n\n` +
          `Tên lớp: ${classItem.name}\n` +
          `Khóa học: ${classItem.course}\n` +
          `Giảng viên: ${classItem.teacher}\n` +
          `Lịch học: ${classItem.schedule}\n` +
          `Phòng: ${classItem.room}\n` +
          `Sĩ số: ${classItem.currentStudents}/${classItem.maxStudents}\n` +
          `Ngày học: ${classItem.startDate} - ${classItem.endDate}`);
    
    // In production: Navigate to detailed page
}

function editClass(classId) {
    const classItem = classesData.find(c => c.id === classId);
    if (!classItem) return;
    
    currentEditingClassId = classId;
    document.querySelector('.modal-header h2').textContent = 'Chỉnh sửa lớp';
    
    // Populate form with class data
    const modal = document.getElementById('classModal');
    const inputs = modal.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        const name = input.placeholder || input.previousElementSibling?.textContent;
        
        if (name && name.includes('Tên lớp')) input.value = classItem.name;
        else if (name && name.includes('Sĩ số')) input.value = classItem.maxStudents;
        else if (name && name.includes('Lịch học')) input.value = classItem.schedule;
        else if (name && name.includes('Ghi chú')) input.value = classItem.notes || '';
    });
    
    showAddClassModal();
}

function deleteClass(classId) {
    const classItem = classesData.find(c => c.id === classId);
    if (!classItem) return;
    
    if (confirm(`Bạn có chắc chắn muốn xóa lớp "${classItem.name}"?\n\nLưu ý: Thao tác này không thể hoàn tác!`)) {
        classesData = classesData.filter(c => c.id !== classId);
        applyFilters(); // Reapply filters to update filtered data
        showNotification('Đã xóa lớp thành công!', 'success');
    }
}

function saveClass() {
    const modal = document.getElementById('classModal');
    const inputs = modal.querySelectorAll('input, select, textarea');
    
    // Collect form data
    const formData = {};
    inputs.forEach(input => {
        const label = input.previousElementSibling?.textContent || '';
        if (label.includes('Tên lớp')) formData.name = input.value;
        else if (label.includes('Khóa học')) formData.course = input.value;
        else if (label.includes('Giảng viên')) formData.teacher = input.value;
        else if (label.includes('Phòng')) formData.room = input.value;
        else if (label.includes('Sĩ số')) formData.maxStudents = parseInt(input.value);
        else if (label.includes('Lịch học')) formData.schedule = input.value;
        else if (label.includes('khai giảng')) formData.startDate = input.value;
        else if (label.includes('kết thúc')) formData.endDate = input.value;
        else if (label.includes('Trạng thái')) formData.status = input.value;
        else if (label.includes('Ghi chú')) formData.notes = input.value;
    });
    
    // Validation
    if (!formData.name || !formData.course || !formData.teacher) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    // Check for conflicts
    const conflicts = checkScheduleConflicts(formData);
    if (conflicts.length > 0 && !currentEditingClassId) {
        if (!confirm('⚠️ Phát hiện xung đột:\n\n' + conflicts.join('\n') + '\n\nBạn có muốn tiếp tục?')) {
            return;
        }
    }
    
    if (currentEditingClassId) {
        // Update existing class
        const index = classesData.findIndex(c => c.id === currentEditingClassId);
        if (index !== -1) {
            classesData[index] = { ...classesData[index], ...formData };
            showNotification('Cập nhật lớp thành công!', 'success');
        }
    } else {
        // Add new class
        const newClass = {
            id: 'CLS' + String(classesData.length + 1).padStart(3, '0'),
            currentStudents: 0,
            ...formData
        };
        classesData.push(newClass);
        showNotification('Thêm lớp mới thành công!', 'success');
    }
    
    // Reapply filters to update filtered data
    applyFilters();
    closeModal();
}

function checkScheduleConflicts(classData) {
    const conflicts = [];
    
    // Check teacher conflicts
    const teacherConflicts = classesData.filter(c => 
        c.teacher === classData.teacher && 
        c.schedule === classData.schedule &&
        c.id !== currentEditingClassId
    );
    
    if (teacherConflicts.length > 0) {
        conflicts.push(`❌ Giảng viên ${classData.teacher} đã có lịch dạy trùng (${classData.schedule})`);
    }
    
    // Check room conflicts
    const roomConflicts = classesData.filter(c => 
        c.room === classData.room && 
        c.schedule === classData.schedule &&
        c.id !== currentEditingClassId
    );
    
    if (roomConflicts.length > 0) {
        conflicts.push(`❌ ${classData.room} đã được sử dụng trong khung giờ này (${classData.schedule})`);
    }
    
    return conflicts;
}

function setupFilters() {
    const courseFilter = document.getElementById('courseFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchClass');
    const searchBtn = document.querySelector('.btn-search');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', applyFilters);
    }
    
    if (courseFilter) courseFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') applyFilters();
        });
    }
}

function applyFilters() {
    const courseFilter = document.getElementById('courseFilter')?.value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter')?.value;
    const searchText = document.getElementById('searchClass')?.value.toLowerCase();
    
    filteredClassesData = [...classesData];
    
    if (courseFilter) {
        filteredClassesData = filteredClassesData.filter(c => c.course.toLowerCase().includes(courseFilter));
    }
    
    if (statusFilter) {
        filteredClassesData = filteredClassesData.filter(c => c.status === statusFilter);
    }
    
    if (searchText) {
        filteredClassesData = filteredClassesData.filter(c => 
            c.name.toLowerCase().includes(searchText) ||
            c.id.toLowerCase().includes(searchText) ||
            c.teacher.toLowerCase().includes(searchText)
        );
    }
    
    // Reset to first page when filtering
    currentPage = 1;
    
    // Reload with filtered data
    loadClasses();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#1cc88a' : type === 'error' ? '#e74a3b' : '#4e73df'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('classModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Add CSS for notification animations
const style = document.createElement('style');
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

// Pagination functions
function updatePagination() {
    const totalPages = Math.ceil(filteredClassesData.length / itemsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    
    if (!paginationContainer) return;
    
    // Hide pagination if only 1 page or no data
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = '';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn-page';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => changePage(currentPage - 1);
    paginationContainer.appendChild(prevBtn);
    
    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'btn-page' + (i === currentPage ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.onclick = () => changePage(i);
        paginationContainer.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-page';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => changePage(currentPage + 1);
    paginationContainer.appendChild(nextBtn);
}

function changePage(page) {
    const totalPages = Math.ceil(filteredClassesData.length / itemsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    loadClasses();
}
