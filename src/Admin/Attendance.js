// Attendance Management JavaScript

// Sample data storage
let attendanceData = [
    {
        id: 'att001',
        date: '2026-02-24',
        session: 15,
        classId: 'cls001',
        className: 'IELTS 6.5 - Sáng',
        teacher: 'Nguyễn Văn A',
        totalStudents: 15,
        present: 14,
        excused: 1,
        absent: 0,
        students: [
            { id: 'std001', name: 'Nguyễn Văn A', status: 'present', note: '' },
            { id: 'std002', name: 'Trần Thị B', status: 'excused', note: 'Nghỉ ốm có giấy' },
            { id: 'std003', name: 'Lê Văn C', status: 'present', note: '' }
        ]
    },
    {
        id: 'att002',
        date: '2026-02-24',
        session: 8,
        classId: 'cls002',
        className: 'TOEIC 650+ - Tối',
        teacher: 'Trần Thị B',
        totalStudents: 18,
        present: 16,
        excused: 0,
        absent: 2,
        students: [
            { id: 'std004', name: 'Phạm Văn D', status: 'present', note: '' },
            { id: 'std005', name: 'Hoàng Thị E', status: 'absent', note: 'Không báo trước' }
        ]
    },
    {
        id: 'att003',
        date: '2026-02-23',
        session: 12,
        classId: 'cls003',
        className: 'Giao tiếp cơ bản',
        teacher: 'Lê Văn C',
        totalStudents: 8,
        present: 8,
        excused: 0,
        absent: 0,
        students: []
    }
];

let studentAbsentReport = [
    {
        studentId: 'std001',
        studentName: 'Trần Văn B',
        className: 'IELTS 6.5 - Sáng',
        totalAbsent: 5,
        absentRate: 33,
        lastAbsent: '2026-02-22'
    },
    {
        studentId: 'std002',
        studentName: 'Nguyễn Thị D',
        className: 'TOEIC 650+ - Tối',
        totalAbsent: 4,
        absentRate: 29,
        lastAbsent: '2026-02-24'
    }
];

let currentEditingAttendanceId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadAttendances();
    loadAbsentReport();
    setupFilters();
    setTodayDate();
    updateStatistics();
    setupStatusChangeHandler();
});

function loadAttendances() {
    const tbody = document.querySelector('.card .table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    attendanceData.forEach(attendance => {
        const row = createAttendanceRow(attendance);
        tbody.appendChild(row);
    });
}

function createAttendanceRow(attendance) {
    const tr = document.createElement('tr');
    const formattedDate = formatDate(attendance.date);
    
    tr.innerHTML = `
        <td>${formattedDate}</td>
        <td>Buổi ${attendance.session}</td>
        <td>${attendance.className}</td>
        <td>${attendance.teacher}</td>
        <td>${attendance.totalStudents}</td>
        <td><span class="badge badge-present">${attendance.present}</span></td>
        <td><span class="badge badge-excused">${attendance.excused}</span></td>
        <td><span class="badge badge-absent">${attendance.absent}</span></td>
        <td>
            <button class="btn-icon" title="Xem chi tiết" onclick="viewAttendance('${attendance.id}')">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon" title="Chỉnh sửa" onclick="editAttendance('${attendance.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon" title="Xuất Excel" onclick="exportAttendance('${attendance.id}')">
                <i class="fas fa-file-excel"></i>
            </button>
        </td>
    `;
    
    return tr;
}

function loadAbsentReport() {
    const tbody = document.querySelectorAll('.card .table tbody')[1];
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    studentAbsentReport.forEach(student => {
        const row = createAbsentReportRow(student);
        tbody.appendChild(row);
    });
}

function createAbsentReportRow(student) {
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
        <td>${student.studentName}</td>
        <td>${student.className}</td>
        <td>${student.totalAbsent} buổi</td>
        <td><span class="warning-text">${student.absentRate}%</span></td>
        <td>${formatDate(student.lastAbsent)}</td>
        <td>
            <button class="btn-icon" title="Xem chi tiết" onclick="viewStudentAttendance('${student.studentId}')">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon" title="Gửi thông báo" onclick="sendWarning('${student.studentId}')">
                <i class="fas fa-bell"></i>
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

function showCreateAttendanceModal() {
    currentEditingAttendanceId = null;
    document.querySelector('#attendanceModal .modal-header h2').textContent = 'Tạo điểm danh mới';
    document.getElementById('attendanceModal').style.display = 'block';
    resetAttendanceForm();
}

function closeModal() {
    document.getElementById('attendanceModal').style.display = 'none';
    resetAttendanceForm();
}

function resetAttendanceForm() {
    const modal = document.getElementById('attendanceModal');
    const classSelect = modal.querySelector('#classSelect');
    const dateInput = modal.querySelector('#attendanceDate');
    const sessionInput = modal.querySelector('input[type="number"]');
    
    if (classSelect) classSelect.selectedIndex = 0;
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    if (sessionInput) sessionInput.value = '1';
    
    // Reset attendance table to default
    const tbody = modal.querySelector('.attendance-table tbody');
    if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const select = row.querySelector('select');
            const noteInput = row.querySelector('input[type="text"]');
            if (select) {
                select.value = 'present';
                select.className = 'status-select present';
            }
            if (noteInput) noteInput.value = '';
        });
    }
    
    updateAttendanceSummary();
}

function viewAttendance(attendanceId) {
    const attendance = attendanceData.find(a => a.id === attendanceId);
    if (!attendance) return;
    
    let details = `Chi tiết điểm danh:\n\n`;
    details += `Lớp: ${attendance.className}\n`;
    details += `Giảng viên: ${attendance.teacher}\n`;
    details += `Ngày: ${formatDate(attendance.date)}\n`;
    details += `Buổi: ${attendance.session}\n\n`;
    details += `Tổng số: ${attendance.totalStudents}\n`;
    details += `Có mặt: ${attendance.present}\n`;
    details += `Vắng có phép: ${attendance.excused}\n`;
    details += `Vắng không phép: ${attendance.absent}\n`;
    
    alert(details);
}

function editAttendance(attendanceId) {
    const attendance = attendanceData.find(a => a.id === attendanceId);
    if (!attendance) return;
    
    currentEditingAttendanceId = attendanceId;
    document.querySelector('#attendanceModal .modal-header h2').textContent = 'Chỉnh sửa điểm danh';
    
    // Populate form
    const modal = document.getElementById('attendanceModal');
    const classSelect = modal.querySelector('#classSelect');
    const dateInput = modal.querySelector('#attendanceDate');
    const sessionInput = modal.querySelector('input[type="number"]');
    
    if (classSelect) classSelect.value = attendance.classId;
    if (dateInput) dateInput.value = attendance.date;
    if (sessionInput) sessionInput.value = attendance.session;
    
    // Load student attendance data
    const tbody = modal.querySelector('.attendance-table tbody');
    if (tbody && attendance.students.length > 0) {
        tbody.innerHTML = '';
        attendance.students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>
                    <select class="status-select ${student.status}">
                        <option value="present" ${student.status === 'present' ? 'selected' : ''}>Có mặt</option>
                        <option value="excused" ${student.status === 'excused' ? 'selected' : ''}>Vắng có phép</option>
                        <option value="absent" ${student.status === 'absent' ? 'selected' : ''}>Vắng không phép</option>
                    </select>
                </td>
                <td><input type="text" value="${student.note || ''}" placeholder="Ghi chú..."></td>
            `;
            tbody.appendChild(row);
        });
    }
    
    updateAttendanceSummary();
    document.getElementById('attendanceModal').style.display = 'block';
}

function exportAttendance(attendanceId) {
    const attendance = attendanceData.find(a => a.id === attendanceId);
    if (!attendance) return;
    
    alert(`Đang xuất Excel cho điểm danh:\n\n` +
          `Lớp: ${attendance.className}\n` +
          `Ngày: ${formatDate(attendance.date)}\n` +
          `Buổi: ${attendance.session}\n\n` +
          `Chức năng xuất Excel sẽ được tích hợp sau.`);
}

function viewStudentAttendance(studentId) {
    const student = studentAbsentReport.find(s => s.studentId === studentId);
    if (!student) return;
    
    alert(`Lịch sử điểm danh học viên:\n\n` +
          `Họ tên: ${student.studentName}\n` +
          `Lớp: ${student.className}\n` +
          `Tổng số buổi vắng: ${student.totalAbsent}\n` +
          `Tỷ lệ vắng: ${student.absentRate}%\n` +
          `Lần cuối vắng: ${formatDate(student.lastAbsent)}\n\n` +
          `Chi tiết đầy đủ sẽ được hiển thị trong trang riêng.`);
}

function sendWarning(studentId) {
    const student = studentAbsentReport.find(s => s.studentId === studentId);
    if (!student) return;
    
    if (confirm(`Gửi cảnh báo về tình trạng vắng học cho:\n\n` +
                `Học viên: ${student.studentName}\n` +
                `Lớp: ${student.className}\n` +
                `Số buổi vắng: ${student.totalAbsent} (${student.absentRate}%)\n\n` +
                `Bạn có muốn tiếp tục?`)) {
        showNotification(`Đã gửi thông báo cảnh báo đến học viên ${student.studentName}`, 'success');
    }
}

function saveAttendance() {
    const modal = document.getElementById('attendanceModal');
    const classSelect = modal.querySelector('#classSelect');
    const dateInput = modal.querySelector('#attendanceDate');
    const sessionInput = modal.querySelector('input[type="number"]');
    
    // Validation
    if (!classSelect.value || !dateInput.value || !sessionInput.value) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    // Collect student attendance data
    const tbody = modal.querySelector('.attendance-table tbody');
    const rows = tbody.querySelectorAll('tr');
    const students = [];
    let present = 0, excused = 0, absent = 0;
    
    rows.forEach(row => {
        const studentName = row.cells[1].textContent;
        const statusSelect = row.querySelector('select');
        const noteInput = row.querySelector('input[type="text"]');
        const status = statusSelect.value;
        
        students.push({
            id: 'std' + Math.random().toString(36).substr(2, 9),
            name: studentName,
            status: status,
            note: noteInput.value
        });
        
        if (status === 'present') present++;
        else if (status === 'excused') excused++;
        else if (status === 'absent') absent++;
    });
    
    const classOption = classSelect.options[classSelect.selectedIndex];
    const attendanceRecord = {
        id: currentEditingAttendanceId || 'att' + String(attendanceData.length + 1).padStart(3, '0'),
        date: dateInput.value,
        session: parseInt(sessionInput.value),
        classId: classSelect.value,
        className: classOption.text,
        teacher: 'Giảng viên',
        totalStudents: students.length,
        present: present,
        excused: excused,
        absent: absent,
        students: students
    };
    
    if (currentEditingAttendanceId) {
        // Update existing
        const index = attendanceData.findIndex(a => a.id === currentEditingAttendanceId);
        if (index !== -1) {
            attendanceData[index] = attendanceRecord;
            showNotification('Cập nhật điểm danh thành công!', 'success');
        }
    } else {
        // Add new
        attendanceData.push(attendanceRecord);
        showNotification('Thêm điểm danh thành công!', 'success');
    }
    
    loadAttendances();
    updateStatistics();
    closeModal();
}

function setupFilters() {
    const classFilter = document.getElementById('classFilter');
    const searchBtn = document.querySelector('.filter-bar .btn-search');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', applyFilters);
    }
    
    if (classFilter) classFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
    const classFilter = document.getElementById('classFilter')?.value;
    const fromDate = document.getElementById('fromDate')?.value;
    const toDate = document.getElementById('toDate')?.value;
    
    let filteredData = attendanceData;
    
    if (classFilter) {
        filteredData = filteredData.filter(a => a.classId === classFilter);
    }
    
    if (fromDate) {
        filteredData = filteredData.filter(a => a.date >= fromDate);
    }
    
    if (toDate) {
        filteredData = filteredData.filter(a => a.date <= toDate);
    }
    
    // Update table
    const tbody = document.querySelector('.card .table tbody');
    if (tbody) {
        tbody.innerHTML = '';
        filteredData.forEach(attendance => {
            tbody.appendChild(createAttendanceRow(attendance));
        });
    }
}

function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    const attendanceDate = document.getElementById('attendanceDate');
    
    if (fromDate) fromDate.value = today;
    if (toDate) toDate.value = today;
    if (attendanceDate) attendanceDate.value = today;
}

function updateStatistics() {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = attendanceData.filter(a => a.date === today).length;
    
    const totalPresent = attendanceData.reduce((sum, a) => sum + a.present, 0);
    const totalStudents = attendanceData.reduce((sum, a) => sum + a.totalStudents, 0);
    const presentRate = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;
    
    const totalExcused = attendanceData.reduce((sum, a) => sum + a.excused, 0);
    const totalAbsent = attendanceData.reduce((sum, a) => sum + a.absent, 0);
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('h3').textContent = todaySessions;
        statCards[1].querySelector('h3').textContent = presentRate + '%';
        statCards[2].querySelector('h3').textContent = totalExcused;
        statCards[3].querySelector('h3').textContent = totalAbsent;
    }
}

function setupStatusChangeHandler() {
    // Update status select color on change
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('status-select')) {
            e.target.className = 'status-select ' + e.target.value;
            updateAttendanceSummary();
        }
    });
}

function updateAttendanceSummary() {
    const modal = document.getElementById('attendanceModal');
    if (!modal || modal.style.display === 'none') return;
    
    const tbody = modal.querySelector('.attendance-table tbody');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    let present = 0, excused = 0, absent = 0;
    
    rows.forEach(row => {
        const select = row.querySelector('select');
        if (select) {
            const status = select.value;
            if (status === 'present') present++;
            else if (status === 'excused') excused++;
            else if (status === 'absent') absent++;
        }
    });
    
    const total = rows.length;
    
    // Update summary
    const summaryItems = modal.querySelectorAll('.attendance-summary .summary-item');
    if (summaryItems.length >= 4) {
        summaryItems[0].querySelector('strong').nextSibling.textContent = ` ${total} học viên`;
        summaryItems[1].querySelector('.text-present').textContent = present;
        summaryItems[2].querySelector('.text-excused').textContent = excused;
        summaryItems[3].querySelector('.text-absent').textContent = absent;
    }
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
    const modal = document.getElementById('attendanceModal');
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
