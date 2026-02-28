// ===== ATTENDANCE MANAGEMENT – Nhân viên Giáo vụ =====

const ATT_STATUS = {
    present: { label:'Có mặt',   badge:'badge-present',  selectClass:'present' },
    absent:  { label:'Vắng mặt', badge:'badge-absent',   selectClass:'absent' },
    late:    { label:'Đi muộn',  badge:'badge-late',     selectClass:'late' },
    excused: { label:'Nghỉ phép',badge:'badge-excused',  selectClass:'excused' },
};

let editingAttId = null;
let editStudentStatuses = {};

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    ['attFromDate','attToDate','caDate'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = today;
    });

    populateClassSelects();
    renderAttStats();
    renderSessionsTable();
    populateSheetFilter();
    renderAbsenceReport();

    // Read URL param
    const params = new URLSearchParams(window.location.search);
    const cid = params.get('classId');
    if (cid) {
        document.getElementById('attClassFilter').value = cid;
        renderSessionsTable();
    }
});

/* ===== POPULATE SELECTS ===== */
function populateClassSelects() {
    const opts = STAFF_DATA.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    ['attClassFilter','caClass','reportClassFilter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const prefix = id === 'caClass' ? '' : '<option value="">Tất cả lớp</option>';
            el.innerHTML = prefix + opts;
        }
    });
}

/* ===== STATS ===== */
function renderAttStats() {
    const sessions = STAFF_DATA.attendanceSessions;
    const totalPresent = sessions.reduce((s,a) => s + a.present, 0);
    const totalStudent = sessions.reduce((s,a) => s + a.total, 0);
    const totalAbsent  = sessions.reduce((s,a) => s + a.absent, 0);
    const rate = totalStudent ? Math.round(totalPresent / totalStudent * 100) : 0;

    document.getElementById('attStats').innerHTML = `
        <div class="stat-card">
            <div class="stat-icon" style="background:#0f766e"><i class="fas fa-calendar-check"></i></div>
            <div class="stat-info"><h3>${sessions.length}</h3><p>Tổng buổi học</p></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:#22c55e"><i class="fas fa-user-check"></i></div>
            <div class="stat-info"><h3>${rate}%</h3><p>Tỷ lệ có mặt</p></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:#ef4444"><i class="fas fa-user-times"></i></div>
            <div class="stat-info"><h3>${totalAbsent}</h3><p>Lượt vắng mặt</p></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:#3b82f6"><i class="fas fa-users"></i></div>
            <div class="stat-info"><h3>${STAFF_DATA.students.length}</h3><p>Tổng học viên</p></div>
        </div>
    `;
}

/* ===== SESSIONS TABLE ===== */
function renderSessionsTable() {
    const cls    = document.getElementById('attClassFilter').value;
    const from   = document.getElementById('attFromDate').value;
    const to     = document.getElementById('attToDate').value;

    let data = STAFF_DATA.attendanceSessions.filter(a => {
        if (cls && a.classId !== cls) return false;
        const d = parseDate(a.date);
        if (from && d < new Date(from)) return false;
        if (to   && d > new Date(to))   return false;
        return true;
    });

    document.getElementById('sessionsTableBody').innerHTML = data.map(a => {
        const pct = a.total ? Math.round(a.present / a.total * 100) : 0;
        return `
        <tr>
            <td><code>${a.id}</code></td>
            <td>${a.className}</td>
            <td style="text-align:center">${a.sessionNo}</td>
            <td>${a.date}</td>
            <td>${a.time}</td>
            <td>${a.teacher}</td>
            <td><span class="badge badge-present">${a.present}</span></td>
            <td><span class="badge badge-absent">${a.absent}</span></td>
            <td><span class="badge badge-late">${a.late}</span></td>
            <td>${a.total}</td>
            <td><span class="badge ${a.createdBy==='Giáo vụ'?'badge-makeup':'badge-ongoing'}" style="font-size:.7rem">${a.createdBy}</span></td>
            <td>
                <button class="btn-icon" title="Xem / Sửa" onclick="openEditAttModal('${a.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" title="Xuất Excel" onclick="exportSession('${a.id}')"><i class="fas fa-file-excel"></i></button>
            </td>
        </tr>`;
    }).join('') || `<tr><td colspan="12" style="text-align:center;padding:2rem;color:var(--text-secondary)">Không có dữ liệu</td></tr>`;
}

/* ===== SHEET TAB ===== */
function populateSheetFilter() {
    const sel = document.getElementById('sheetSessionFilter');
    sel.innerHTML = '<option value="">-- Chọn buổi --</option>' +
        STAFF_DATA.attendanceSessions.map(a =>
            `<option value="${a.id}">${a.className} – Buổi ${a.sessionNo} (${a.date})</option>`
        ).join('');
}

function loadSheet() {
    const attId = document.getElementById('sheetSessionFilter').value;
    if (!attId) { document.getElementById('sheetContent').innerHTML = `<div class="empty-state"><i class="fas fa-table"></i><p>Chọn buổi điểm danh để xem bảng</p></div>`; return; }
    renderSheet(attId, 'sheetContent', false);
}

function renderSheet(attId, containerId, editable) {
    const att = STAFF_DATA.attendanceSessions.find(a => a.id === attId);
    const details = STAFF_DATA.attendanceDetails[attId] || [];

    if (!att) return;

    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>${att.className} – Buổi ${att.sessionNo} (${att.date})</h3>
                <div style="display:flex;gap:6px">
                    <span class="badge badge-present">${att.present} có mặt</span>
                    <span class="badge badge-absent">${att.absent} vắng</span>
                    <span class="badge badge-late">${att.late} muộn</span>
                </div>
            </div>
            <div class="attendance-grid">
                <div class="attendance-row attendance-header">
                    <span>#</span><span>Học viên</span><span>Trạng thái</span><span>Ghi chú</span><span></span>
                </div>
                ${details.length
                    ? details.map((d,i) => `
                        <div class="attendance-row">
                            <span style="font-weight:600;color:var(--text-secondary)">${i+1}</span>
                            <div style="display:flex;align-items:center;gap:8px">
                                <div class="student-avatar" style="width:30px;height:30px;font-size:.75rem">${d.name[0]}</div>
                                <span style="font-size:.875rem">${d.name}</span>
                            </div>
                            <span>
                                ${editable
                                    ? `<select class="attendance-status-select ${ATT_STATUS[d.status]?.selectClass||''}"
                                            id="att_${attId}_${d.studentId}"
                                            onchange="updateAttStatus(this,'${attId}','${d.studentId}')">
                                            ${Object.entries(ATT_STATUS).map(([k,v]) =>
                                                `<option value="${k}" ${d.status===k?'selected':''}>${v.label}</option>`
                                            ).join('')}
                                        </select>`
                                    : `<span class="badge ${ATT_STATUS[d.status]?.badge||''}">${ATT_STATUS[d.status]?.label||d.status}</span>`
                                }
                            </span>
                            <span style="font-size:.8rem;color:var(--text-secondary)">${d.note||'–'}</span>
                            <span></span>
                        </div>
                    `).join('')
                    : `<div style="padding:1.5rem;text-align:center;color:var(--text-secondary)">Chưa có dữ liệu học viên trong buổi này</div>`
                }
            </div>
            ${editable ? `
                <div style="margin-top:1rem;padding:0 4px">
                    <div class="form-group" style="max-width:400px">
                        <label>Ghi chú buổi học</label>
                        <textarea placeholder="Ghi chú chung cho buổi này..." style="height:70px"></textarea>
                    </div>
                </div>
            ` : ''}
        </div>
        ${!details.length ? `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i>
                Buổi này chưa có danh sách học viên. Giảng viên hoặc giáo vụ cần tạo điểm danh trước.
            </div>` : ''}
    `;
}

function updateAttStatus(sel, attId, studentId) {
    sel.className = `attendance-status-select ${ATT_STATUS[sel.value]?.selectClass || ''}`;
    editStudentStatuses[`${attId}_${studentId}`] = sel.value;
}

/* ===== OPEN EDIT MODAL ===== */
function openEditAttModal(attId) {
    editingAttId = attId;
    const att = STAFF_DATA.attendanceSessions.find(a => a.id === attId);
    document.getElementById('editAttModalTitle').textContent = `Điểm danh – ${att?.className} – Buổi ${att?.sessionNo} (${att?.date})`;
    renderSheet(attId, 'editAttModalBody', true);
    document.getElementById('editAttModal').style.display = 'block';
}

function saveAttendanceEdits() {
    // Apply any status changes from editStudentStatuses
    Object.entries(editStudentStatuses).forEach(([key, status]) => {
        const [attId, studentId] = key.split('_');
        if (!STAFF_DATA.attendanceDetails[attId]) return;
        const detail = STAFF_DATA.attendanceDetails[attId].find(d => d.studentId === studentId);
        if (detail) detail.status = status;
    });
    editStudentStatuses = {};
    // Recalculate stats for session
    if (editingAttId && STAFF_DATA.attendanceDetails[editingAttId]) {
        const sess = STAFF_DATA.attendanceSessions.find(a => a.id === editingAttId);
        if (sess) {
            const details = STAFF_DATA.attendanceDetails[editingAttId];
            sess.present = details.filter(d => d.status === 'present').length;
            sess.absent  = details.filter(d => d.status === 'absent').length;
            sess.late    = details.filter(d => d.status === 'late').length;
        }
    }
    closeModal('editAttModal');
    showToast('success', 'Đã lưu thay đổi điểm danh!');
    renderSessionsTable();
    renderAttStats();
}

/* ===== CREATE ATTENDANCE ===== */
function openCreateAttModal() {
    document.getElementById('caClass').innerHTML = '<option value="">Chọn lớp...</option>' +
        STAFF_DATA.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    document.getElementById('caStudentList').innerHTML = '<p style="color:var(--text-secondary);font-size:.85rem">Chọn lớp trước</p>';
    document.getElementById('createAttModal').style.display = 'block';
}

function loadAttStudents() {
    const classId = document.getElementById('caClass').value;
    if (!classId) return;
    const students = STAFF_DATA.students.filter(s => s.classes.includes(classId));
    const cls = STAFF_DATA.classes.find(c => c.id === classId);
    if (cls) document.getElementById('caTime').value = cls.time;

    document.getElementById('caStudentList').innerHTML = students.length
        ? `<div class="attendance-grid">
            <div class="attendance-row attendance-header">
                <span>#</span><span>Học viên</span><span>Trạng thái</span><span>Ghi chú</span><span></span>
            </div>
            ${students.map((s,i) => `
                <div class="attendance-row">
                    <span style="color:var(--text-secondary);font-weight:600">${i+1}</span>
                    <span>${s.name}</span>
                    <select class="attendance-status-select present" id="new_${s.id}"
                            onchange="this.className='attendance-status-select '+this.value">
                        ${Object.entries(ATT_STATUS).map(([k,v])=>`<option value="${k}" ${k==='present'?'selected':''}>${v.label}</option>`).join('')}
                    </select>
                    <input type="text" style="font-size:.8rem;padding:4px 8px;border:1.5px solid #e2e8f0;border-radius:6px;width:100%;" placeholder="Ghi chú...">
                    <span></span>
                </div>
            `).join('')}
          </div>`
        : `<p style="color:var(--text-secondary);font-size:.85rem">Lớp chưa có học viên</p>`;
}

function saveAttendance() {
    const classId   = document.getElementById('caClass').value;
    const sessionNo = parseInt(document.getElementById('caSession').value);
    const date      = document.getElementById('caDate').value;
    const time      = document.getElementById('caTime').value;
    if (!classId || !date) { showToast('error', 'Vui lòng chọn đủ thông tin!'); return; }

    const cls = STAFF_DATA.classes.find(c => c.id === classId);
    const students = STAFF_DATA.students.filter(s => s.classes.includes(classId));
    const details = students.map(s => ({
        studentId: s.id,
        name: s.name,
        status: document.getElementById(`new_${s.id}`)?.value || 'present',
        note: ''
    }));

    const newId = 'ATT' + String(STAFF_DATA.attendanceSessions.length + 1).padStart(3,'0');
    const present = details.filter(d => d.status === 'present').length;
    const absent  = details.filter(d => d.status === 'absent').length;
    const late    = details.filter(d => d.status === 'late').length;

    STAFF_DATA.attendanceSessions.push({
        id: newId, classId, className: cls?.name || classId, sessionNo, date: fromInputDate(date),
        time, teacher: cls?.teacher || '–', present, absent, late, total: students.length, createdBy:'Giáo vụ'
    });
    STAFF_DATA.attendanceDetails[newId] = details;

    closeModal('createAttModal');
    showToast('success', 'Đã tạo điểm danh thành công!');
    renderSessionsTable();
    renderAttStats();
    populateSheetFilter();
}

/* ===== ABSENCE REPORT ===== */
function renderAbsenceReport() {
    const classId   = document.getElementById('reportClassFilter').value;
    const threshold = parseInt(document.getElementById('reportThreshold').value) || 20;

    // Build per-student absence rate
    const students = STAFF_DATA.students.filter(s => !classId || s.classes.includes(classId));

    const report = students.map(student => {
        let totalSessions = 0, absentSessions = 0;
        STAFF_DATA.attendanceSessions.filter(a => !classId || a.classId === classId).forEach(sess => {
            const detail = (STAFF_DATA.attendanceDetails[sess.id] || []).find(d => d.studentId === student.id);
            if (detail) {
                totalSessions++;
                if (detail.status === 'absent') absentSessions++;
            }
        });
        const rate = totalSessions ? Math.round(absentSessions / totalSessions * 100) : 0;
        return { ...student, totalSessions, absentSessions, rate };
    }).filter(s => s.rate >= threshold).sort((a,b) => b.rate - a.rate);

    document.getElementById('reportContent').innerHTML = report.length
        ? `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle"></i>
                Tìm thấy <strong>${report.length}</strong> học viên có tỷ lệ vắng ≥ ${threshold}%.
            </div>
            <div class="card">
                <div class="table-wrap">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Học viên</th>
                                <th>Liên hệ</th>
                                <th>Vắng / Tổng buổi</th>
                                <th>Tỷ lệ vắng</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${report.map(s => `
                                <tr>
                                    <td><strong>${s.name}</strong></td>
                                    <td>${s.phone}</td>
                                    <td>${s.absentSessions}/${s.totalSessions}</td>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:8px">
                                            <div style="flex:1;height:8px;background:#f1f5f9;border-radius:4px;overflow:hidden">
                                                <div style="height:100%;width:${Math.min(s.rate,100)}%;background:${s.rate>=50?'var(--danger)':'var(--warning)'};border-radius:4px"></div>
                                            </div>
                                            <strong style="color:${s.rate>=50?'var(--danger)':'var(--warning)'}">${s.rate}%</strong>
                                        </div>
                                    </td>
                                    <td>${statusLabel(s.status)}</td>
                                    <td>
                                        <button class="btn-icon warning" title="Gửi cảnh báo" onclick="sendWarning('${s.id}','${s.name}')">
                                            <i class="fas fa-bell"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>`
        : `<div class="card"><div class="empty-state"><i class="fas fa-check-circle" style="color:var(--success)"></i><p>Không có học viên nào vắng quá ${threshold}%</p></div></div>`;
}

function sendWarning(studentId, name) {
    if (confirm(`Gửi cảnh báo vắng học đến ${name}?`)) {
        showToast('success', `Đã gửi cảnh báo đến ${name}!`);
    }
}

function exportSession(attId) {
    showToast('info', 'Đang xuất file Excel...');
    setTimeout(() => showToast('success', 'Đã xuất điểm danh ra Excel!'), 1200);
}

function exportAbsenceReport() {
    showToast('info', 'Đang tạo báo cáo vắng...');
    setTimeout(() => showToast('success', 'Đã xuất báo cáo!'), 1200);
}

/* ===== HELPERS ===== */
function statusLabel(s) {
    const map = { active:'<span class="badge badge-ongoing">Đang học</span>', reserved:'<span class="badge badge-pending">Bảo lưu</span>', quit:'<span class="badge badge-cancelled">Thôi học</span>' };
    return map[s] || s;
}

function parseDate(ddmmyyyy) {
    const [d,m,y] = (ddmmyyyy||'').split('/');
    return new Date(`${y}-${m}-${d}`);
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
    const idx = { sessions:0, sheet:1, report:2 };
    document.querySelectorAll('.tab-btn')[idx[tab]].classList.add('active');
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
    ['createAttModal','editAttModal'].forEach(id => {
        const m = document.getElementById(id);
        if (m && e.target === m) m.style.display = 'none';
    });
};
