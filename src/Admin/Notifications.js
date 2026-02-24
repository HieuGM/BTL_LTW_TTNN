// Notifications Management JavaScript

function showCreateNotificationModal() {
    document.getElementById('notificationModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('notificationModal').style.display = 'none';
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
    alert('Xem chi tiết thông báo: ' + notificationId);
}

function editNotification(notificationId) {
    alert('Chỉnh sửa thông báo: ' + notificationId);
    showCreateNotificationModal();
}

function deleteNotification(notificationId) {
    if (confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
        alert('Đã xóa thông báo: ' + notificationId);
    }
}

function sendNow(notificationId) {
    if (confirm('Gửi thông báo này ngay bây giờ?')) {
        alert('Đang gửi thông báo: ' + notificationId);
        // TODO: Call API to send notification
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('notificationModal');
    if (event.target === modal) {
        closeModal();
    }
}
