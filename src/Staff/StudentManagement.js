// ===== STUDENT MANAGEMENT – Nhân viên Giáo vụ =====

const PAGE_SIZE = 8;
let currentPage = 1;
let editingStudentId = null;
let activeProfileId = null;

document.addEventListener('DOMContentLoaded', () => {
    populateClassFilter();
    renderStudentTable();
});

function populateClassFilter() {
    const sel = document.getElementById('stdClassFilter');
    sel.innerHTML = '<option value="">Tất cả lớp</option>' +
        STAFF_DATA.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    const svSel = document.getElementById('svClass');
    svSel.innerHTML = '<option value="">Chọn lớp (tuỳ chọn)</option>' +
        STAFF_DATA.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

/* ===== TABLE ===== */
function renderStudentTable() {
    const status  = document.getElementById('stdStatusFilter').value;
    const classId = document.getElementById('stdClassFilter').value;
    const search  = document.getElementById('stdSearch').value.toLowerCase();

    let data = STAFF_DATA.students.filter(s =>
        (!status  || s.status === status) &&
        (!classId || s.classes.includes(classId)) &&
        (!search  || s.name.toLowerCase().includes(search) ||
                     s.phone.includes(search) ||
                     s.email.toLowerCase().includes(search))
    );

    const pages = Math.ceil(data.length / PAGE_SIZE);
    if (currentPage > pages) currentPage = 1;
    const slice = data.slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE);

    document.getElementById('studentTableBody').innerHTML = slice.map(s => {
        const classes = STAFF_DATA.classes.filter(c => s.classes.includes(c.id));
        return `
        <tr>
            <td><code>${s.id}</code></td>
            <td>
                <div style="display:flex;align-items:center;gap:8px">
                    <div class="student-avatar" style="width:32px;height:32px;font-size:.8rem">${s.name[0]}</div>
                    <strong>${s.name}</strong>
                </div>
            </td>
            <td>${s.phone}</td>
            <td>${s.email}</td>
            <td>
                ${classes.length
                    ? classes.map(c => `<span class="badge badge-recruiting" style="margin:1px 2px">${c.name}</span>`).join('')
                    : '<span style="color:var(--text-secondary)">–</span>'}
            </td>
            <td>${statusBadge(s.status)}</td>
            <td>
                <button class="btn-icon" title="Xem hồ sơ" onclick="viewProfile('${s.id}')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" title="Chỉnh sửa" onclick="openStudentModal('${s.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" title="Xem lịch học" onclick="viewSchedule('${s.id}')"><i class="fas fa-calendar-alt"></i></button>
                <button class="btn-icon danger" title="Xóa" onclick="deleteStudent('${s.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
    }).join('') || `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-secondary)">Không tìm thấy học viên</td></tr>`;

    // Pagination
    const p = document.getElementById('studentPagination');
    if (pages > 1) {
        let html = `<button class="btn-page" onclick="goPage(${currentPage-1})"><i class="fas fa-chevron-left"></i></button>`;
        for (let i=1;i<=pages;i++) html += `<button class="btn-page ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
        html += `<button class="btn-page" onclick="goPage(${currentPage+1})"><i class="fas fa-chevron-right"></i></button>`;
        p.innerHTML = html;
    } else p.innerHTML = '';
}

function goPage(p) {
    const pages = Math.ceil(STAFF_DATA.students.length / PAGE_SIZE);
    if (p < 1 || p > pages) return;
    currentPage = p;
    renderStudentTable();
}

/* ===== PROFILE VIEW ===== */
function viewProfile(studentId) {
    activeProfileId = studentId;
    showTab('profile');
    renderProfile(studentId);
}

function renderProfile(studentId) {
    const s = STAFF_DATA.students.find(x => x.id === studentId);
    if (!s) return;

    const classes = STAFF_DATA.classes.filter(c => s.classes.includes(c.id));

    // Attendance summary per class
    const attSummary = classes.map(c => {
        const sessions = STAFF_DATA.attendanceSessions.filter(a => a.classId === c.id);
        let present = 0, absent = 0, total = 0;
        sessions.forEach(sess => {
            const d = (STAFF_DATA.attendanceDetails[sess.id] || []).find(x => x.studentId === studentId);
            if (d) { total++; if (d.status==='present'||d.status==='late') present++; if (d.status==='absent') absent++; }
        });
        return { className: c.name, present, absent, total, pct: total ? Math.round(present/total*100) : 0 };
    });

    document.getElementById('profileContent').innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1.5fr;gap:1.25rem;">

            <!-- LEFT: Info -->
            <div>
                <div class="card">
                    <div style="text-align:center;padding:1rem 0">
                        <div class="student-avatar" style="width:64px;height:64px;font-size:1.5rem;margin:auto">${s.name[0]}</div>
                        <h3 style="margin-top:12px;font-size:1.1rem">${s.name}</h3>
                        <p style="color:var(--text-secondary);font-size:.85rem">${s.id}</p>
                        ${statusBadge(s.status)}
                    </div>
                    <table style="width:100%;font-size:.875rem;border-collapse:collapse;margin-top:8px">
                        ${iRow('Điện thoại', s.phone)}
                        ${iRow('Email', s.email)}
                        ${iRow('Ngày sinh', s.dob || '–')}
                        ${iRow('Ghi chú', s.note || '–')}
                    </table>
                    <div style="display:flex;gap:8px;margin-top:1rem;flex-wrap:wrap">
                        <button class="btn-primary" style="font-size:.8rem;padding:7px 12px" onclick="openStudentModal('${s.id}')">
                            <i class="fas fa-edit"></i> Cập nhật
                        </button>
                        <button class="btn-secondary" style="font-size:.8rem;padding:7px 12px" onclick="viewSchedule('${s.id}')">
                            <i class="fas fa-calendar-alt"></i> Lịch học
                        </button>
                    </div>
                </div>
            </div>

            <!-- RIGHT: Classes + Attendance -->
            <div>
                <div class="card">
                    <div class="card-header">
                        <h3><i class="fas fa-chalkboard" style="color:var(--primary-color)"></i> Lớp đang tham gia</h3>
                    </div>
                    ${classes.length
                        ? classes.map((c,i) => {
                            const att = attSummary[i];
                            return `
                            <div style="padding:12px 0;border-bottom:1px solid #f1f5f9">
                                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:6px">
                                    <div>
                                        <strong style="font-size:.875rem">${c.name}</strong><br>
                                        <span style="font-size:.78rem;color:var(--text-secondary)">${c.schedule} | ${c.time} | ${c.teacher||'Chưa có GV'}</span>
                                    </div>
                                    ${statusBadge(c.status)}
                                </div>
                                <div style="margin-top:8px;font-size:.8rem;color:var(--text-secondary)">
                                    Điểm danh: <strong>${att.present}/${att.total} buổi</strong> –
                                    <span style="color:${att.pct>=80?'var(--success)':att.pct>=60?'var(--warning)':'var(--danger)'}">
                                        ${att.pct}% có mặt
                                    </span>
                                </div>
                            </div>`;
                          }).join('')
                        : `<p style="color:var(--text-secondary);font-size:.875rem;padding:1rem 0">Học viên chưa đăng ký lớp nào</p>`
                    }
                </div>

                <!-- Schedule mini view -->
                <div class="card">
                    <div class="card-header">
                        <h3><i class="fas fa-calendar-week" style="color:var(--info)"></i> Lịch học tuần này</h3>
                    </div>
                    ${renderMiniSchedule(s)}
                </div>
            </div>
        </div>
    `;
}

function renderMiniSchedule(student) {
    const days = ['CN','T2','T3','T4','T5','T6','T7'];
    const today = new Date();
    const todayDow = today.getDay();

    // Get all slots for this student's classes
    const slots = STAFF_DATA.weekSlots.filter(sl => student.classes.includes(sl.classId));
    if (!slots.length) return `<p style="color:var(--text-secondary);font-size:.85rem">Không có lịch học tuần này</p>`;

    const grouped = {};
    slots.forEach(sl => {
        if (!grouped[sl.day]) grouped[sl.day] = [];
        grouped[sl.day].push(sl);
    });

    return `<div style="display:flex;gap:4px;flex-wrap:wrap">` +
        days.map((day,i) => `
            <div style="flex:1;min-width:60px;border:1.5px solid ${i===todayDow?'var(--primary-color)':'var(--border-color)'};border-radius:8px;overflow:hidden">
                <div style="background:${i===todayDow?'var(--primary-color)':'#f8fafc'};color:${i===todayDow?'white':'var(--text-secondary)'};text-align:center;padding:4px;font-size:.72rem;font-weight:600">${day}</div>
                <div style="padding:4px;min-height:40px">
                    ${(grouped[i]||[]).map(sl => `
                        <div style="background:var(--primary-light);border-left:2px solid var(--primary-color);padding:3px 5px;border-radius:3px;font-size:.7rem;margin-bottom:2px">
                            <strong>${sl.className}</strong><br>${sl.time}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('') + `</div>`;
}

function viewSchedule(studentId) {
    viewProfile(studentId);
}

/* ===== MODAL: CREATE / EDIT ===== */
function openStudentModal(studentId) {
    editingStudentId = studentId;
    document.getElementById('studentModalTitle').textContent = studentId ? 'Cập nhật học viên' : 'Tạo hồ sơ học viên';
    populateClassFilter();

    if (studentId) {
        const s = STAFF_DATA.students.find(x => x.id === studentId);
        if (s) {
            document.getElementById('svName').value  = s.name;
            document.getElementById('svPhone').value = s.phone;
            document.getElementById('svEmail').value = s.email;
            document.getElementById('svNote').value  = s.note || '';
            document.getElementById('svStatus').value = s.status;
            document.getElementById('svDob').value = toInputDate(s.dob);
        }
    } else {
        ['svName','svPhone','svEmail','svNote'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('svStatus').value = 'active';
    }
    document.getElementById('studentModal').style.display = 'block';
}

function saveStudent() {
    const name  = document.getElementById('svName').value.trim();
    const phone = document.getElementById('svPhone').value.trim();
    if (!name || !phone) { showToast('error', 'Vui lòng nhập tên và số điện thoại!'); return; }

    if (editingStudentId) {
        const s = STAFF_DATA.students.find(x => x.id === editingStudentId);
        if (s) {
            s.name   = name;
            s.phone  = phone;
            s.email  = document.getElementById('svEmail').value.trim();
            s.note   = document.getElementById('svNote').value.trim();
            s.status = document.getElementById('svStatus').value;
            s.dob    = fromInputDate(document.getElementById('svDob').value);
        }
        showToast('success', 'Đã cập nhật hồ sơ học viên!');
    } else {
        const newId = 'ST' + String(STAFF_DATA.students.length + 1).padStart(3,'0');
        const classId = document.getElementById('svClass').value;
        STAFF_DATA.students.push({
            id: newId,
            name,
            phone,
            email: document.getElementById('svEmail').value.trim(),
            dob: fromInputDate(document.getElementById('svDob').value),
            classes: classId ? [classId] : [],
            status: document.getElementById('svStatus').value,
            note: document.getElementById('svNote').value.trim(),
        });
        if (classId) {
            const cls = STAFF_DATA.classes.find(c => c.id === classId);
            if (cls) cls.enrolled++;
        }
        showToast('success', 'Đã tạo hồ sơ học viên mới!');
    }

    closeModal('studentModal');
    renderStudentTable();
    if (editingStudentId && activeProfileId === editingStudentId) renderProfile(editingStudentId);
}

function deleteStudent(studentId) {
    if (!confirm('Xóa hồ sơ học viên này?')) return;
    const idx = STAFF_DATA.students.findIndex(s => s.id === studentId);
    if (idx !== -1) STAFF_DATA.students.splice(idx, 1);
    showToast('success', 'Đã xóa học viên!');
    renderStudentTable();
}

/* ===== EXPORT ===== */
function exportStudents() {
    showToast('info', 'Đang xuất danh sách...');
    setTimeout(() => showToast('success', 'Xuất file thành công!'), 1200);
}

/* ===== UTILS ===== */
function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tab + 'Tab').classList.add('active');
    document.querySelectorAll('.tab-btn')[tab === 'list' ? 0 : 1].classList.add('active');
}

function statusBadge(s) {
    const map = {
        active:   '<span class="badge badge-ongoing">Đang học</span>',
        reserved: '<span class="badge badge-pending">Bảo lưu</span>',
        quit:     '<span class="badge badge-cancelled">Thôi học</span>',
        ongoing:  '<span class="badge badge-ongoing">Đang học</span>',
        recruiting:'<span class="badge badge-recruiting">Đang tuyển</span>',
        completed:'<span class="badge badge-completed">Kết thúc</span>',
    };
    return map[s] || `<span class="badge">${s}</span>`;
}

function iRow(label, value) {
    return `<tr><td style="padding:7px 10px;color:var(--text-secondary);width:120px">${label}</td><td style="padding:7px 10px">${value}</td></tr>`;
}

function toInputDate(ddmmyyyy) {
    if (!ddmmyyyy) return '';
    const [d,m,y] = ddmmyyyy.split('/');
    return `${y}-${m}-${d}`;
}

function fromInputDate(yyyymmdd) {
    if (!yyyymmdd) return '';
    const [y,m,d] = yyyymmdd.split('-');
    return `${d}/${m}/${y}`;
}

function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function showToast(type, msg) {
    const icons = { success:'fa-check-circle', error:'fa-times-circle', warning:'fa-exclamation-triangle', info:'fa-info-circle' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<i class="fas ${icons[type]||'fa-info-circle'}"></i> ${msg}`;
    document.getElementById('toastContainer').appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

window.onclick = e => {
    const m = document.getElementById('studentModal');
    if (m && e.target === m) m.style.display = 'none';
};
