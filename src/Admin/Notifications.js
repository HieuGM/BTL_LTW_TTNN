// Notifications Management JavaScript

// Sample data storage
let notificationsData = [
    {
        id: 'noti001',
        type: 'general',
        target: 'all',
        targetClasses: [],
        title: 'Thông báo nghỉ Tết Nguyên Đán 2026',
        content: 'Trung tâm xin thông báo lịch nghỉ Tết Nguyên Đán từ ngày 26/01 đến 02/02/2026. Các lớp học sẽ được dời lịch và thông báo cụ thể sau.',
        status: 'sent',
        sendTime: '2026-02-20T10:30',
        sendNow: true,
        sendEmail: true,
        showInSystem: true,
        readCount: 245,
        totalRecipients: 280
    },
    {
        id: 'noti002',
        type: 'schedule',
        target: 'class',
        targetClasses: ['CLS001'],
        title: 'Đổi lịch học - Lớp IELTS 6.5 Sáng',
        content: 'Thông báo đổi lịch học từ T2-T4-T6 sang T3-T5-T7 do giảng viên có việc đột xuất. Lịch học mới bắt đầu từ tuần sau.',
        status: 'sent',
        sendTime: '2026-02-22T14:20',
        sendNow: true,
        sendEmail: true,
        showInSystem: true,
        readCount: 14,
        totalRecipients: 15
    },
    {
        id: 'noti003',
        type: 'tuition',
        target: 'individual',
        targetClasses: [],
        title: 'Nhắc nhở đóng học phí tháng 3',
        content: 'Nhắc nhở các học viên chưa đóng học phí tháng 3/2026. Hạn đóng: 05/03/2026. Vui lòng liên hệ phòng kế toán để được hỗ trợ.',
        status: 'pending',
        sendTime: '2026-03-01T08:00',
        sendNow: false,
        sendEmail: true,
        showInSystem: true,
        readCount: 0,
        totalRecipients: 25
    },
    {
        id: 'noti004',
        type: 'exam',
        target: 'class',
        targetClasses: ['CLS001', 'CLS002', 'CLS004'],
        title: 'Thông báo kiểm tra giữa khóa',
        content: 'Thông báo lịch kiểm tra giữa khóa cho các lớp IELTS và TOEIC. Thời gian cụ thể sẽ được thông báo trong tuần này.',
        status: 'draft',
        sendTime: null,
        sendNow: false,
        sendEmail: false,
        showInSystem: true,
        readCount: 0,
        totalRecipients: 0
    }
];

let currentEditingNotificationId = null;

// Pagination variables
let currentPage = 1;
const itemsPerPage = 10;
let filteredNotificationsData = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    filteredNotificationsData = [...notificationsData];
    loadNotifications();
    setupFilters();
    updateStatistics();
});

function loadNotifications() {
    const container = document.querySelector('.notifications-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredNotificationsData.slice(startIndex, endIndex);
    
    if (paginatedData.length === 0 && filteredNotificationsData.length > 0) {
        currentPage = 1;
        loadNotifications();
        return;
    }
    
    paginatedData.forEach(notification => {
        const item = createNotificationItem(notification);
        container.appendChild(item);
    });
    
    updatePagination();
}

function createNotificationItem(notification) {
    const div = document.createElement('div');
    div.className = 'notification-item';
    
    const iconColors = {
        'general': '#4e73df',
        'class': '#1cc88a',
        'schedule': '#f6c23e',
        'exam': '#36b9cc',
        'tuition': '#e74a3b'
    };
    
    const iconMap = {
        'general': 'info-circle',
        'class': 'chalkboard',
        'schedule': 'calendar-times',
        'exam': 'graduation-cap',
        'tuition': 'file-invoice-dollar'
    };
    
    const statusMap = {
        'sent': { text: 'Đã gửi', badge: 'badge-sent' },
        'pending': { text: 'Chờ gửi', badge: 'badge-pending' },
        'draft': { text: 'Nháp', badge: 'badge-draft' }
    };
    
    const targetText = notification.target === 'all' ? 'Toàn bộ học viên' :
                      notification.target === 'class' ? `Lớp: ${notification.targetClasses.join(', ')}` :
                      `${notification.totalRecipients} học viên`;
    
    const timeText = notification.sendTime ? formatDateTime(notification.sendTime) :
                    notification.status === 'draft' ? 'Chưa lên lịch' : '';
    
    const readStats = notification.status === 'sent' ? 
        `<span><i class="fas fa-eye"></i> ${notification.readCount}/${notification.totalRecipients} đã đọc</span>` : '';
    
    const sendNowBtn = notification.status === 'pending' || notification.status === 'draft' ?
        `<button class="btn-icon btn-success" title="Gửi ngay" onclick="sendNow('${notification.id}')">
            <i class="fas fa-paper-plane"></i>
        </button>` : '';
    
    div.innerHTML = `
        <div class="notification-icon" style="background: ${iconColors[notification.type]};">
            <i class="fas fa-${iconMap[notification.type]}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-header">
                <h4>${notification.title}</h4>
                <span class="badge ${statusMap[notification.status].badge}">${statusMap[notification.status].text}</span>
            </div>
            <p>${notification.content}</p>
            <div class="notification-meta">
                <span><i class="fas fa-users"></i> ${targetText}</span>
                <span><i class="fas fa-clock"></i> ${timeText}</span>
                ${readStats}
            </div>
        </div>
        <div class="notification-actions">
            <button class="btn-icon" title="Xem chi tiết" onclick="viewNotification('${notification.id}')">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon" title="Chỉnh sửa" onclick="editNotification('${notification.id}')">
                <i class="fas fa-edit"></i>
            </button>
            ${sendNowBtn}
            <button class="btn-icon btn-danger" title="Xóa" onclick="deleteNotification('${notification.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return div;
}

function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function showCreateNotificationModal() {
    currentEditingNotificationId = null;
    document.querySelector('#notificationModal .modal-header h2').textContent = 'Gửi thông báo mới';
    document.getElementById('notificationModal').style.display = 'block';
    resetNotificationForm();
}

function closeModal() {
    document.getElementById('notificationModal').style.display = 'none';
    resetNotificationForm();
}

function resetNotificationForm() {
    const modal = document.getElementById('notificationModal');
    const inputs = modal.querySelectorAll('input:not([type="checkbox"]), select, textarea');
    inputs.forEach(input => {
        if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        } else {
            input.value = '';
        }
    });
    
    const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = cb.nextSibling?.textContent?.includes('hệ thống') || false;
    });
    
    document.getElementById('classSelectGroup').style.display = 'none';
}

function toggleTargetOptions() {
    const targetSelect = document.getElementById('targetSelect');
    const classSelectGroup = document.getElementById('classSelectGroup');
    
    if (targetSelect.value === 'class') {
        classSelectGroup.style.display = 'block';
    } else {
        classSelectGroup.style.display = 'none';
    }
}

function viewNotification(notificationId) {
    const notification = notificationsData.find(n => n.id === notificationId);
    if (!notification) return;
    
    let details = `Chi tiết thông báo: ${notification.title}\n\n`;
    details += `Loại: ${getTypeText(notification.type)}\n`;
    details += `Đối tượng: ${getTargetText(notification)}\n`;
    details += `Trạng thái: ${getStatusText(notification.status)}\n`;
    details += `Nội dung:\n${notification.content}\n\n`;
    
    if (notification.status === 'sent') {
        details += `Đã đọc: ${notification.readCount}/${notification.totalRecipients}`;
    }
    
    alert(details);
}

function getTypeText(type) {
    const map = {
        'general': 'Thông báo chung',
        'class': 'Thông báo lớp học',
        'schedule': 'Thông báo lịch học',
        'exam': 'Thông báo kiểm tra',
        'tuition': 'Thông báo học phí'
    };
    return map[type] || type;
}

function getTargetText(notification) {
    if (notification.target === 'all') return 'Toàn bộ học viên';
    if (notification.target === 'class') return `Các lớp: ${notification.targetClasses.join(', ')}`;
    return `${notification.totalRecipients} học viên cụ thể`;
}

function getStatusText(status) {
    const map = {
        'sent': 'Đã gửi',
        'pending': 'Chờ gửi',
        'draft': 'Nháp'
    };
    return map[status] || status;
}

function editNotification(notificationId) {
    const notification = notificationsData.find(n => n.id === notificationId);
    if (!notification) return;
    
    if (notification.status === 'sent') {
        alert('Không thể chỉnh sửa thông báo đã gửi!');
        return;
    }
    
    currentEditingNotificationId = notificationId;
    document.querySelector('#notificationModal .modal-header h2').textContent = 'Chỉnh sửa thông báo';
    
    // Populate form
    const modal = document.getElementById('notificationModal');
    const inputs = modal.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        const label = input.previousElementSibling?.textContent || '';
        
        if (label.includes('Loại thông báo')) input.value = notification.type;
        else if (label.includes('Đối tượng nhận') && input.id === 'targetSelect') {
            input.value = notification.target;
            toggleTargetOptions();
        }
        else if (label.includes('Tiêu đề')) input.value = notification.title;
        else if (label.includes('Nội dung')) input.value = notification.content;
        else if (label.includes('Gửi vào lúc')) input.value = notification.sendNow ? 'now' : 'schedule';
        else if (input.type === 'datetime-local' && notification.sendTime) {
            input.value = notification.sendTime;
        }
    });
    
    const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        if (cb.nextSibling?.textContent?.includes('Email')) cb.checked = notification.sendEmail;
        if (cb.nextSibling?.textContent?.includes('hệ thống')) cb.checked = notification.showInSystem;
    });
    
    showCreateNotificationModal();
}

function deleteNotification(notificationId) {
    const notification = notificationsData.find(n => n.id === notificationId);
    if (!notification) return;
    
    if (!confirm(`Bạn có chắc chắn muốn xóa thông báo "${notification.title}"?`)) {
        return;
    }
    
    notificationsData = notificationsData.filter(n => n.id !== notificationId);
    applyFilters();
    updateStatistics();
    showNotification('Đã xóa thông báo thành công!', 'success');
}

function sendNow(notificationId) {
    const notification = notificationsData.find(n => n.id === notificationId);
    if (!notification) return;
    
    if (!confirm(`Gửi thông báo "${notification.title}" ngay bây giờ?\n\nĐối tượng: ${getTargetText(notification)}`)) {
        return;
    }
    
    notification.status = 'sent';
    notification.sendTime = new Date().toISOString();
    notification.sendNow = true;
    
    // Simulate sending
    setTimeout(() => {
        notification.readCount = Math.floor(notification.totalRecipients * 0.3);
    }, 1000);
    
    applyFilters();
    updateStatistics();
    showNotification('Đã gửi thông báo thành công!', 'success');
}

function saveNotification(asDraft = false) {
    const modal = document.getElementById('notificationModal');
    const inputs = modal.querySelectorAll('input, select, textarea');
    
    const formData = {
        type: '',
        target: '',
        targetClasses: [],
        title: '',
        content: '',
        sendNow: true,
        sendTime: null,
        sendEmail: false,
        showInSystem: true
    };
    
    inputs.forEach(input => {
        const label = input.previousElementSibling?.textContent || '';
        
        if (label.includes('Loại thông báo')) formData.type = input.value;
        else if (label.includes('Đối tượng nhận') && input.id === 'targetSelect') formData.target = input.value;
        else if (label.includes('Tiêu đề')) formData.title = input.value;
        else if (label.includes('Nội dung')) formData.content = input.value;
        else if (label.includes('Gửi vào lúc')) formData.sendNow = input.value === 'now';
        else if (input.type === 'datetime-local') formData.sendTime = input.value || null;
    });
    
    const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        if (cb.nextSibling?.textContent?.includes('Email')) formData.sendEmail = cb.checked;
        if (cb.nextSibling?.textContent?.includes('hệ thống')) formData.showInSystem = cb.checked;
    });
    
    // Get selected classes if target is 'class'
    if (formData.target === 'class') {
        const classSelect = modal.querySelector('#classSelectGroup select');
        if (classSelect) {
            formData.targetClasses = Array.from(classSelect.selectedOptions).map(opt => opt.value);
        }
    }
    
    // Validation
    if (!formData.type || !formData.target || !formData.title || !formData.content) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    if (formData.target === 'class' && formData.targetClasses.length === 0) {
        alert('Vui lòng chọn ít nhất một lớp!');
        return;
    }
    
    // Determine status
    let status = 'draft';
    if (asDraft) {
        status = 'draft';
    } else if (formData.sendNow) {
        status = 'sent';
        formData.sendTime = new Date().toISOString();
    } else {
        status = 'pending';
    }
    
    // Calculate recipients (simulated)
    let totalRecipients = 0;
    if (formData.target === 'all') totalRecipients = 280;
    else if (formData.target === 'class') totalRecipients = formData.targetClasses.length * 15;
    else totalRecipients = 25;
    
    if (currentEditingNotificationId) {
        // Update existing
        const index = notificationsData.findIndex(n => n.id === currentEditingNotificationId);
        if (index !== -1) {
            notificationsData[index] = {
                ...notificationsData[index],
                ...formData,
                status,
                totalRecipients,
                readCount: status === 'sent' ? Math.floor(totalRecipients * 0.3) : 0
            };
            showNotification('Cập nhật thông báo thành công!', 'success');
        }
    } else {
        // Create new
        const newNotification = {
            id: 'noti' + String(notificationsData.length + 1).padStart(3, '0'),
            ...formData,
            status,
            totalRecipients,
            readCount: status === 'sent' ? Math.floor(totalRecipients * 0.3) : 0
        };
        notificationsData.push(newNotification);
        showNotification(asDraft ? 'Lưu nháp thành công!' : 'Gửi thông báo thành công!', 'success');
    }
    
    applyFilters();
    updateStatistics();
    closeModal();
}

function setupFilters() {
    const typeFilter = document.getElementById('typeFilter');
    const targetFilter = document.getElementById('targetFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchBtn = document.querySelector('.filter-bar .btn-search');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', applyFilters);
    }
    
    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    if (targetFilter) targetFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
    const typeFilter = document.getElementById('typeFilter')?.value;
    const targetFilter = document.getElementById('targetFilter')?.value;
    const statusFilter = document.getElementById('statusFilter')?.value;
    
    filteredNotificationsData = [...notificationsData];
    
    if (typeFilter) {
        filteredNotificationsData = filteredNotificationsData.filter(n => n.type === typeFilter);
    }
    
    if (targetFilter) {
        filteredNotificationsData = filteredNotificationsData.filter(n => n.target === targetFilter);
    }
    
    if (statusFilter) {
        filteredNotificationsData = filteredNotificationsData.filter(n => n.status === statusFilter);
    }
    
    // Reset to first page when filtering
    currentPage = 1;
    
    // Reload with filtered data
    loadNotifications();
}

function updateStatistics() {
    const today = new Date().toISOString().split('T')[0];
    const sentToday = notificationsData.filter(n => 
        n.status === 'sent' && n.sendTime?.startsWith(today)
    ).length;
    
    const totalSent = notificationsData.filter(n => n.status === 'sent');
    const totalRead = totalSent.reduce((sum, n) => sum + n.readCount, 0);
    const totalRecipients = totalSent.reduce((sum, n) => sum + n.totalRecipients, 0);
    const readRate = totalRecipients > 0 ? Math.round((totalRead / totalRecipients) * 100) : 0;
    
    const pending = notificationsData.filter(n => n.status === 'pending').length;
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 3) {
        statCards[0].querySelector('h3').textContent = sentToday;
        statCards[1].querySelector('h3').textContent = readRate + '%';
        statCards[2].querySelector('h3').textContent = pending;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
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
    const modal = document.getElementById('notificationModal');
    if (event.target === modal) {
        closeModal();
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
    const totalPages = Math.ceil(filteredNotificationsData.length / itemsPerPage);
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
    const totalPages = Math.ceil(filteredNotificationsData.length / itemsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    loadNotifications();
}
