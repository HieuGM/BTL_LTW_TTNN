// Enroll Requests Management JavaScript

// Sample data storage
let requestsData = [
    {
        id: 'REQ001',
        name: 'Nguyễn Văn A',
        phone: '0912345678',
        email: 'nguyenvana@email.com',
        targetType: 'Sinh viên',
        course: 'IELTS Foundation',
        level: 'Mất gốc',
        goal: 'IELTS 6.5',
        date: '2026-02-24',
        time: '09:30',
        status: 'new',
        notes: 'Có thể học tối thứ 2, 4, 6 hoặc cuối tuần. Mong muốn học nhóm nhỏ 10-15 người.',
        assignedClass: '',
        processingNotes: '',
        history: [
            { date: '24/02/2026 09:30', action: 'Tạo đơn đăng ký', detail: 'Học viên đăng ký qua website' }
        ]
    },
    {
        id: 'REQ002',
        name: 'Trần Thị B',
        phone: '0987654321',
        email: 'tranthib@email.com',
        targetType: 'Người đi làm',
        course: 'TOEIC Cơ bản',
        level: 'Cơ bản',
        goal: 'TOEIC 650+',
        date: '2026-02-23',
        time: '14:20',
        status: 'contacted',
        notes: 'Ưu tiên lớp tối',
        assignedClass: '',
        processingNotes: 'Đã liên hệ và tư vấn',
        history: [
            { date: '23/02/2026 14:20', action: 'Tạo đơn đăng ký', detail: 'Học viên đăng ký qua website' },
            { date: '23/02/2026 15:00', action: 'Cập nhật trạng thái', detail: 'Chuyển sang "Đã liên hệ"' }
        ]
    },
    {
        id: 'REQ003',
        name: 'Lê Văn C',
        phone: '0901234567',
        email: 'levanc@email.com',
        targetType: 'Người đi làm',
        course: 'Giao tiếp người đi làm',
        level: 'Trung bình',
        goal: 'Giao tiếp tự tin',
        date: '2026-02-22',
        time: '10:15',
        status: 'assigned',
        notes: 'Chỉ học cuối tuần',
        assignedClass: 'CLS003',
        processingNotes: 'Đã xếp lớp Giao tiếp cơ bản - cuối tuần',
        history: [
            { date: '22/02/2026 10:15', action: 'Tạo đơn đăng ký', detail: 'Học viên gọi điện tư vấn' },
            { date: '22/02/2026 11:00', action: 'Đã xếp lớp', detail: 'Xếp vào lớp CLS003' }
        ]
    }
];

let currentRequestId = null;

// Pagination variables
let currentPage = 1;
const itemsPerPage = 10;
let filteredRequestsData = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    filteredRequestsData = [...requestsData];
    loadRequests();
    setupFilters();
    setDateRange();
    setupStatusChangeHandler();
});

function loadRequests() {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredRequestsData.slice(startIndex, endIndex);
    
    if (paginatedData.length === 0 && filteredRequestsData.length > 0) {
        currentPage = 1;
        loadRequests();
        return;
    }
    
    paginatedData.forEach(request => {
        const row = createRequestRow(request);
        tbody.appendChild(row);
    });
    
    updateStatistics();
    updatePagination();
function createRequestRow(request) {
    const tr = document.createElement('tr');
    
    const statusMap = {
        'new': { text: 'Mới', badge: 'badge-new' },
        'contacted': { text: 'Đã liên hệ', badge: 'badge-contacted' },
        'assigned': { text: 'Đã xếp lớp', badge: 'badge-assigned' },
        'paid': { text: 'Đã đóng phí', badge: 'badge-paid' },
        'completed': { text: 'Hoàn tất', badge: 'badge-completed' },
        'cancelled': { text: 'Hủy', badge: 'badge-cancelled' }
    };
    
    const status = statusMap[request.status] || statusMap['new'];
    const formattedDate = formatDate(request.date);
    
    tr.innerHTML = `
        <td>${request.id}</td>
        <td>${request.name}</td>
        <td>${request.phone}</td>
        <td>${request.course}</td>
        <td>${request.level}</td>
        <td>${formattedDate}</td>
        <td><span class="badge ${status.badge}">${status.text}</span></td>
        <td>
            <button class="btn-icon" title="Xem chi tiết" onclick="viewRequest('${request.id}')">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon btn-success" title="Xử lý" onclick="processRequest('${request.id}')">
                <i class="fas fa-tasks"></i>
            </button>
        </td>
    `;
    
    return tr;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function showAddRequestModal() {
    document.getElementById('addRequestModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('requestModal').style.display = 'none';
    currentRequestId = null;
}

function closeAddModal() {
    document.getElementById('addRequestModal').style.display = 'none';
    resetAddRequestForm();
}

function resetAddRequestForm() {
    const modal = document.getElementById('addRequestModal');
    const inputs = modal.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        } else {
            input.value = '';
        }
    });
}

function viewRequest(requestId) {
    const request = requestsData.find(r => r.id === requestId);
    if (!request) return;
    
    currentRequestId = requestId;
    populateRequestModal(request);
    document.getElementById('requestModal').style.display = 'block';
}

function processRequest(requestId) {
    viewRequest(requestId);
}

function populateRequestModal(request) {
    const modal = document.getElementById('requestModal');
    
    // Update modal title
    modal.querySelector('.modal-header h2').textContent = `Chi tiết đơn đăng ký - ${request.id}`;
    
    // Update info fields
    const infoItems = modal.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        const label = item.querySelector('strong')?.textContent;
        const valueSpan = item.querySelector('span');
        const valuePara = item.querySelector('p');
        
        if (label && valueSpan) {
            if (label.includes('Họ và tên')) valueSpan.textContent = request.name;
            else if (label.includes('Số điện thoại')) valueSpan.textContent = request.phone;
            else if (label.includes('Email')) valueSpan.textContent = request.email || 'N/A';
            else if (label.includes('Đối tượng')) valueSpan.textContent = request.targetType;
            else if (label.includes('Khóa học')) valueSpan.textContent = request.course;
            else if (label.includes('Trình độ')) valueSpan.textContent = request.level;
            else if (label.includes('Mục tiêu')) valueSpan.textContent = request.goal || 'N/A';
            else if (label.includes('Ngày đăng ký')) valueSpan.textContent = `${formatDate(request.date)} ${request.time}`;
        }
        
        if (label && label.includes('Ghi chú') && valuePara) {
            valuePara.textContent = request.notes || 'Không có ghi chú';
        }
    });
    
    // Update status select
    const statusSelect = document.getElementById('statusSelect');
    if (statusSelect) {
        statusSelect.value = request.status;
    }
    
    // Show/hide class assignment
    const classAssignSection = document.getElementById('classAssignSection');
    if (classAssignSection) {
        if (['assigned', 'paid', 'completed'].includes(request.status)) {
            classAssignSection.style.display = 'block';
        } else {
            classAssignSection.style.display = 'none';
        }
    }
    
    // Update activity log
    updateActivityLog(request.history);
}

function updateActivityLog(history) {
    const logContainer = document.querySelector('.activity-log');
    if (!logContainer) return;
    
    logContainer.innerHTML = '';
    
    history.forEach(entry => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
            <div class="log-time">${entry.date}</div>
            <div class="log-content">
                <strong>${entry.action}</strong>
                <p>${entry.detail}</p>
            </div>
        `;
        logContainer.appendChild(logItem);
    });
}

function setupStatusChangeHandler() {
    const statusSelect = document.getElementById('statusSelect');
    if (statusSelect) {
        statusSelect.addEventListener('change', function(e) {
            const classAssignSection = document.getElementById('classAssignSection');
            if (['assigned', 'paid', 'completed'].includes(e.target.value)) {
                classAssignSection.style.display = 'block';
            } else {
                classAssignSection.style.display = 'none';
            }
        });
    }
}

function updateRequest() {
    if (!currentRequestId) return;
    
    const request = requestsData.find(r => r.id === currentRequestId);
    if (!request) return;
    
    const modal = document.getElementById('requestModal');
    const statusSelect = modal.querySelector('#statusSelect');
    const classSelect = modal.querySelector('#classAssignSection select');
    const notesTextarea = modal.querySelector('.form-group textarea');
    
    const oldStatus = request.status;
    const newStatus = statusSelect?.value || request.status;
    const assignedClass = classSelect?.value || '';
    const processingNotes = notesTextarea?.value || '';
    
    // Update request
    request.status = newStatus;
    request.assignedClass = assignedClass;
    request.processingNotes = processingNotes;
    
    // Add to history if status changed
    if (oldStatus !== newStatus) {
        const now = new Date();
        const dateStr = formatDateTime(now);
        const statusMap = {
            'new': 'Mới',
            'contacted': 'Đã liên hệ',
            'assigned': 'Đã xếp lớp',
            'paid': 'Đã đóng phí',
            'completed': 'Hoàn tất',
            'cancelled': 'Hủy'
        };
        
        request.history.push({
            date: dateStr,
            action: `Cập nhật trạng thái: ${statusMap[newStatus]}`,
            detail: processingNotes || 'Không có ghi chú'
        });
    }
    
    applyFilters();
    closeModal();
    showNotification('Cập nhật đơn đăng ký thành công!', 'success');
}

function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function saveNewRequest() {
    const modal = document.getElementById('addRequestModal');
    const inputs = modal.querySelectorAll('input, select, textarea');
    
    const formData = {};
    inputs.forEach(input => {
        const label = input.previousElementSibling?.textContent || '';
        
        if (label.includes('Họ và tên')) formData.name = input.value;
        else if (label.includes('Số điện thoại')) formData.phone = input.value;
        else if (label.includes('Email')) formData.email = input.value;
        else if (label.includes('Đối tượng')) formData.targetType = input.value;
        else if (label.includes('Khóa học')) formData.course = input.value;
        else if (label.includes('Trình độ')) formData.level = input.value;
        else if (label.includes('Mục tiêu')) formData.goal = input.value;
        else if (label.includes('Ghi chú')) formData.notes = input.value;
    });
    
    // Validation
    if (!formData.name || !formData.phone || !formData.course) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    // Create new request
    const now = new Date();
    const newRequest = {
        id: 'REQ' + String(requestsData.length + 1).padStart(3, '0'),
        date: now.toISOString().split('T')[0],
        time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        status: 'new',
        assignedClass: '',
        processingNotes: '',
        history: [
            { 
                date: formatDateTime(now), 
                action: 'Tạo đơn đăng ký', 
                detail: 'Đơn được tạo bởi Admin' 
            }
        ],
        ...formData
    };
    
    requestsData.push(newRequest);
    applyFilters();
    closeAddModal();
    showNotification('Thêm đơn đăng ký thành công!', 'success');
}

function setupFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const courseFilter = document.getElementById('courseFilter');
    const searchBtn = document.querySelector('.filter-bar .btn-search');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', applyFilters);
    }
    
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (courseFilter) courseFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
    const statusFilter = document.getElementById('statusFilter')?.value;
    const courseFilter = document.getElementById('courseFilter')?.value.toLowerCase();
    const fromDate = document.getElementById('fromDate')?.value;
    const toDate = document.getElementById('toDate')?.value;
    
    filteredRequestsData = [...requestsData];
    
    if (statusFilter) {
        filteredRequestsData = filteredRequestsData.filter(r => r.status === statusFilter);
    }
    
    if (courseFilter) {
        filteredRequestsData = filteredRequestsData.filter(r => r.course.toLowerCase().includes(courseFilter));
    }
    
    if (fromDate) {
        filteredRequestsData = filteredRequestsData.filter(r => r.date >= fromDate);
    }
    
    if (toDate) {
        filteredRequestsData = filteredRequestsData.filter(r => r.date <= toDate);
    }
    
    // Reset to first page when filtering
    currentPage = 1;
    
    // Reload with filtered data
    loadRequests();
}

function updateStatistics() {
    const newCount = requestsData.filter(r => r.status === 'new').length;
    const contactedCount = requestsData.filter(r => r.status === 'contacted').length;
    
    const now = new Date();
    const thisMonth = now.toISOString().slice(0, 7);
    const completedThisMonth = requestsData.filter(r => 
        r.status === 'completed' && r.date.startsWith(thisMonth)
    ).length;
    
    const cancelledCount = requestsData.filter(r => r.status === 'cancelled').length;
    
    // Update statistics cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('h3').textContent = newCount;
        statCards[1].querySelector('h3').textContent = contactedCount;
        statCards[2].querySelector('h3').textContent = completedThisMonth;
        statCards[3].querySelector('h3').textContent = cancelledCount;
    }
}

function setDateRange() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    
    if (fromDate) fromDate.value = firstDay.toISOString().split('T')[0];
    if (toDate) toDate.value = today.toISOString().split('T')[0];
}

function showNotification(message, type = 'info') {
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
    const requestModal = document.getElementById('requestModal');
    const addRequestModal = document.getElementById('addRequestModal');
    
    if (event.target === requestModal) {
        closeModal();
    }
    if (event.target === addRequestModal) {
        closeAddModal();
    }
}

// Add CSS for notification animations
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
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

// Pagination functions
function updatePagination() {
    const totalPages = Math.ceil(filteredRequestsData.length / itemsPerPage);
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
    const totalPages = Math.ceil(filteredRequestsData.length / itemsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    loadRequests();
}
