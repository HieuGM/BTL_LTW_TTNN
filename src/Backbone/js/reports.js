// Reports JavaScript (Attendance, Academic, Financial Reports)

// Sample data for reports
const reportData = {
    attendance: [
        { id: 1, class: 'IELTS-001-01', date: '2024-01-15', total: 25, present: 23, absent: 2, percentage: 92, teacher: 'Nguyễn Văn A' },
        { id: 2, class: 'TOEIC-001-01', date: '2024-01-15', total: 30, present: 28, absent: 2, percentage: 93, teacher: 'Lê Thị B' },
        { id: 3, class: 'IELTS-002-01', date: '2024-01-16', total: 20, present: 19, absent: 1, percentage: 95, teacher: 'Trần Văn C' },
        { id: 4, class: 'TOEFL-001-01', date: '2024-01-16', total: 15, present: 13, absent: 2, percentage: 87, teacher: 'Phạm Thị D' },
        { id: 5, class: 'IELTS-001-02', date: '2024-01-17', total: 28, present: 26, absent: 2, percentage: 93, teacher: 'Nguyễn Văn A' },
        { id: 6, class: 'TOEIC-002-01', date: '2024-01-17', total: 22, present: 22, absent: 0, percentage: 100, teacher: 'Lê Thị B' }
    ],
    academic: [
        { id: 1, student: 'Nguyễn Văn An', studentId: 'SV001', course: 'IELTS Foundation', midterm: 7.5, final: 8.0, overall: 7.8, status: 'Đạt', teacher: 'Nguyễn Văn A' },
        { id: 2, student: 'Trần Thị Bình', studentId: 'SV002', course: 'TOEIC Basic', midterm: 8.0, final: 8.5, overall: 8.3, status: 'Đạt', teacher: 'Lê Thị B' },
        { id: 3, student: 'Lê Văn Cường', studentId: 'SV003', course: 'IELTS Intermediate', midterm: 6.0, final: 6.5, overall: 6.3, status: 'Đạt', teacher: 'Trần Văn C' },
        { id: 4, student: 'Phạm Thị Dung', studentId: 'SV004', course: 'TOEFL Preparation', midterm: 5.5, final: 6.0, overall: 5.8, status: 'Đạt', teacher: 'Phạm Thị D' },
        { id: 5, student: 'Hoàng Văn Em', studentId: 'SV005', course: 'IELTS Foundation', midterm: 4.5, final: 5.0, overall: 4.8, status: 'Không đạt', teacher: 'Nguyễn Văn A' },
        { id: 6, student: 'Võ Thị Giang', studentId: 'SV006', course: 'TOEIC Advanced', midterm: 9.0, final: 9.0, overall: 9.0, status: 'Đạt', teacher: 'Lê Thị B' }
    ],
    financial: [
        { id: 1, month: '01/2024', revenue: 156000000, expenses: 82000000, profit: 74000000, students: 45, avgTuition: 3466667 },
        { id: 2, month: '02/2024', revenue: 189000000, expenses: 95000000, profit: 94000000, students: 52, avgTuition: 3634615 },
        { id: 3, month: '03/2024', revenue: 234000000, expenses: 108000000, profit: 126000000, students: 67, avgTuition: 3492537 },
        { id: 4, month: '04/2024', revenue: 198000000, expenses: 101000000, profit: 97000000, students: 58, avgTuition: 3413793 },
        { id: 5, month: '05/2024', revenue: 176000000, expenses: 89000000, profit: 87000000, students: 49, avgTuition: 3591837 },
        { id: 6, month: '06/2024', revenue: 213000000, expenses: 102000000, profit: 111000000, students: 61, avgTuition: 3491803 }
    ]
};

// Current filters
let currentFilters = {
    attendance: { dateFrom: '', dateTo: '', class: '', teacher: '' },
    academic: { course: '', status: '', teacher: '' },
    financial: { monthFrom: '', monthTo: '', minRevenue: '' }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load first tab by default
    showTab('attendance');
});

function showTab(tabName) {
    // Hide all tab contents
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Report');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    const selectedButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    // Load report data
    loadReport(tabName);
}

function loadReport(reportType) {
    switch(reportType) {
        case 'attendance':
            loadAttendanceReport();
            break;
        case 'academic':
            loadAcademicReport();
            break;
        case 'financial':
            loadFinancialReport();
            break;
    }
}

function loadAttendanceReport() {
    const tbody = document.querySelector('#attendanceReport tbody');
    if (!tbody) return;
    
    const filteredData = filterAttendanceData();
    
    tbody.innerHTML = '';
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Không có dữ liệu</td></tr>';
        return;
    }
    
    filteredData.forEach((record, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${record.class}</td>
                <td>${record.date}</td>
                <td>${record.teacher}</td>
                <td>${record.total}</td>
                <td>${record.present}</td>
                <td>
                    <span class="percentage ${record.percentage >= 90 ? 'high' : record.percentage >= 70 ? 'medium' : 'low'}">
                        ${record.percentage}%
                    </span>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    updateAttendanceStats(filteredData);
}

function filterAttendanceData() {
    let data = [...reportData.attendance];
    const filters = currentFilters.attendance;
    
    if (filters.dateFrom) {
        data = data.filter(r => r.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
        data = data.filter(r => r.date <= filters.dateTo);
    }
    if (filters.class) {
        data = data.filter(r => r.class.toLowerCase().includes(filters.class.toLowerCase()));
    }
    if (filters.teacher) {
        data = data.filter(r => r.teacher.toLowerCase().includes(filters.teacher.toLowerCase()));
    }
    
    return data;
}

function updateAttendanceStats(data) {
    const totalClasses = data.length;
    const avgAttendance = data.length > 0 
        ? (data.reduce((sum, r) => sum + r.percentage, 0) / data.length).toFixed(1)
        : 0;
    const highAttendance = data.filter(r => r.percentage >= 90).length;
    
    const statsDiv = document.querySelector('#attendanceReport .report-stats');
    if (statsDiv) {
        statsDiv.innerHTML = `
            <div class="stat-item">
                <label>Tổng số buổi học:</label>
                <span>${totalClasses}</span>
            </div>
            <div class="stat-item">
                <label>Tỷ lệ điểm danh TB:</label>
                <span>${avgAttendance}%</span>
            </div>
            <div class="stat-item">
                <label>Buổi học có tỷ lệ ≥90%:</label>
                <span>${highAttendance}</span>
            </div>
        `;
    }
}

function applyAttendanceFilter() {
    currentFilters.attendance = {
        dateFrom: document.getElementById('attendanceDateFrom')?.value || '',
        dateTo: document.getElementById('attendanceDateTo')?.value || '',
        class: document.getElementById('attendanceClass')?.value || '',
        teacher: document.getElementById('attendanceTeacher')?.value || ''
    };
    
    loadAttendanceReport();
}

function resetAttendanceFilter() {
    document.getElementById('attendanceDateFrom').value = '';
    document.getElementById('attendanceDateTo').value = '';
    document.getElementById('attendanceClass').value = '';
    document.getElementById('attendanceTeacher').value = '';
    
    currentFilters.attendance = { dateFrom: '', dateTo: '', class: '', teacher: '' };
    loadAttendanceReport();
}

function loadAcademicReport() {
    const tbody = document.querySelector('#academicReport tbody');
    if (!tbody) return;
    
    const filteredData = filterAcademicData();
    
    tbody.innerHTML = '';
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Không có dữ liệu</td></tr>';
        return;
    }
    
    filteredData.forEach((record, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${record.studentId}</td>
                <td>${record.student}</td>
                <td>${record.course}</td>
                <td>${record.midterm}</td>
                <td>${record.final}</td>
                <td><strong>${record.overall}</strong></td>
                <td>
                    <span class="status-badge ${record.status === 'Đạt' ? 'status-passed' : 'status-failed'}">
                        ${record.status}
                    </span>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    updateAcademicStats(filteredData);
}

function filterAcademicData() {
    let data = [...reportData.academic];
    const filters = currentFilters.academic;
    
    if (filters.course) {
        data = data.filter(r => r.course.toLowerCase().includes(filters.course.toLowerCase()));
    }
    if (filters.status) {
        data = data.filter(r => r.status === filters.status);
    }
    if (filters.teacher) {
        data = data.filter(r => r.teacher.toLowerCase().includes(filters.teacher.toLowerCase()));
    }
    
    return data;
}

function updateAcademicStats(data) {
    const totalStudents = data.length;
    const passedStudents = data.filter(r => r.status === 'Đạt').length;
    const avgScore = data.length > 0
        ? (data.reduce((sum, r) => sum + r.overall, 0) / data.length).toFixed(2)
        : 0;
    const passRate = data.length > 0
        ? ((passedStudents / totalStudents) * 100).toFixed(1)
        : 0;
    
    const statsDiv = document.querySelector('#academicReport .report-stats');
    if (statsDiv) {
        statsDiv.innerHTML = `
            <div class="stat-item">
                <label>Tổng số học viên:</label>
                <span>${totalStudents}</span>
            </div>
            <div class="stat-item">
                <label>Điểm trung bình:</label>
                <span>${avgScore}</span>
            </div>
            <div class="stat-item">
                <label>Số học viên đạt:</label>
                <span>${passedStudents}</span>
            </div>
            <div class="stat-item">
                <label>Tỷ lệ đạt:</label>
                <span>${passRate}%</span>
            </div>
        `;
    }
}

function applyAcademicFilter() {
    currentFilters.academic = {
        course: document.getElementById('academicCourse')?.value || '',
        status: document.getElementById('academicStatus')?.value || '',
        teacher: document.getElementById('academicTeacher')?.value || ''
    };
    
    loadAcademicReport();
}

function resetAcademicFilter() {
    document.getElementById('academicCourse').value = '';
    document.getElementById('academicStatus').value = '';
    document.getElementById('academicTeacher').value = '';
    
    currentFilters.academic = { course: '', status: '', teacher: '' };
    loadAcademicReport();
}

function loadFinancialReport() {
    const tbody = document.querySelector('#financialReport tbody');
    if (!tbody) return;
    
    const filteredData = filterFinancialData();
    
    tbody.innerHTML = '';
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Không có dữ liệu</td></tr>';
        return;
    }
    
    filteredData.forEach((record, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${record.month}</td>
                <td>${formatCurrency(record.revenue)}</td>
                <td>${formatCurrency(record.expenses)}</td>
                <td class="${record.profit >= 0 ? 'text-success' : 'text-danger'}">
                    <strong>${formatCurrency(record.profit)}</strong>
                </td>
                <td>${record.students}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    updateFinancialStats(filteredData);
}

function filterFinancialData() {
    let data = [...reportData.financial];
    const filters = currentFilters.financial;
    
    if (filters.monthFrom) {
        data = data.filter(r => r.month >= filters.monthFrom);
    }
    if (filters.monthTo) {
        data = data.filter(r => r.month <= filters.monthTo);
    }
    if (filters.minRevenue) {
        data = data.filter(r => r.revenue >= parseInt(filters.minRevenue));
    }
    
    return data;
}

function updateFinancialStats(data) {
    const totalRevenue = data.reduce((sum, r) => sum + r.revenue, 0);
    const totalExpenses = data.reduce((sum, r) => sum + r.expenses, 0);
    const totalProfit = totalRevenue - totalExpenses;
    const totalStudents = data.reduce((sum, r) => sum + r.students, 0);
    
    const statsDiv = document.querySelector('#financialReport .report-stats');
    if (statsDiv) {
        statsDiv.innerHTML = `
            <div class="stat-item">
                <label>Tổng doanh thu:</label>
                <span class="text-success">${formatCurrency(totalRevenue)}</span>
            </div>
            <div class="stat-item">
                <label>Tổng chi phí:</label>
                <span class="text-danger">${formatCurrency(totalExpenses)}</span>
            </div>
            <div class="stat-item">
                <label>Lợi nhuận:</label>
                <span class="${totalProfit >= 0 ? 'text-success' : 'text-danger'}">
                    <strong>${formatCurrency(totalProfit)}</strong>
                </span>
            </div>
            <div class="stat-item">
                <label>Tổng học viên:</label>
                <span>${totalStudents}</span>
            </div>
        `;
    }
}

function applyFinancialFilter() {
    currentFilters.financial = {
        monthFrom: document.getElementById('financialMonthFrom')?.value || '',
        monthTo: document.getElementById('financialMonthTo')?.value || '',
        minRevenue: document.getElementById('financialMinRevenue')?.value || ''
    };
    
    loadFinancialReport();
}

function resetFinancialFilter() {
    document.getElementById('financialMonthFrom').value = '';
    document.getElementById('financialMonthTo').value = '';
    document.getElementById('financialMinRevenue').value = '';
    
    currentFilters.financial = { monthFrom: '', monthTo: '', minRevenue: '' };
    loadFinancialReport();
}

function exportReport(format) {
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    
    const reportType = activeTab.id.replace('Report', '');
    let reportName = '';
    
    switch(reportType) {
        case 'attendance':
            reportName = 'Báo cáo điểm danh';
            break;
        case 'academic':
            reportName = 'Báo cáo học tập';
            break;
        case 'financial':
            reportName = 'Báo cáo tài chính';
            break;
    }
    
    if (format === 'excel') {
        console.log(`Exporting ${reportName} to Excel...`);
        showNotification(`Đang xuất ${reportName} sang Excel...`, 'info');
        
        // Simulate export delay
        setTimeout(() => {
            showNotification(`Đã xuất ${reportName} thành công!`, 'success');
        }, 1500);
    } else if (format === 'pdf') {
        console.log(`Exporting ${reportName} to PDF...`);
        showNotification(`Đang xuất ${reportName} sang PDF...`, 'info');
        
        // Simulate export delay
        setTimeout(() => {
            showNotification(`Đã xuất ${reportName} thành công!`, 'success');
        }, 1500);
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(amount);
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
if (!document.getElementById('report-animations')) {
    const style = document.createElement('style');
    style.id = 'report-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .percentage.high { color: #1cc88a; font-weight: bold; }
        .percentage.medium { color: #f6c23e; font-weight: bold; }
        .percentage.low { color: #e74a3b; font-weight: bold; }
        .status-passed { background: #d4edda; color: #155724; padding: 4px 12px; border-radius: 12px; }
        .status-failed { background: #f8d7da; color: #721c24; padding: 4px 12px; border-radius: 12px; }
        .text-success { color: #1cc88a; }
        .text-danger { color: #e74a3b; }
    `;
    document.head.appendChild(style);
}

console.log('Reports module loaded successfully');
