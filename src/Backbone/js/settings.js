// Settings JavaScript (Permissions & Audit Log)

// Sample permissions data
const permissionsData = {
    admin: {
        dashboard: true,
        courses: true,
        students: true,
        teachers: true,
        classes: true,
        rooms: true,
        attendance: true,
        grades: true,
        finance: true,
        reports: true,
        settings: true
    },
    teacher: {
        dashboard: true,
        courses: true,
        students: true,
        teachers: false,
        classes: true,
        rooms: false,
        attendance: true,
        grades: true,
        finance: false,
        reports: true,
        settings: false
    },
    accountant: {
        dashboard: true,
        courses: true,
        students: true,
        teachers: false,
        classes: false,
        rooms: false,
        attendance: false,
        grades: false,
        finance: true,
        reports: true,
        settings: false
    }
};

// Sample audit log data
const auditLogData = [
    { id: 1, timestamp: '2024-01-20 14:30:25', user: 'admin@system.vn', action: 'Thêm khóa học', module: 'Khóa học', details: 'Thêm khóa học IELTS Advanced', ip: '192.168.1.100' },
    { id: 2, timestamp: '2024-01-20 14:25:18', user: 'teacher1@system.vn', action: 'Cập nhật điểm danh', module: 'Điểm danh', details: 'Lớp IELTS-001-01, ngày 20/01/2024', ip: '192.168.1.101' },
    { id: 3, timestamp: '2024-01-20 14:15:42', user: 'admin@system.vn', action: 'Xóa học viên', module: 'Học viên', details: 'Xóa học viên SV999 - Nguyễn Văn X', ip: '192.168.1.100' },
    { id: 4, timestamp: '2024-01-20 14:10:33', user: 'accountant@system.vn', action: 'Xuất báo cáo', module: 'Báo cáo', details: 'Báo cáo tài chính tháng 01/2024', ip: '192.168.1.102' },
    { id: 5, timestamp: '2024-01-20 14:05:15', user: 'admin@system.vn', action: 'Cập nhật quyền', module: 'Cài đặt', details: 'Cập nhật quyền cho vai trò Giáo viên', ip: '192.168.1.100' },
    { id: 6, timestamp: '2024-01-20 13:58:27', user: 'teacher2@system.vn', action: 'Nhập điểm', module: 'Điểm số', details: 'Nhập điểm giữa kỳ lớp TOEIC-001-01', ip: '192.168.1.103' },
    { id: 7, timestamp: '2024-01-20 13:45:51', user: 'admin@system.vn', action: 'Thêm giáo viên', module: 'Giáo viên', details: 'Thêm giáo viên GV015 - Phạm Thị Y', ip: '192.168.1.100' },
    { id: 8, timestamp: '2024-01-20 13:30:12', user: 'teacher1@system.vn', action: 'Gửi thông báo', module: 'Thông báo', details: 'Gửi thông báo đến lớp IELTS-001-01', ip: '192.168.1.101' },
    { id: 9, timestamp: '2024-01-20 13:22:48', user: 'accountant@system.vn', action: 'Cập nhật học phí', module: 'Tài chính', details: 'Cập nhật học phí học viên SV123', ip: '192.168.1.102' },
    { id: 10, timestamp: '2024-01-20 13:15:36', user: 'admin@system.vn', action: 'Thêm phòng học', module: 'Phòng học', details: 'Thêm phòng học P301, sức chứa 35 chỗ', ip: '192.168.1.100' },
    { id: 11, timestamp: '2024-01-20 12:58:19', user: 'teacher3@system.vn', action: 'Xem báo cáo', module: 'Báo cáo', details: 'Xem báo cáo điểm danh tháng 01/2024', ip: '192.168.1.104' },
    { id: 12, timestamp: '2024-01-20 12:45:03', user: 'admin@system.vn', action: 'Phê duyệt đăng ký', module: 'Đăng ký', details: 'Phê duyệt đơn đăng ký DK456', ip: '192.168.1.100' },
    { id: 13, timestamp: '2024-01-20 12:30:55', user: 'accountant@system.vn', action: 'Xuất báo cáo', module: 'Báo cáo', details: 'Xuất báo cáo doanh thu Excel', ip: '192.168.1.102' },
    { id: 14, timestamp: '2024-01-20 12:15:28', user: 'teacher1@system.vn', action: 'Cập nhật lịch học', module: 'Lớp học', details: 'Cập nhật lịch học lớp IELTS-002-01', ip: '192.168.1.101' },
    { id: 15, timestamp: '2024-01-20 12:00:14', user: 'admin@system.vn', action: 'Đăng nhập', module: 'Hệ thống', details: 'Đăng nhập thành công', ip: '192.168.1.100' }
];

// Current role being edited
let currentRole = 'admin';

// Current filters
let currentFilters = {
    dateFrom: '',
    dateTo: '',
    user: '',
    action: '',
    module: ''
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadPermissions('admin');
    loadAuditLog();
    setupRoleSelector();
});

function setupRoleSelector() {
    const roleButtons = document.querySelectorAll('.role-list .role-item');
    roleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            roleButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get role from data attribute or text
            const role = this.textContent.trim().toLowerCase();
            let roleKey = '';
            
            if (role.includes('admin')) roleKey = 'admin';
            else if (role.includes('giáo viên')) roleKey = 'teacher';
            else if (role.includes('kế toán')) roleKey = 'accountant';
            
            if (roleKey) {
                currentRole = roleKey;
                loadPermissions(roleKey);
            }
        });
    });
}

function loadPermissions(role) {
    currentRole = role;
    const permissions = permissionsData[role];
    
    if (!permissions) return;
    
    // Update role title
    const roleTitle = document.querySelector('.permissions-content h3');
    if (roleTitle) {
        const roleName = role === 'admin' ? 'Quản trị viên' : 
                        role === 'teacher' ? 'Giáo viên' : 
                        role === 'accountant' ? 'Kế toán' : role;
        roleTitle.textContent = `Phân quyền: ${roleName}`;
    }
    
    // Update checkboxes
    Object.keys(permissions).forEach(module => {
        const checkbox = document.querySelector(`input[data-module="${module}"]`);
        if (checkbox) {
            checkbox.checked = permissions[module];
            
            // Disable checkboxes for admin role
            if (role === 'admin') {
                checkbox.disabled = true;
            } else {
                checkbox.disabled = false;
            }
        }
    });
}

function savePermissions() {
    const checkboxes = document.querySelectorAll('.permission-item input[type="checkbox"]');
    const updatedPermissions = {};
    
    checkboxes.forEach(checkbox => {
        const module = checkbox.dataset.module;
        updatedPermissions[module] = checkbox.checked;
    });
    
    // Save to data
    permissionsData[currentRole] = updatedPermissions;
    
    console.log('Saving permissions for role:', currentRole, updatedPermissions);
    
    // Add to audit log
    addAuditLog(
        'Cập nhật quyền',
        'Cài đặt',
        `Cập nhật quyền cho vai trò ${getRoleName(currentRole)}`
    );
    
    showNotification('Đã lưu phân quyền thành công!', 'success');
}

function resetPermissions() {
    if (confirm('Bạn có chắc chắn muốn khôi phục quyền mặc định?')) {
        // Reload original permissions
        loadPermissions(currentRole);
        showNotification('Đã khôi phục phân quyền mặc định!', 'info');
    }
}

function getRoleName(role) {
    switch(role) {
        case 'admin': return 'Quản trị viên';
        case 'teacher': return 'Giáo viên';
        case 'accountant': return 'Kế toán';
        default: return role;
    }
}

function loadAuditLog() {
    const tbody = document.querySelector('#auditLogTable tbody');
    if (!tbody) return;
    
    const filteredData = filterAuditLog();
    
    tbody.innerHTML = '';
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Không có dữ liệu</td></tr>';
        return;
    }
    
    filteredData.forEach((log, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${log.timestamp}</td>
                <td>${log.user}</td>
                <td><span class="action-badge">${log.action}</span></td>
                <td>${log.module}</td>
                <td>
                    ${log.details}
                    ${log.ip ? `<br><small style="color: #858796;">IP: ${log.ip}</small>` : ''}
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function filterAuditLog() {
    let data = [...auditLogData];
    
    if (currentFilters.dateFrom) {
        data = data.filter(log => log.timestamp >= currentFilters.dateFrom);
    }
    if (currentFilters.dateTo) {
        data = data.filter(log => log.timestamp <= currentFilters.dateTo + ' 23:59:59');
    }
    if (currentFilters.user) {
        data = data.filter(log => log.user.toLowerCase().includes(currentFilters.user.toLowerCase()));
    }
    if (currentFilters.action) {
        data = data.filter(log => log.action.toLowerCase().includes(currentFilters.action.toLowerCase()));
    }
    if (currentFilters.module) {
        data = data.filter(log => log.module.toLowerCase().includes(currentFilters.module.toLowerCase()));
    }
    
    return data;
}

function applyAuditFilter() {
    currentFilters = {
        dateFrom: document.getElementById('auditDateFrom')?.value || '',
        dateTo: document.getElementById('auditDateTo')?.value || '',
        user: document.getElementById('auditUser')?.value || '',
        action: document.getElementById('auditAction')?.value || '',
        module: document.getElementById('auditModule')?.value || ''
    };
    
    loadAuditLog();
}

function resetAuditFilter() {
    document.getElementById('auditDateFrom').value = '';
    document.getElementById('auditDateTo').value = '';
    document.getElementById('auditUser').value = '';
    document.getElementById('auditAction').value = '';
    document.getElementById('auditModule').value = '';
    
    currentFilters = {
        dateFrom: '',
        dateTo: '',
        user: '',
        action: '',
        module: ''
    };
    
    loadAuditLog();
}

function exportAuditLog(format) {
    const filteredData = filterAuditLog();
    
    if (filteredData.length === 0) {
        showNotification('Không có dữ liệu để xuất!', 'warning');
        return;
    }
    
    if (format === 'excel') {
        console.log('Exporting audit log to Excel...', filteredData);
        showNotification('Đang xuất nhật ký sang Excel...', 'info');
        
        setTimeout(() => {
            showNotification('Đã xuất nhật ký thành công!', 'success');
        }, 1500);
    } else if (format === 'pdf') {
        console.log('Exporting audit log to PDF...', filteredData);
        showNotification('Đang xuất nhật ký sang PDF...', 'info');
        
        setTimeout(() => {
            showNotification('Đã xuất nhật ký thành công!', 'success');
        }, 1500);
    }
}

function clearOldLogs() {
    if (confirm('Bạn có chắc chắn muốn xóa các bản ghi cũ hơn 90 ngày? Hành động này không thể hoàn tác.')) {
        const today = new Date();
        const cutoffDate = new Date(today.setDate(today.getDate() - 90));
        const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
        
        const beforeCount = auditLogData.length;
        
        // Remove old entries (in production, this would be an API call)
        const indexesToRemove = [];
        auditLogData.forEach((log, index) => {
            if (log.timestamp < cutoffDateStr) {
                indexesToRemove.push(index);
            }
        });
        
        // Remove from end to start to maintain indices
        indexesToRemove.reverse().forEach(index => {
            auditLogData.splice(index, 1);
        });
        
        const afterCount = auditLogData.length;
        const removedCount = beforeCount - afterCount;
        
        console.log(`Removed ${removedCount} old audit log entries`);
        
        // Add audit entry for this action
        addAuditLog(
            'Xóa nhật ký cũ',
            'Hệ thống',
            `Xóa ${removedCount} bản ghi cũ hơn 90 ngày`
        );
        
        loadAuditLog();
        showNotification(`Đã xóa ${removedCount} bản ghi cũ!`, 'success');
    }
}

function addAuditLog(action, module, details) {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    
    const newLog = {
        id: auditLogData.length + 1,
        timestamp: timestamp,
        user: 'admin@system.vn', // Would come from session
        action: action,
        module: module,
        details: details,
        ip: '192.168.1.100' // Would come from request
    };
    
    auditLogData.unshift(newLog);
    
    // Reload if currently viewing
    const auditSection = document.querySelector('#auditLog');
    if (auditSection) {
        loadAuditLog();
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

// Add animations CSS
if (!document.getElementById('settings-animations')) {
    const style = document.createElement('style');
    style.id = 'settings-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .action-badge {
            background: #e3f2fd;
            color: #1976d2;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.875rem;
            white-space: nowrap;
        }
        .role-item.active {
            background: #4e73df;
            color: white;
            border-color: #4e73df;
        }
        .permission-item input[type="checkbox"]:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
}

console.log('Settings module loaded successfully');
