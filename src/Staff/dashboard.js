// ===== DASHBOARD – Nhân viên Giáo vụ =====

document.addEventListener('DOMContentLoaded', () => {
    setTodayLabel();
    renderStats();
    renderTodaySessions();
    renderPendingRequests();
    renderUpcoming();
    renderLowEnroll();
    renderMissingTeacher();
});

/* Today label */
function setTodayLabel() {
    const days = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
    const d = new Date();
    const label = `${days[d.getDay()]}, ngày ${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
    document.getElementById('todayLabel').textContent = label;
}

/* Stats */
function renderStats() {
    const { classes, students, requests, attendanceSessions } = STAFF_DATA;
    const ongoing = classes.filter(c => c.status === 'ongoing').length;
    const recruiting = classes.filter(c => c.status === 'recruiting').length;
    const pending = requests.filter(r => r.status === 'pending').length;
    const todayAtt = STAFF_DATA.todaySessions.length;

    const stats = [
        { label:'Lớp đang học', value: ongoing, icon:'fas fa-chalkboard', color:'#0f766e' },
        { label:'Lớp đang tuyển', value: recruiting, icon:'fas fa-users', color:'#3b82f6' },
        { label:'Yêu cầu chờ duyệt', value: pending, icon:'fas fa-inbox', color:'#f59e0b' },
        { label:'Buổi học hôm nay', value: todayAtt, icon:'fas fa-calendar-day', color:'#8b5cf6' },
        { label:'Tổng học viên', value: students.length, icon:'fas fa-user-graduate', color:'#22c55e' },
        { label:'Tổng tháng này đã tạo', value: attendanceSessions.length, icon:'fas fa-clipboard-check', color:'#ef4444' },
    ];

    document.getElementById('statsGrid').innerHTML = stats.map(s => `
        <div class="stat-card">
            <div class="stat-icon" style="background:${s.color}">
                <i class="${s.icon}"></i>
            </div>
            <div class="stat-info">
                <h3>${s.value}</h3>
                <p>${s.label}</p>
            </div>
        </div>
    `).join('');
}

/* Today sessions */
function renderTodaySessions() {
    const container = document.getElementById('todaySessionCards');
    const sessions = STAFF_DATA.todaySessions;

    if (!sessions.length) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-calendar-times"></i><p>Không có buổi học nào hôm nay</p></div>`;
        return;
    }

    container.innerHTML = sessions.map(s => `
        <div class="session-card">
            <h4>${s.className} <span class="badge badge-ongoing" style="font-size:.65rem">Buổi ${s.session}</span></h4>
            <div class="s-info">
                <span><i class="fas fa-clock"></i> ${s.time}</span>
                <span><i class="fas fa-door-open"></i> ${s.room}</span>
                <span><i class="fas fa-chalkboard-teacher"></i> ${s.teacher}</span>
                <span><i class="fas fa-users"></i> ${s.attended !== null ? s.attended + '/' + s.enrolled + ' đã điểm danh' : 'Chưa điểm danh'}</span>
            </div>
            <div style="margin-top:10px;padding-left:8px;display:flex;gap:6px;">
                <button class="btn-primary" style="padding:6px 12px;font-size:.78rem;" 
                    onclick="goAttend('${s.classId}')">
                    <i class="fas fa-clipboard-check"></i> Điểm danh
                </button>
            </div>
        </div>
    `).join('');
}

function goAttend(classId) {
    window.location = `AttendanceManagement.html?classId=${classId}`;
}

/* Pending requests */
const REQUEST_TYPE_CONFIG = {
    transfer: { icon:'fas fa-exchange-alt', color:'#3b82f6', label:'Chuyển lớp' },
    reserve:  { icon:'fas fa-pause-circle',  color:'#f59e0b', label:'Bảo lưu' },
    absence:  { icon:'fas fa-calendar-times',color:'#ef4444', label:'Xin nghỉ' },
    makeup:   { icon:'fas fa-redo-alt',       color:'#8b5cf6', label:'Học bù' },
};

function renderPendingRequests() {
    const list = document.getElementById('requestsList');
    const reqs = STAFF_DATA.requests.filter(r => r.status === 'pending');
    document.getElementById('reqCount').textContent = `${reqs.length} yêu cầu`;

    if (!reqs.length) {
        list.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><p>Không có yêu cầu nào chờ xử lý</p></div>`;
        return;
    }

    list.innerHTML = reqs.map(r => {
        const cfg = REQUEST_TYPE_CONFIG[r.type] || { icon:'fas fa-question', color:'#94a3b8', label: r.type };
        return `
            <div class="request-item">
                <div class="request-icon" style="background:${cfg.color}22">
                    <i class="${cfg.icon}" style="color:${cfg.color}"></i>
                </div>
                <div class="request-item-info">
                    <strong>${r.studentName} – <span style="color:${cfg.color}">${cfg.label}</span></strong>
                    <span>${r.from}${r.to ? ' → ' + r.to : ''} &nbsp;|&nbsp; ${r.date}</span>
                    <span style="color:#94a3b8;font-size:.75rem">${r.reason}</span>
                </div>
                <div class="request-item-actions">
                    <button class="btn-icon warning" title="Xem & xử lý" onclick="openProcessModal('${r.id}')">
                        <i class="fas fa-tasks"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

let activeRequestId = null;

function openProcessModal(reqId) {
    activeRequestId = reqId;
    const r = STAFF_DATA.requests.find(x => x.id === reqId);
    if (!r) return;
    const cfg = REQUEST_TYPE_CONFIG[r.type];
    document.getElementById('processModalTitle').textContent = `Xử lý: ${cfg.label}`;
    document.getElementById('processModalDesc').textContent =
        `Học viên: ${r.studentName} | Lý do: ${r.reason} | Ngày: ${r.date}`;
    document.getElementById('processModal').style.display = 'block';
}

function processRequest(action) {
    if (!activeRequestId) return;
    const r = STAFF_DATA.requests.find(x => x.id === activeRequestId);
    if (r) r.status = action === 'approve' ? 'approved' : 'rejected';
    closeModal('processModal');
    showToast(action === 'approve' ? 'success' : 'warning',
        action === 'approve' ? 'Đã duyệt yêu cầu!' : 'Đã từ chối yêu cầu.');
    renderPendingRequests();
    renderStats();
}

/* Upcoming */
function renderUpcoming() {
    const upcoming = STAFF_DATA.classes.filter(c => c.status === 'recruiting');
    document.getElementById('upcomingList').innerHTML = upcoming.length
        ? upcoming.map(c => `
            <div style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:.85rem;">
                <strong>${c.name}</strong><br>
                <span style="color:var(--text-secondary)">${c.schedule} ${c.time} | Khai: ${c.startDate}</span><br>
                <span class="badge badge-recruiting" style="margin-top:4px">${c.enrolled}/${c.capacity} HV</span>
            </div>
        `).join('')
        : `<p style="color:var(--text-secondary);font-size:.85rem">Không có lớp sắp khai giảng.</p>`;
}

/* Low enrollment */
function renderLowEnroll() {
    const threshold = 0.5;
    const low = STAFF_DATA.classes.filter(c => c.status === 'recruiting' && c.enrolled / c.capacity < threshold);
    document.getElementById('lowEnrollList').innerHTML = low.length
        ? low.map(c => `
            <div style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:.85rem;">
                <strong>${c.name}</strong><br>
                <span style="color:var(--danger);font-weight:600">${c.enrolled}/${c.capacity} học viên</span><br>
                <span style="color:var(--text-secondary)">${c.schedule} ${c.time}</span>
            </div>
        `).join('')
        : `<p style="color:var(--text-secondary);font-size:.85rem">Tất cả lớp đủ học viên.</p>`;
}

/* Missing teacher */
function renderMissingTeacher() {
    const missing = STAFF_DATA.classes.filter(c => c.missingTeacher);
    document.getElementById('missingTeacherList').innerHTML = missing.length
        ? missing.map(c => `
            <div style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:.85rem;">
                <strong>${c.name}</strong><br>
                <span class="badge badge-cancelled" style="margin-top:4px"><i class="fas fa-exclamation-triangle"></i> Chưa có giảng viên</span><br>
                <span style="color:var(--text-secondary)">${c.startDate} – ${c.schedule}</span>
            </div>
        `).join('')
        : `<div style="padding:10px 0;font-size:.85rem;color:var(--text-secondary)"><i class="fas fa-check-circle" style="color:var(--success)"></i> Tất cả lớp đã có giảng viên.</div>`;
}

/* Helpers */
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function showToast(type, msg) {
    const icons = { success:'fa-check-circle', error:'fa-times-circle', warning:'fa-exclamation-triangle', info:'fa-info-circle' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<i class="fas ${icons[type]||'fa-info-circle'}"></i> ${msg}`;
    document.getElementById('toastContainer').appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

window.onclick = e => {
    ['processModal'].forEach(id => {
        const m = document.getElementById(id);
        if (m && e.target === m) m.style.display = 'none';
    });
};
