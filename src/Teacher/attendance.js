// Fake data for attendance
const classesData = [
    { id: 1, name: "IELTS 6.5 Sáng", code: "IELTS-65-S01" },
    { id: 2, name: "Giao tiếp Cơ bản Tối", code: "GT-CB-T03" },
    { id: 3, name: "TOEIC 650 Chiều", code: "TOEIC-650-C02" }
];

const sessionsData = {
    1: [
        { id: 1, number: 1, date: "04/03/2024", time: "08:00-10:00", status: "completed" },
        { id: 2, number: 2, date: "06/03/2024", time: "08:00-10:00", status: "completed" },
        { id: 3, number: 3, date: "08/03/2024", time: "08:00-10:00", status: "upcoming" }
    ],
    2: [
        { id: 4, number: 1, date: "05/03/2024", time: "18:30-20:00", status: "completed" },
        { id: 5, number: 2, date: "07/03/2024", time: "18:30-20:00", status: "upcoming" }
    ],
    3: [
        { id: 6, number: 1, date: "04/03/2024", time: "14:00-16:00", status: "completed" }
    ]
};

const studentsData = {
    1: [
        { id: 1, code: "HV001", name: "Nguyễn Văn A" },
        { id: 2, code: "HV002", name: "Trần Thị B" },
        { id: 3, code: "HV003", name: "Lê Văn C" },
        { id: 4, code: "HV004", name: "Phạm Thị D" },
        { id: 5, code: "HV005", name: "Hoàng Văn E" }
    ],
    2: [
        { id: 6, code: "HV006", name: "Vũ Thị F" },
        { id: 7, code: "HV007", name: "Đỗ Văn G" },
        { id: 8, code: "HV008", name: "Bùi Thị H" }
    ],
    3: [
        { id: 9, code: "HV009", name: "Đinh Văn I" },
        { id: 10, code: "HV010", name: "Lý Thị K" }
    ]
};

let currentAttendance = [];
let currentClassId = null;
let currentSessionId = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadClassOptions();
    checkURLParams();
});

// Check URL params
function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('classId');
    if (classId) {
        document.getElementById('classSelect').value = classId;
        loadSessions();
    }
}

// Load class options
function loadClassOptions() {
    const select = document.getElementById('classSelect');
    select.innerHTML = '<option value="">-- Chọn lớp học --</option>' +
        classesData.map(cls => `<option value="${cls.id}">${cls.name} (${cls.code})</option>`).join('');
}

// Load sessions
function loadSessions() {
    const classId = parseInt(document.getElementById('classSelect').value);
    currentClassId = classId;
    
    const select = document.getElementById('sessionSelect');
    
    if (!classId) {
        select.innerHTML = '<option value="">-- Chọn buổi học --</option>';
        document.getElementById('attendanceCard').style.display = 'none';
        return;
    }
    
    const sessions = sessionsData[classId] || [];
    select.innerHTML = '<option value="">-- Chọn buổi học --</option>' +
        sessions.map(session => {
            const statusText = session.status === 'completed' ? '(Đã điểm danh)' : '(Chưa điểm danh)';
            return `<option value="${session.id}">Buổi ${session.number} - ${session.date} ${session.time} ${statusText}</option>`;
        }).join('');
    
    document.getElementById('attendanceCard').style.display = 'none';
}

// Load attendance
function loadAttendance() {
    const sessionId = parseInt(document.getElementById('sessionSelect').value);
    currentSessionId = sessionId;
    
    if (!sessionId || !currentClassId) {
        document.getElementById('attendanceCard').style.display = 'none';
        return;
    }
    
    // Find session info
    const allSessions = Object.values(sessionsData).flat();
    const session = allSessions.find(s => s.id === sessionId);
    
    // Update session info
    document.getElementById('sessionTitle').innerHTML = `
        <i class="fas fa-calendar-day"></i> Buổi ${session.number} - ${session.date}
    `;
    document.getElementById('sessionInfo').textContent = `${session.time} • ${classesData.find(c => c.id === currentClassId).name}`;
    
    // Load students
    const students = studentsData[currentClassId] || [];
    
    // Initialize attendance data
    currentAttendance = students.map(student => ({
        studentId: student.id,
        studentCode: student.code,
        studentName: student.name,
        status: 'present', // Default: present
        note: ''
    }));
    
    // Render attendance table
    renderAttendanceTable();
    
    // Update summary
    updateSummary();
    
    // Show card
    document.getElementById('attendanceCard').style.display = 'block';
}

// Render attendance table
function renderAttendanceTable() {
    const tbody = document.getElementById('attendanceTableBody');
    
    tbody.innerHTML = currentAttendance.map((record, index) => `
        <tr class="attendance-row status-${record.status}" data-index="${index}">
            <td>${index + 1}</td>
            <td><strong>${record.studentCode}</strong></td>
            <td>${record.studentName}</td>
            <td>
                <select class="form-control status-select ${record.status}" onchange="updateStatus(${index}, this.value)">
                    <option value="present" ${record.status === 'present' ? 'selected' : ''}>✓ Có mặt</option>
                    <option value="excused" ${record.status === 'excused' ? 'selected' : ''}>⚠ Vắng có phép</option>
                    <option value="absent" ${record.status === 'absent' ? 'selected' : ''}>✗ Vắng không phép</option>
                </select>
            </td>
            <td>
                <input type="text" class="form-control note-input" placeholder="Ghi chú..." 
                       value="${record.note}" onchange="updateNote(${index}, this.value)">
            </td>
            <td>
                <button class="btn btn-sm ${record.status === 'present' ? 'btn-success' : 'btn-warning'}" 
                        onclick="toggleStatus(${index})">
                    <i class="fas ${record.status === 'present' ? 'fa-check' : 'fa-times'}"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Update status
function updateStatus(index, newStatus) {
    currentAttendance[index].status = newStatus;
    renderAttendanceTable();
    updateSummary();
}

// Update note
function updateNote(index, note) {
    currentAttendance[index].note = note;
}

// Toggle status
function toggleStatus(index) {
    const current = currentAttendance[index].status;
    currentAttendance[index].status = current === 'present' ? 'absent' : 'present';
    renderAttendanceTable();
    updateSummary();
}

// Mark all present
function markAllPresent() {
    currentAttendance.forEach(record => {
        record.status = 'present';
    });
    renderAttendanceTable();
    updateSummary();
}

// Mark all absent
function markAllAbsent() {
    if (!confirm('Bạn có chắc chắn muốn đánh dấu tất cả học viên vắng không?')) return;
    
    currentAttendance.forEach(record => {
        record.status = 'absent';
    });
    renderAttendanceTable();
    updateSummary();
}

// Update summary
function updateSummary() {
    const present = currentAttendance.filter(r => r.status === 'present').length;
    const excused = currentAttendance.filter(r => r.status === 'excused').length;
    const absent = currentAttendance.filter(r => r.status === 'absent').length;
    const total = currentAttendance.length;
    
    document.getElementById('countPresent').textContent = present;
    document.getElementById('countExcused').textContent = excused;
    document.getElementById('countAbsent').textContent = absent;
    document.getElementById('countTotal').textContent = total;
}

// Save attendance
function saveAttendance() {
    if (!currentAttendance.length) {
        alert('Không có dữ liệu điểm danh để lưu!');
        return;
    }
    
    // Here you would normally send data to backend
    console.log('Saving attendance:', currentAttendance);
    
    alert('✓ Đã lưu điểm danh thành công!\n\nDữ liệu sẽ được gửi đến backend khi tích hợp API.');
}

// Print attendance
function printAttendance() {
    window.print();
}

// Start new session
function startNewSession() {
    if (!currentClassId) {
        alert('Vui lòng chọn lớp học trước!');
        return;
    }
    
    alert('Chức năng tạo buổi học mới sẽ được implement với backend.\n\nGiảng viên sẽ có thể tạo buổi học mới và điểm danh ngay.');
}
