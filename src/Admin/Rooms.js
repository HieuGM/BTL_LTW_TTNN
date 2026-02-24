// Rooms Management JavaScript

function showAddRoomModal() {
    document.getElementById('roomModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('roomModal').style.display = 'none';
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
        event.target.classList.add('active');
    } else if (tabName === 'schedule') {
        document.getElementById('scheduleTab').classList.add('active');
        event.target.classList.add('active');
    }
}

function viewRoomSchedule(roomId) {
    alert('Xem lịch phòng: ' + roomId);
    // Switch to schedule tab and filter by room
    showTab('schedule');
}

function editRoom(roomId) {
    alert('Chỉnh sửa phòng: ' + roomId);
    showAddRoomModal();
}

function deleteRoom(roomId) {
    if (confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
        alert('Đã xóa phòng: ' + roomId);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('roomModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Set today's date as default
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('scheduleDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
});
