// Classes Management JavaScript

function showAddClassModal() {
    document.getElementById('classModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('classModal').style.display = 'none';
}

function viewClassDetail(classId) {
    alert('Xem chi tiết lớp: ' + classId);
    // TODO: Navigate to class detail page
}

function editClass(classId) {
    alert('Chỉnh sửa lớp: ' + classId);
    showAddClassModal();
    // TODO: Load class data into form
}

function deleteClass(classId) {
    if (confirm('Bạn có chắc chắn muốn xóa lớp này?')) {
        alert('Đã xóa lớp: ' + classId);
        // TODO: Call API to delete class
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('classModal');
    if (event.target === modal) {
        closeModal();
    }
}
