// ===== CLASS MANAGEMENT – Nhân viên Giáo vụ =====

const STATUS_BADGE = {
    ongoing:    '<span class="badge badge-ongoing">Đang học</span>',
    recruiting: '<span class="badge badge-recruiting">Đang tuyển</span>',
    completed:  '<span class="badge badge-completed">Kết thúc</span>',
    draft:      '<span class="badge badge-draft">Nháp</span>',
};

let currentPage = 1;
const PAGE_SIZE = 8;
let editingClassId = null;
let activeDetailClassId = null;
let transferStudentId = null;
let scStudentId = null;
let makeupClassId = null;

document.addEventListener('DOMContentLoaded', () => {
    populateTeacherSelect('fTeacher');
    populateRoomSelect('fRoom');
    renderClassTable();
});

/* ===== TABLE ===== */
function renderClassTable() {
    const status = document.getElementById('filterStatus').value;
    const course  = document.getElementById('filterCourse').value;
    const search  = document.getElementById('filterSearch').value.toLowerCase();

    let data = STAFF_DATA.classes.filter(c => {
        return (!status || c.status === status)
            && (!course  || c.course.includes(course))
            && (!search  || c.name.toLowerCase().includes(search) || (c.teacher||'').toLowerCase().includes(search));
    });

    const total = data.length;
    const pages = Math.ceil(total / PAGE_SIZE);
    if (currentPage > pages) currentPage = 1;
    const slice = data.slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE);

    document.getElementById('classTableBody').innerHTML = slice.map(c => {
        const pct = c.totalSessions ? Math.round(c.doneSessions / c.totalSessions * 100) : 0;
        const capacityClass = c.enrolled >= c.capacity ? 'badge-cancelled' :
                              c.enrolled / c.capacity >= 0.8 ? 'badge-pending' : 'badge-ongoing';
        return `
        <tr>
            <td><code>${c.code}</code></td>
            <td><strong>${c.name}</strong></td>
            <td>${c.course}</td>
            <td>${c.teacher ? c.teacher : '<span class="badge badge-cancelled"><i class="fas fa-exclamation-triangle"></i> Chưa có GV</span>'}</td>
            <td>${c.schedule} &nbsp;<span style="color:var(--text-secondary)">${c.time}</span></td>
            <td>${c.room || '–'}</td>
            <td><span class="badge ${capacityClass}">${c.enrolled}/${c.capacity}</span></td>
            <td>
                <div style="display:flex;align-items:center;gap:6px;min-width:100px">
                    <div style="flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden">
                        <div style="height:100%;width:${pct}%;background:var(--primary-color);border-radius:3px"></div>
                    </div>
                    <span style="font-size:.75rem;color:var(--text-secondary)">${pct}%</span>
                </div>
            </td>
            <td>${STATUS_BADGE[c.status] || ''}</td>
            <td>
                <button class="btn-icon" title="Xem chi tiết" onclick="viewDetail('${c.id}')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" title="Chỉnh sửa" onclick="openClassModal('${c.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" title="Buổi học bù" onclick="openMakeupModal('${c.id}')"><i class="fas fa-redo-alt"></i></button>
                <button class="btn-icon danger" title="Xóa" onclick="deleteClass('${c.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
    }).join('') || `<tr><td colspan="10" style="text-align:center;color:var(--text-secondary);padding:2rem">Không tìm thấy kết quả</td></tr>`;

    renderPagination(pages);
}

function renderPagination(pages) {
    const p = document.getElementById('classPagination');
    if (pages <= 1) { p.innerHTML = ''; return; }
    let html = `<button class="btn-page" onclick="gotoPage(${currentPage-1})"><i class="fas fa-chevron-left"></i></button>`;
    for (let i=1; i<=pages; i++) html += `<button class="btn-page ${i===currentPage?'active':''}" onclick="gotoPage(${i})">${i}</button>`;
    html += `<button class="btn-page" onclick="gotoPage(${currentPage+1})"><i class="fas fa-chevron-right"></i></button>`;
    p.innerHTML = html;
}

function gotoPage(p) {
    const pages = Math.ceil(getFilteredClasses().length / PAGE_SIZE);
    if (p < 1 || p > pages) return;
    currentPage = p;
    renderClassTable();
}

function getFilteredClasses() {
    const status = document.getElementById('filterStatus').value;
    const course  = document.getElementById('filterCourse').value;
    const search  = document.getElementById('filterSearch').value.toLowerCase();
    return STAFF_DATA.classes.filter(c =>
        (!status || c.status === status) &&
        (!course  || c.course.includes(course)) &&
        (!search  || c.name.toLowerCase().includes(search) || (c.teacher||'').toLowerCase().includes(search))
    );
}

/* ===== DETAIL ===== */
function viewDetail(classId) {
    activeDetailClassId = classId;
    showTab('detail');
    renderClassDetail(classId);
}

function renderClassDetail(classId) {
    const c = STAFF_DATA.classes.find(x => x.id === classId);
    if (!c) return;

    const students = STAFF_DATA.students.filter(s => s.classes.includes(classId));

    document.getElementById('classDetailContent').innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;">
            <!-- INFO -->
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-info-circle" style="color:var(--primary-color)"></i> Thông tin lớp</h3>
                    <button class="btn-secondary" style="padding:6px 12px;font-size:.8rem" onclick="openClassModal('${classId}')">
                        <i class="fas fa-edit"></i> Chỉnh sửa
                    </button>
                </div>
                <table style="width:100%;font-size:.875rem;border-collapse:collapse">
                    ${infoRow('Mã lớp', c.code)}
                    ${infoRow('Tên lớp', `<strong>${c.name}</strong>`)}
                    ${infoRow('Khóa học', c.course)}
                    ${infoRow('Giảng viên', c.teacher || '<span class="badge badge-cancelled">Chưa có</span>')}
                    ${infoRow('Phòng học', c.room || '–')}
                    ${infoRow('Lịch học', `${c.schedule} | ${c.time}`)}
                    ${infoRow('Khai giảng', c.startDate)}
                    ${infoRow('Kết thúc dự kiến', c.endDate)}
                    ${infoRow('Tiến độ', `${c.doneSessions}/${c.totalSessions} buổi`)}
                    ${infoRow('Trạng thái', STATUS_BADGE[c.status])}
                </table>
                <div style="margin-top:1rem;display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="btn-primary" onclick="openMakeupModal('${classId}')">
                        <i class="fas fa-redo-alt"></i> Tạo buổi học bù
                    </button>
                    <button class="btn-secondary" onclick="gotoAttendance('${classId}')">
                        <i class="fas fa-clipboard-check"></i> Xem điểm danh
                    </button>
                </div>
            </div>

            <!-- STUDENTS -->
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-users" style="color:var(--info)"></i> Học viên (${students.length}/${c.capacity})</h3>
                    <button class="btn-primary" style="padding:6px 12px;font-size:.8rem" onclick="openAddStudentModal('${classId}')">
                        <i class="fas fa-user-plus"></i> Thêm HV
                    </button>
                </div>
                <div class="student-list">
                    ${students.length ? students.map(s => `
                        <div class="student-row">
                            <div class="student-avatar">${s.name[0]}</div>
                            <div class="student-info">
                                <strong>${s.name}</strong>
                                <span>${s.phone} &nbsp;|&nbsp; ${statusLabel(s.status)}</span>
                            </div>
                            <div style="display:flex;gap:4px">
                                <button class="btn-icon" title="Chuyển lớp" onclick="openTransferModal('${s.id}','${c.name}')">
                                    <i class="fas fa-exchange-alt"></i>
                                </button>
                                <button class="btn-icon warning" title="Bảo lưu / Thôi học" onclick="openStatusChangeModal('${s.id}','${s.name}')">
                                    <i class="fas fa-pause-circle"></i>
                                </button>
                            </div>
                        </div>
                    `).join('') : `<div class="empty-state"><i class="fas fa-user-slash"></i><p>Chưa có học viên</p></div>`}
                </div>
            </div>
        </div>
    `;
}

function infoRow(label, value) {
    return `<tr>
        <td style="padding:7px 10px;color:var(--text-secondary);width:160px">${label}</td>
        <td style="padding:7px 10px">${value}</td>
    </tr>`;
}

function statusLabel(s) {
    const map = { active:'<span class="badge badge-ongoing">Đang học</span>', reserved:'<span class="badge badge-pending">Bảo lưu</span>', quit:'<span class="badge badge-cancelled">Thôi học</span>' };
    return map[s] || s;
}

/* ===== CLASS MODAL ===== */
function openClassModal(classId) {
    editingClassId = classId;
    document.getElementById('classModalTitle').textContent = classId ? 'Chỉnh sửa lớp' : 'Tạo lớp mới';

    populateTeacherSelect('fTeacher');
    populateRoomSelect('fRoom');

    if (classId) {
        const c = STAFF_DATA.classes.find(x => x.id === classId);
        if (c) {
            document.getElementById('fClassName').value = c.name;
            document.getElementById('fCourse').value = c.course;
            document.getElementById('fTeacher').value = c.teacherId;
            document.getElementById('fRoom').value = c.room;
            document.getElementById('fSchedule').value = c.schedule;
            document.getElementById('fTime').value = c.time;
            document.getElementById('fCapacity').value = c.capacity;
            document.getElementById('fStartDate').value = toInputDate(c.startDate);
            document.getElementById('fEndDate').value = toInputDate(c.endDate);
            document.getElementById('fStatus').value = c.status;
        }
    } else {
        ['fClassName','fSchedule','fTime'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('fCapacity').value = 20;
        document.getElementById('fStatus').value = 'draft';
    }
    document.getElementById('classModal').style.display = 'block';
}

function saveClass() {
    const name = document.getElementById('fClassName').value.trim();
    if (!name) { showToast('error', 'Vui lòng nhập tên lớp!'); return; }

    const teacherSel = document.getElementById('fTeacher');
    const teacherName = teacherSel.options[teacherSel.selectedIndex]?.text || '';

    if (editingClassId) {
        const c = STAFF_DATA.classes.find(x => x.id === editingClassId);
        if (c) {
            c.name = name;
            c.course = document.getElementById('fCourse').value;
            c.teacherId = document.getElementById('fTeacher').value;
            c.teacher = teacherName === 'Chọn giảng viên' ? '' : teacherName;
            c.room = document.getElementById('fRoom').value;
            c.schedule = document.getElementById('fSchedule').value;
            c.time = document.getElementById('fTime').value;
            c.capacity = parseInt(document.getElementById('fCapacity').value) || 20;
            c.status = document.getElementById('fStatus').value;
            c.missingTeacher = !c.teacher;
        }
        showToast('success', 'Đã cập nhật lớp học!');
    } else {
        const newId = 'CLS' + String(STAFF_DATA.classes.length + 1).padStart(3,'0');
        STAFF_DATA.classes.push({
            id: newId, code: newId,
            name, course: document.getElementById('fCourse').value,
            teacherId: document.getElementById('fTeacher').value,
            teacher: teacherName === 'Chọn giảng viên' ? '' : teacherName,
            room: document.getElementById('fRoom').value,
            schedule: document.getElementById('fSchedule').value,
            time: document.getElementById('fTime').value,
            capacity: parseInt(document.getElementById('fCapacity').value) || 20,
            enrolled: 0, totalSessions: 0, doneSessions: 0,
            startDate: fromInputDate(document.getElementById('fStartDate').value),
            endDate: fromInputDate(document.getElementById('fEndDate').value),
            status: document.getElementById('fStatus').value,
            missingTeacher: false,
        });
        showToast('success', 'Đã tạo lớp mới!');
    }
    closeModal('classModal');
    renderClassTable();
    if (editingClassId && activeDetailClassId === editingClassId) renderClassDetail(editingClassId);
}

function deleteClass(classId) {
    if (!confirm('Bạn có chắc muốn xóa lớp này?')) return;
    const idx = STAFF_DATA.classes.findIndex(x => x.id === classId);
    if (idx !== -1) STAFF_DATA.classes.splice(idx, 1);
    showToast('success', 'Đã xóa lớp!');
    renderClassTable();
}

/* ===== ADD STUDENT ===== */
let addStudentClassId = null;

function openAddStudentModal(classId) {
    addStudentClassId = classId;
    const sel = document.getElementById('asStudent');
    const classStudentIds = STAFF_DATA.classes.find(c=>c.id===classId)?.enrolled || [];
    sel.innerHTML = '<option value="">Chọn học viên...</option>' +
        STAFF_DATA.students.filter(s => !s.classes.includes(classId)).map(s =>
            `<option value="${s.id}">${s.name} – ${s.phone}</option>`
        ).join('');
    document.getElementById('addStudentModal').style.display = 'block';
}

function confirmAddStudent() {
    const studentId = document.getElementById('asStudent').value;
    if (!studentId) { showToast('error', 'Vui lòng chọn học viên!'); return; }
    const student = STAFF_DATA.students.find(s => s.id === studentId);
    if (student && !student.classes.includes(addStudentClassId)) {
        student.classes.push(addStudentClassId);
        const cls = STAFF_DATA.classes.find(c => c.id === addStudentClassId);
        if (cls) cls.enrolled++;
    }
    closeModal('addStudentModal');
    showToast('success', 'Đã thêm học viên vào lớp!');
    if (activeDetailClassId === addStudentClassId) renderClassDetail(addStudentClassId);
    renderClassTable();
}

/* ===== TRANSFER ===== */
function openTransferModal(studentId, fromClass) {
    transferStudentId = studentId;
    const student = STAFF_DATA.students.find(s => s.id === studentId);
    document.getElementById('trStudent').value = student ? student.name : '';
    const sel = document.getElementById('trNewClass');
    sel.innerHTML = STAFF_DATA.classes.filter(c => !student?.classes.includes(c.id))
        .map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    document.getElementById('transferModal').style.display = 'block';
}

function confirmTransfer() {
    const newClassId = document.getElementById('trNewClass').value;
    const student = STAFF_DATA.students.find(s => s.id === transferStudentId);
    if (student && newClassId) {
        // Remove from current classes that user is transferring from (simplified: add to new)
        student.classes.push(newClassId);
        const newCls = STAFF_DATA.classes.find(c => c.id === newClassId);
        if (newCls) newCls.enrolled++;
    }
    closeModal('transferModal');
    showToast('success', 'Đã chuyển lớp học viên!');
    if (activeDetailClassId) renderClassDetail(activeDetailClassId);
}

/* ===== RESERVE / QUIT ===== */
function openStatusChangeModal(studentId, studentName) {
    scStudentId = studentId;
    document.getElementById('scStudent').value = studentName;
    document.getElementById('scReason').value = '';
    document.getElementById('statusChangeModal').style.display = 'block';
}

function confirmStatusChange() {
    const action = document.getElementById('scAction').value;
    const reason = document.getElementById('scReason').value.trim();
    if (!reason) { showToast('error', 'Vui lòng nhập lý do!'); return; }
    const student = STAFF_DATA.students.find(s => s.id === scStudentId);
    if (student) { student.status = action; student.note = reason; }
    closeModal('statusChangeModal');
    showToast('success', action === 'reserved' ? 'Đã ghi nhận bảo lưu!' : 'Đã ghi nhận thôi học!');
    if (activeDetailClassId) renderClassDetail(activeDetailClassId);
}

/* ===== MAKEUP ===== */
function openMakeupModal(classId) {
    makeupClassId = classId;
    const c = STAFF_DATA.classes.find(x => x.id === classId);
    document.getElementById('makeupClassLabel').textContent = `Lớp: ${c?.name || classId}`;
    populateRoomSelect('makeupRoom');
    document.getElementById('makeupModal').style.display = 'block';
}

function confirmMakeup() {
    const date = document.getElementById('makeupDate').value;
    const time = document.getElementById('makeupTime').value;
    if (!date || !time) { showToast('error', 'Vui lòng chọn ngày và giờ!'); return; }
    closeModal('makeupModal');
    showToast('success', 'Đã tạo buổi học bù và gửi thông báo!');
}

function gotoAttendance(classId) {
    window.location = `AttendanceManagement.html?classId=${classId}`;
}

/* ===== UTILS ===== */
function populateTeacherSelect(id) {
    document.getElementById(id).innerHTML = '<option value="">Chọn giảng viên</option>' +
        STAFF_DATA.teachers.map(t => `<option value="${t.id}">${t.name} (${t.subject})</option>`).join('');
}

function populateRoomSelect(id) {
    document.getElementById(id).innerHTML = '<option value="">Chọn phòng</option>' +
        STAFF_DATA.rooms.map(r => `<option value="${r.name}">${r.name} – ${r.capacity} chỗ</option>`).join('');
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

function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tab + 'Tab').classList.add('active');
    document.querySelectorAll('.tab-btn')[tab === 'list' ? 0 : 1].classList.add('active');
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
    ['classModal','addStudentModal','transferModal','statusChangeModal','makeupModal'].forEach(id => {
        const m = document.getElementById(id);
        if (m && e.target === m) m.style.display = 'none';
    });
};
