// Rooms Management JavaScript

// Sample data storage
let roomsData = [
    {
        id: '101',
        name: 'Phòng 101',
        type: 'physical',
        capacity: 25,
        floor: 'Tầng 1',
        equipment: 'Máy chiếu, bảng thông minh',
        link: '',
        notes: '',
        status: 'available'
    },
    {
        id: '102',
        name: 'Phòng 102',
        type: 'physical',
        capacity: 20,
        floor: 'Tầng 1',
        equipment: 'Máy chiếu, loa',
        link: '',
        notes: '',
        status: 'busy',
        currentClass: 'IELTS 6.5 - Sáng',
        currentTime: '8:00 - 10:00'
    },
    {
        id: '201',
        name: 'Phòng 201',
        type: 'physical',
        capacity: 30,
        floor: 'Tầng 2',
        equipment: 'Máy chiếu, bảng thông minh, điều hòa',
        link: '',
        notes: '',
        status: 'available'
    },
    {
        id: 'online1',
        name: 'Phòng Online 1',
        type: 'online',
        capacity: 50,
        floor: '',
        equipment: 'Zoom Pro',
        link: 'zoom.us/j/123456789',
        notes: '',
        status: 'available'
    }
];

let scheduleData = [
    {
        roomId: '102',
        roomName: 'Phòng 102',
        className: 'IELTS 6.5 - Sáng',
        teacher: 'Nguyễn Văn A',
        time: '08:00 - 10:00',
        date: '2026-02-24',
        weekday: 'Thứ 2'
    },
    {
        roomId: '101',
        roomName: 'Phòng 101',
        className: 'Giao tiếp thiếu nhi',
        teacher: 'Trần Thị B',
        time: '10:30 - 12:30',
        date: '2026-02-24',
        weekday: 'Thứ 2'
    },
    {
        roomId: '102',
        roomName: 'Phòng 102',
        className: 'IELTS 7.0 - Intensive',
        teacher: 'Phạm Thị D',
        time: '14:00 - 16:00',
        date: '2026-02-24',
        weekday: 'Thứ 2'
    },
    {
        roomId: '201',
        roomName: 'Phòng 201',
        className: 'TOEIC 650+ - Tối',
        teacher: 'Lê Văn C',
        time: '18:00 - 20:00',
        date: '2026-02-24',
        weekday: 'Thứ 2'
    }
];

let currentEditingRoomId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadRooms();
    setupScheduleFilters();
    setTodayDate();
});

function loadRooms() {
    const roomsGrid = document.querySelector('.rooms-grid');
    if (!roomsGrid) return;
    
    roomsGrid.innerHTML = '';
    
    roomsData.forEach(room => {
        const roomCard = createRoomCard(room);
        roomsGrid.appendChild(roomCard);
    });
}

function createRoomCard(room) {
    const div = document.createElement('div');
    div.className = 'room-card';
    
    const statusBadge = room.status === 'available' ? 
        '<span class="badge badge-available">Còn trống</span>' :
        '<span class="badge badge-busy">Đang sử dụng</span>';
    
    const currentClassInfo = room.status === 'busy' ? `
        <div class="current-class">
            <p><strong>Lớp đang học:</strong> ${room.currentClass}</p>
            <p><strong>Thời gian:</strong> ${room.currentTime}</p>
        </div>
    ` : '';
    
    div.innerHTML = `
        <div class="room-header">
            <h3><i class="fas fa-door-open"></i> ${room.name}</h3>
            ${statusBadge}
        </div>
        <div class="room-body">
            <p><i class="fas fa-users"></i> Sức chứa: <strong>${room.capacity} người</strong></p>
            <p><i class="fas fa-tv"></i> Trang thiết bị: ${room.equipment}</p>
            ${room.floor ? `<p><i class="fas fa-building"></i> ${room.floor}</p>` : ''}
            ${room.link ? `<p><i class="fas fa-link"></i> Link: ${room.link}</p>` : ''}
            ${currentClassInfo}
        </div>
        <div class="room-footer">
            <button class="btn-icon" title="Xem lịch" onclick="viewRoomSchedule('${room.id}')">
                <i class="fas fa-calendar-alt"></i>
            </button>
            <button class="btn-icon" title="Chỉnh sửa" onclick="editRoom('${room.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon btn-danger" title="Xóa" onclick="deleteRoom('${room.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return div;
}

function showAddRoomModal() {
    currentEditingRoomId = null;
    document.querySelector('#roomModal .modal-header h2').textContent = 'Thêm phòng học';
    document.getElementById('roomModal').style.display = 'block';
    resetRoomForm();
}

function closeModal() {
    document.getElementById('roomModal').style.display = 'none';
    resetRoomForm();
}

function resetRoomForm() {
    const form = document.querySelector('#roomModal .modal-body');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            } else {
                input.value = '';
            }
        });
    }
}

function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    if (tabName === 'rooms') {
        document.getElementById('roomsTab').classList.add('active');
        event.currentTarget.classList.add('active');
    } else if (tabName === 'schedule') {
        document.getElementById('scheduleTab').classList.add('active');
        event.currentTarget.classList.add('active');
        loadSchedule();
    }
}

function viewRoomSchedule(roomId) {
    // Switch to schedule tab and filter by room
    const scheduleTab = document.getElementById('scheduleTab');
    const roomsTab = document.getElementById('roomsTab');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    roomsTab.classList.remove('active');
    scheduleTab.classList.add('active');
    tabBtns[0].classList.remove('active');
    tabBtns[1].classList.add('active');
    
    // Set room filter
    const roomSelect = document.getElementById('roomSelect');
    if (roomSelect) {
        roomSelect.value = roomId;
    }
    
    loadSchedule(roomId);
}

function editRoom(roomId) {
    const room = roomsData.find(r => r.id === roomId);
    if (!room) return;
    
    currentEditingRoomId = roomId;
    document.querySelector('#roomModal .modal-header h2').textContent = 'Chỉnh sửa phòng';
    
    // Populate form
    const modal = document.getElementById('roomModal');
    const inputs = modal.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        const label = input.previousElementSibling?.textContent || '';
        
        if (label.includes('Tên phòng')) input.value = room.name;
        else if (label.includes('Loại phòng')) input.value = room.type;
        else if (label.includes('Sức chứa')) input.value = room.capacity;
        else if (label.includes('Tầng')) input.value = room.floor || '';
        else if (label.includes('Trang thiết bị')) input.value = room.equipment;
        else if (label.includes('Link')) input.value = room.link || '';
        else if (label.includes('Ghi chú')) input.value = room.notes || '';
    });
    
    showAddRoomModal();
}

function deleteRoom(roomId) {
    const room = roomsData.find(r => r.id === roomId);
    if (!room) return;
    
    // Check if room is being used
    const hasSchedule = scheduleData.some(s => s.roomId === roomId);
    
    if (hasSchedule) {
        if (!confirm(`⚠️ ${room.name} đang có lịch sử dụng.\n\nBạn có chắc chắn muốn xóa? Các lớp học sử dụng phòng này sẽ cần được gán phòng mới.`)) {
            return;
        }
    } else {
        if (!confirm(`Bạn có chắc chắn muốn xóa ${room.name}?`)) {
            return;
        }
    }
    
    roomsData = roomsData.filter(r => r.id !== roomId);
    loadRooms();
    showNotification('Đã xóa phòng thành công!', 'success');
}

function saveRoom() {
    const modal = document.getElementById('roomModal');
    const inputs = modal.querySelectorAll('input, select, textarea');
    
    // Collect form data
    const formData = {};
    inputs.forEach(input => {
        const label = input.previousElementSibling?.textContent || '';
        
        if (label.includes('Tên phòng')) formData.name = input.value;
        else if (label.includes('Loại phòng')) formData.type = input.value;
        else if (label.includes('Sức chứa')) formData.capacity = parseInt(input.value);
        else if (label.includes('Tầng')) formData.floor = input.value;
        else if (label.includes('Trang thiết bị')) formData.equipment = input.value;
        else if (label.includes('Link')) formData.link = input.value;
        else if (label.includes('Ghi chú')) formData.notes = input.value;
    });
    
    // Validation
    if (!formData.name || !formData.type || !formData.capacity) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    if (currentEditingRoomId) {
        // Update existing room
        const index = roomsData.findIndex(r => r.id === currentEditingRoomId);
        if (index !== -1) {
            roomsData[index] = { ...roomsData[index], ...formData };
            showNotification('Cập nhật phòng thành công!', 'success');
        }
    } else {
        // Add new room
        const newRoom = {
            id: 'ROOM' + Date.now(),
            status: 'available',
            ...formData
        };
        roomsData.push(newRoom);
        showNotification('Thêm phòng mới thành công!', 'success');
    }
    
    loadRooms();
    closeModal();
}

function setupScheduleFilters() {
    const roomSelect = document.getElementById('roomSelect');
    const dateInput = document.getElementById('scheduleDate');
    const searchBtn = document.querySelector('.schedule-filter .btn-search');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => loadSchedule());
    }
    
    if (roomSelect) {
        roomSelect.addEventListener('change', () => loadSchedule());
    }
    
    if (dateInput) {
        dateInput.addEventListener('change', () => loadSchedule());
    }
}

function loadSchedule(roomId = null) {
    const roomFilter = roomId || document.getElementById('roomSelect')?.value;
    const dateFilter = document.getElementById('scheduleDate')?.value;
    
    let filteredSchedule = scheduleData;
    
    if (roomFilter) {
        filteredSchedule = filteredSchedule.filter(s => s.roomId === roomFilter);
    }
    
    if (dateFilter) {
        filteredSchedule = filteredSchedule.filter(s => s.date === dateFilter);
    }
    
    // Update schedule display
    const timeline = document.querySelector('.schedule-timeline');
    if (!timeline) return;
    
    timeline.innerHTML = '';
    
    if (filteredSchedule.length === 0) {
        timeline.innerHTML = '<p style="text-align: center; padding: 20px; color: #888;">Không có lịch học nào</p>';
        return;
    }
    
    filteredSchedule.sort((a, b) => {
        const timeA = a.time.split(' - ')[0];
        const timeB = b.time.split(' - ')[0];
        return timeA.localeCompare(timeB);
    });
    
    filteredSchedule.forEach(schedule => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-time">${schedule.time}</div>
            <div class="timeline-content">
                <div class="timeline-room">${schedule.roomName}</div>
                <div class="timeline-class">${schedule.className}</div>
                <div class="timeline-teacher">GV: ${schedule.teacher}</div>
            </div>
        `;
        timeline.appendChild(item);
    });
    
    // Check for conflicts
    checkRoomConflicts(filteredSchedule);
}

function checkRoomConflicts(scheduleList) {
    const conflicts = [];
    
    for (let i = 0; i < scheduleList.length; i++) {
        for (let j = i + 1; j < scheduleList.length; j++) {
            if (scheduleList[i].roomId === scheduleList[j].roomId) {
                const [start1, end1] = scheduleList[i].time.split(' - ').map(t => t.replace(':', ''));
                const [start2, end2] = scheduleList[j].time.split(' - ').map(t => t.replace(':', ''));
                
                if ((start1 < end2 && end1 > start2)) {
                    conflicts.push(`${scheduleList[i].roomName}: ${scheduleList[i].time} và ${scheduleList[j].time}`);
                }
            }
        }
    }
    
    const warningDiv = document.querySelector('.conflict-warning');
    if (warningDiv) {
        if (conflicts.length > 0) {
            warningDiv.style.background = '#fff3cd';
            warningDiv.style.color = '#856404';
            warningDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Cảnh báo xung đột:</strong> ${conflicts.join('; ')}
            `;
        } else {
            warningDiv.style.background = '#d4edda';
            warningDiv.style.color = '#155724';
            warningDiv.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <strong>Không có xung đột:</strong> Lịch phòng học hợp lệ
            `;
        }
    }
}

function setTodayDate() {
    const dateInput = document.getElementById('scheduleDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
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
    const modal = document.getElementById('roomModal');
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
