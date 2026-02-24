// Attendance Management JavaScript

function showCreateAttendanceModal() {
    document.getElementById('attendanceModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('attendanceModal').style.display = 'none';
}

function viewAttendance(attendanceId) {
    alert('Xem chi tiết điểm danh: ' + attendanceId);
    showCreateAttendanceModal();
}

function editAttendance(attendanceId) {
    alert('Chỉnh sửa điểm danh: ' + attendanceId);
    showCreateAttendanceModal();
}

function exportAttendance(attendanceId) {
    alert('Xuất Excel điểm danh: ' + attendanceId);
    // TODO: Export to Excel
}

function viewStudentAttendance(studentId) {
    alert('Xem lịch sử điểm danh học viên: ' + studentId);
}

function sendWarning(studentId) {
    if (confirm('Gửi cảnh báo cho học viên về tình trạng vắng học?')) {
        alert('Đã gửi thông báo đến học viên: ' + studentId);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('attendanceModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Set today's date as default
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    const attendanceDate = document.getElementById('attendanceDate');
    
    if (fromDate) fromDate.value = today;
    if (toDate) toDate.value = today;
    if (attendanceDate) attendanceDate.value = today;
});

// Update status select color on change
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('status-select')) {
        e.target.className = 'status-select ' + e.target.value;
    }
});
