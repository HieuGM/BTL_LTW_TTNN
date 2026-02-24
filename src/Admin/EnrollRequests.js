// Enroll Requests Management JavaScript

function showAddRequestModal() {
    document.getElementById('addRequestModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('requestModal').style.display = 'none';
}

function closeAddModal() {
    document.getElementById('addRequestModal').style.display = 'none';
}

function viewRequest(requestId) {
    document.getElementById('requestModal').style.display = 'block';
    // TODO: Load request data
}

function processRequest(requestId) {
    viewRequest(requestId);
}

// Handle status change to show/hide class assignment
document.addEventListener('change', function(e) {
    if (e.target.id === 'statusSelect') {
        const classAssignSection = document.getElementById('classAssignSection');
        if (e.target.value === 'assigned' || e.target.value === 'paid' || e.target.value === 'completed') {
            classAssignSection.style.display = 'block';
        } else {
            classAssignSection.style.display = 'none';
        }
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const requestModal = document.getElementById('requestModal');
    const addRequestModal = document.getElementById('addRequestModal');
    
    if (event.target === requestModal) {
        closeModal();
    }
    if (event.target === addRequestModal) {
        closeAddModal();
    }
}

// Set date range
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    
    if (fromDate) fromDate.value = firstDay.toISOString().split('T')[0];
    if (toDate) toDate.value = today.toISOString().split('T')[0];
});
