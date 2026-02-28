// Dashboard JavaScript

// Sample data
const dashboardData = {
    stats: {
        totalStudents: 1245,
        studentChange: 12.5,
        activeClasses: 42,
        classChange: 8.2,
        monthlyRevenue: 345000000,
        revenueChange: 15.3,
        totalDebt: 48500000,
        debtChange: -5.8
    },
    todayClasses: [
        {
            id: 'cls001',
            name: 'IELTS 6.0 - Sáng T2-T4-T6',
            course: 'IELTS 6.0',
            students: '16/20',
            teacher: 'Phạm Thị Mai',
            time: 'T2-T4-T6: 8:00-10:00',
            status: 'ongoing'
        },
        {
            id: 'cls002',
            name: 'TOEIC 650 - Tối T3-T5-T7',
            course: 'TOEIC 650',
            students: '15/18',
            teacher: 'Trần Văn Minh',
            time: 'T3-T5-T7: 18:30-20:30',
            status: 'ongoing'
        },
        {
            id: 'cls003',
            name: 'Giao tiếp cơ bản - Cuối tuần',
            course: 'Giao tiếp cơ bản',
            students: '12/15',
            teacher: 'Lê Thị Hoa',
            time: 'T7-CN: 9:00-11:00',
            status: 'recruiting'
        },
        {
            id: 'cls004',
            name: 'IELTS 7.0 - Chiều T2-T4-T6',
            course: 'IELTS 7.0',
            students: '8/12',
            teacher: 'Phạm Văn Nam',
            time: 'T2-T4-T6: 14:00-16:00',
            status: 'recruiting'
        }
    ],
    pendingTasks: [
        { id: 1, type: 'transfer', title: 'Duyệt chuyển lớp - Nguyễn Văn A', priority: 'high', date: '24/02/2026' },
        { id: 2, type: 'reserve', title: 'Bảo lưu - Trần Thị B', priority: 'medium', date: '23/02/2026' },
        { id: 3, type: 'enroll', title: 'Duyệt đăng ký - 5 đơn mới', priority: 'high', date: '24/02/2026' },
        { id: 4, type: 'payment', title: 'Xác nhận học phí - Lê Văn C', priority: 'low', date: '22/02/2026' }
    ],
    recentNotifications: [
        { id: 1, title: 'Lớp IELTS 6.0 sắp đầy', message: 'Còn 4 chỗ trống', time: '2 giờ trước', icon: 'users', color: 'warning' },
        { id: 2, title: 'Giảng viên xin nghỉ', message: 'GV Phạm Văn Nam xin nghỉ ngày 25/02', time: '5 giờ trước', icon: 'user-times', color: 'danger' },
        { id: 3, title: 'Doanh thu tháng 2', message: 'Đạt 345 triệu (+15%)', time: '1 ngày trước', icon: 'dollar-sign', color: 'success' }
    ]
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    loadTodayClasses();
    loadPendingTasks();
    loadNotifications();
    initializeCharts();
});

// Load statistics
function loadDashboardStats() {
    const stats = dashboardData.stats;
    
    // Update stat cards (assuming they exist in HTML)
    const statElements = document.querySelectorAll('.stat-card');
    if (statElements.length >= 4) {
        // Total Students
        updateStatCard(statElements[0], stats.totalStudents, stats.studentChange);
        // Active Classes
        updateStatCard(statElements[1], stats.activeClasses, stats.classChange);
        // Monthly Revenue
        updateStatCard(statElements[2], formatCurrency(stats.monthlyRevenue), stats.revenueChange);
        // Total Debt
        updateStatCard(statElements[3], formatCurrency(stats.totalDebt), stats.debtChange);
    }
}

function updateStatCard(element, value, change) {
    const valueEl = element.querySelector('.stat-value, h3');
    const changeEl = element.querySelector('.stat-change');
    
    if (valueEl) valueEl.textContent = value;
    
    if (changeEl) {
        const isPositive = change > 0;
        changeEl.textContent = `${isPositive ? '+' : ''}${change}%`;
        changeEl.className = `stat-change ${isPositive ? 'positive' : 'negative'}`;
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(amount);
}

// Load today's classes
function loadTodayClasses() {
    const container = document.querySelector('.class-list tbody');
    if (!container) return;
    
    container.innerHTML = '';
    
    dashboardData.todayClasses.forEach(classItem => {
        const row = createClassRow(classItem);
        container.appendChild(row);
    });
}

function createClassRow(classItem) {
    const tr = document.createElement('tr');
    
    const statusMap = {
        'ongoing': { text: 'Đang học', class: 'badge-success' },
        'recruiting': { text: 'Đang tuyển', class: 'badge-warning' },
        'completed': { text: 'Kết thúc', class: 'badge-secondary' }
    };
    
    const status = statusMap[classItem.status] || statusMap['recruiting'];
    
    tr.innerHTML = `
        <td>${classItem.name}</td>
        <td>${classItem.course}</td>
        <td>${classItem.students}</td>
        <td>${classItem.teacher}</td>
        <td>${classItem.time}</td>
        <td><span class="badge ${status.class}">${status.text}</span></td>
        <td>
            <div class="table-actions">
                <button class="btn btn-outline btn-sm" onclick="viewClassDetail('${classItem.id}')">Chi tiết</button>
            </div>
        </td>
    `;
    
    return tr;
}

function viewClassDetail(classId) {
    const classItem = dashboardData.todayClasses.find(c => c.id === classId);
    if (classItem) {
        alert(`Chi tiết lớp:\n\n${classItem.name}\nGiảng viên: ${classItem.teacher}\nSĩ số: ${classItem.students}`);
    }
}

// Load pending tasks
function loadPendingTasks() {
    const container = document.querySelector('.pending-tasks-list, .task-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    dashboardData.pendingTasks.forEach(task => {
        const item = createTaskItem(task);
        container.appendChild(item);
    });
}

function createTaskItem(task) {
    const div = document.createElement('div');
    div.className = 'task-item';
    
    const priorityColors = {
        'high': '#e74a3b',
        'medium': '#f6c23e',
        'low': '#1cc88a'
    };
    
    const iconMap = {
        'transfer': 'exchange-alt',
        'reserve': 'pause-circle',
        'enroll': 'user-plus',
        'payment': 'dollar-sign'
    };
    
    div.innerHTML = `
        <div class="task-icon" style="background: ${priorityColors[task.priority]}20; color: ${priorityColors[task.priority]};">
            <i class="fas fa-${iconMap[task.type]}"></i>
        </div>
        <div class="task-content">
            <div class="task-title">${task.title}</div>
            <div class="task-date">${task.date}</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="processTask(${task.id})">
            <i class="fas fa-check"></i>
        </button>
    `;
    
    return div;
}

function processTask(taskId) {
    const task = dashboardData.pendingTasks.find(t => t.id === taskId);
    if (task) {
        if (confirm(`Xử lý công việc:\n${task.title}`)) {
            showNotification('Đã đánh dấu hoàn thành!', 'success');
            // Remove task from list
            dashboardData.pendingTasks = dashboardData.pendingTasks.filter(t => t.id !== taskId);
            loadPendingTasks();
        }
    }
}

// Load notifications
function loadNotifications() {
    const container = document.querySelector('.notifications-list, .notification-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    dashboardData.recentNotifications.forEach(notification => {
        const item = createNotificationItem(notification);
        container.appendChild(item);
    });
}

function createNotificationItem(notification) {
    const div = document.createElement('div');
    div.className = 'notification-item';
    
    const colorMap = {
        'success': '#1cc88a',
        'warning': '#f6c23e',
        'danger': '#e74a3b',
        'info': '#4e73df'
    };
    
    div.innerHTML = `
        <div class="notification-icon" style="background: ${colorMap[notification.color]}20; color: ${colorMap[notification.color]};">
            <i class="fas fa-${notification.icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-time">${notification.time}</div>
        </div>
    `;
    
    return div;
}

// Initialize charts (placeholder for future chart implementation)
function initializeCharts() {
    // Revenue chart
    const revenueChart = document.getElementById('revenueChart');
    if (revenueChart) {
        // Chart.js or other charting library can be integrated here
        console.log('Revenue chart placeholder');
    }
    
    // Student enrollment chart
    const enrollmentChart = document.getElementById('enrollmentChart');
    if (enrollmentChart) {
        console.log('Enrollment chart placeholder');
    }
}

// Search functionality
function handleSearch(query) {
    if (!query) return;
    
    console.log('Searching for:', query);
    showNotification(`Đang tìm kiếm: ${query}`, 'info');
}

// Setup search
const searchInput = document.querySelector('.header-search input');
if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch(this.value);
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
if (!document.getElementById('dashboard-animations')) {
    const style = document.createElement('style');
    style.id = 'dashboard-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .task-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
            transition: background 0.2s;
        }
        
        .task-item:hover {
            background: var(--bg-secondary);
        }
        
        .task-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }
        
        .task-content {
            flex: 1;
        }
        
        .task-title {
            font-weight: 500;
            margin-bottom: 4px;
        }
        
        .task-date {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }
        
        .notification-item {
            display: flex;
            gap: 1rem;
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-title {
            font-weight: 600;
            margin-bottom: 4px;
        }
        
        .notification-message {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-bottom: 4px;
        }
        
        .notification-time {
            font-size: 0.75rem;
            color: var(--text-secondary);
        }
    `;
    document.head.appendChild(style);
}

console.log('Dashboard loaded successfully');
