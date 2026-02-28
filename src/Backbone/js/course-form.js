// Course Form JavaScript (Add/Edit Course)

// Get course ID from URL if editing
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('id');
let isEditMode = !!courseId;

// Course data (sample - would come from API)
const existingCourse = {
    id: 'course001',
    code: 'IELTS-001',
    name: 'IELTS Foundation',
    level: 'basic',
    description: 'Khóa học IELTS cơ bản cho người mới bắt đầu. Nội dung bao gồm 4 kỹ năng Listening, Speaking, Reading, Writing.',
    target: 'Đạt IELTS 5.0-5.5. Nắm vững nền tảng ngữ pháp và từ vựng cơ bản.',
    sessions: 60,
    duration: '4 tháng',
    tuition: 6500000,
    materials: 'Cambridge IELTS 1-10, Grammar in Use (Basic)',
    paymentOptions: ['full', 'monthly', 'term'],
    prerequisites: 'Không yêu cầu',
    status: 'active'
};

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    if (isEditMode) {
        loadCourseData();
        updatePageTitle('Chỉnh sửa khóa học');
    } else {
        updatePageTitle('Thêm khóa học mới');
    }
    
    setupFormValidation();
    setupPaymentOptions();
});

function updatePageTitle(title) {
    const headerTitle = document.querySelector('.header-left h1');
    const breadcrumb = document.querySelector('.breadcrumb span:last-child');
    
    if (headerTitle) headerTitle.textContent = title;
    if (breadcrumb) breadcrumb.textContent = isEditMode ? 'Chỉnh sửa' : 'Thêm mới';
}

function loadCourseData() {
    if (!courseId) return;
    
    // In production, this would fetch from API
    const course = existingCourse;
    
    // Populate form fields
    document.getElementById('courseCode').value = course.code || '';
    document.getElementById('courseName').value = course.name || '';
    document.getElementById('courseLevel').value = course.level || '';
    document.getElementById('courseDescription').value = course.description || '';
    document.getElementById('courseTarget').value = course.target || '';
    document.getElementById('courseSessions').value = course.sessions || '';
    document.getElementById('courseDuration').value = course.duration || '';
    document.getElementById('courseTuition').value = course.tuition || '';
    document.getElementById('courseMaterials').value = course.materials || '';
    document.getElementById('coursePrerequisites').value = course.prerequisites || '';
    document.getElementById('courseStatus').value = course.status || 'active';
    
    // Set payment options
    if (course.paymentOptions) {
        course.paymentOptions.forEach(option => {
            const checkbox = document.querySelector(`input[name="paymentOption"][value="${option}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
}

function setupFormValidation() {
    const form = document.getElementById('courseForm');
    if (!form) return;
    
    // Add input validators
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // Number inputs validation
    const numberInputs = form.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
        });
    });
    
    // Tuition formatting
    const tuitionInput = document.getElementById('courseTuition');
    if (tuitionInput) {
        tuitionInput.addEventListener('blur', function() {
            if (this.value) {
                const formatted = formatCurrency(parseInt(this.value));
                // Show formatted value as placeholder or in a separate display
                console.log('Học phí:', formatted);
            }
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.previousElementSibling?.textContent || field.name;
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${fieldName} là bắt buộc`);
        return false;
    }
    
    if (field.type === 'number' && value) {
        if (parseInt(value) <= 0) {
            showFieldError(field, `${fieldName} phải lớn hơn 0`);
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#e74a3b';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = 'color: #e74a3b; font-size: 0.875rem; margin-top: 0.25rem;';
    errorDiv.textContent = message;
    
    field.parentElement.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function setupPaymentOptions() {
    const checkboxes = document.querySelectorAll('input[name="paymentOption"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('input[name="paymentOption"]:checked').length;
            if (checkedCount === 0) {
                showNotification('Vui lòng chọn ít nhất một phương thức thanh toán', 'warning');
                this.checked = true;
            }
        });
    });
}

function saveCourse() {
    const form = document.getElementById('courseForm');
    if (!form) return;
    
    // Validate all required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
        return;
    }
    
    // Collect form data
    const formData = {
        code: document.getElementById('courseCode').value,
        name: document.getElementById('courseName').value,
        level: document.getElementById('courseLevel').value,
        description: document.getElementById('courseDescription').value,
        target: document.getElementById('courseTarget').value,
        sessions: parseInt(document.getElementById('courseSessions').value),
        duration: document.getElementById('courseDuration').value,
        tuition: parseInt(document.getElementById('courseTuition').value),
        materials: document.getElementById('courseMaterials').value,
        prerequisites: document.getElementById('coursePrerequisites').value,
        status: document.getElementById('courseStatus').value,
        paymentOptions: Array.from(document.querySelectorAll('input[name="paymentOption"]:checked')).map(cb => cb.value)
    };
    
    // Validate payment options
    if (formData.paymentOptions.length === 0) {
        showNotification('Vui lòng chọn ít nhất một phương thức thanh toán!', 'warning');
        return;
    }
    
    // Save course
    if (isEditMode) {
        console.log('Updating course:', courseId, formData);
        showNotification('Cập nhật khóa học thành công!', 'success');
    } else {
        console.log('Creating new course:', formData);
        showNotification('Thêm khóa học mới thành công!', 'success');
    }
    
    // Redirect after short delay
    setTimeout(() => {
        window.location.href = 'courses.html';
    }, 1500);
}

function saveDraft() {
    const form = document.getElementById('courseForm');
    if (!form) return;
    
    console.log('Saving draft...');
    showNotification('Đã lưu nháp!', 'info');
}

function cancelForm() {
    if (confirm('Bạn có chắc chắn muốn hủy? Các thay đổi chưa lưu sẽ bị mất.')) {
        window.location.href = 'courses.html';
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
if (!document.getElementById('form-animations')) {
    const style = document.createElement('style');
    style.id = 'form-animations';
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

console.log('Course form loaded successfully');
