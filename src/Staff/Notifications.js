// ===== NOTIFICATIONS – Nhân viên Giáo vụ =====

const NTF_TYPE_CONFIG = {
    schedule: { label:'Đổi lịch / Nghỉ học', icon:'fas fa-calendar-times', color:'#f59e0b' },
    exam:     { label:'Kiểm tra',             icon:'fas fa-file-alt',       color:'#3b82f6' },
    tuition:  { label:'Học phí',              icon:'fas fa-money-bill-wave', color:'#22c55e' },
    general:  { label:'Thông báo chung',      icon:'fas fa-bullhorn',        color:'#8b5cf6' },
    makeup:   { label:'Học bù',               icon:'fas fa-redo-alt',        color:'#14b8a6' },
};

const NTF_TEMPLATES = {
    schedule: {
        title: 'Hoãn buổi học [ngày]',
        content: 'Kính gửi các học viên,\n\nDo lý do [lý do], buổi học ngày [ngày] của lớp [lớp] sẽ được hoãn lại.\n\nBuổi học bù sẽ được tổ chức vào ngày [ngày bù] cùng giờ.\n\nTrân trọng,\nBộ phận Giáo vụ'
    },
    exam: {
        title: 'Thông báo kiểm tra [kỳ] – Lớp [lớp]',
        content: 'Kính gửi các học viên lớp [lớp],\n\nLịch kiểm tra [kỳ] sẽ diễn ra vào ngày [ngày], lúc [giờ].\nĐịa điểm: [phòng]\nPhạm vi: [nội dung]\n\nĐề nghị các học viên chuẩn bị đầy đủ.\n\nTrân trọng,\nBộ phận Giáo vụ'
    },
    makeup: {
        title: 'Thông báo buổi học bù – Lớp [lớp]',
        content: 'Kính gửi các học viên,\n\nBuổi học bù cho buổi đã nghỉ sẽ được tổ chức vào:\n📅 Ngày: [ngày]\n🕐 Giờ: [giờ]\n🏫 Phòng: [phòng]\n\nVui lòng có mặt đúng giờ.\n\nTrân trọng,\nBộ phận Giáo vụ'
    }
};

let viewingNotifId = null;

document.addEventListener('DOMContentLoaded', () => {
    renderNotifStats();
    renderNotifTable();
    renderTemplates();
    populateSelects();

    document.getElementById('ntfSendTime').addEventListener('change', function() {
        document.getElementById('scheduledTimeField').style.display = this.value === 'scheduled' ? 'block' : 'none';
    });
});

/* ===== POPULATE SELECTS ===== */
function populateSelects() {
    const classOpts   = STAFF_DATA.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    const studentOpts = STAFF_DATA.students.map(s => `<option value="${s.id}">${s.name} – ${s.phone}</option>`).join('');

    ['ntfClass','ntfMultiClass'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<option value="">Chọn lớp...</option>' + classOpts;
    });

    const ntfStudent = document.getElementById('ntfStudent');
    if (ntfStudent) ntfStudent.innerHTML = '<option value="">Chọn học viên...</option>' + studentOpts;
}

/* ===== STATS ===== */
function renderNotifStats() {
    const notifications = STAFF_DATA.notifications;
    const sent    = notifications.filter(n => n.status === 'sent').length;
    const pending = notifications.filter(n => n.status === 'pending').length;
    const avgRead = sent ? Math.round(notifications.filter(n => n.status==='sent').reduce((s,n) => s+n.readRate,0) / (sent||1)) : 0;

    document.getElementById('notifStats').innerHTML = `
        <div class="stat-card">
            <div class="stat-icon" style="background:#0f766e"><i class="fas fa-paper-plane"></i></div>
            <div class="stat-info"><h3>${sent}</h3><p>Đã gửi</p></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:#f59e0b"><i class="fas fa-clock"></i></div>
            <div class="stat-info"><h3>${pending}</h3><p>Chờ gửi</p></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:#3b82f6"><i class="fas fa-envelope-open"></i></div>
            <div class="stat-info"><h3>${avgRead}%</h3><p>Tỷ lệ đọc trung bình</p></div>
        </div>
        <div class="stat-card">
            <div class="stat-icon" style="background:#8b5cf6"><i class="fas fa-users"></i></div>
            <div class="stat-info"><h3>${STAFF_DATA.students.length}</h3><p>Học viên nhận TBo</p></div>
        </div>
    `;
}

/* ===== TABLE ===== */
function renderNotifTable() {
    const type   = document.getElementById('ntfTypeFilter').value;
    const status = document.getElementById('ntfStatusFilter').value;
    const search = document.getElementById('ntfSearch').value.toLowerCase();

    let data = STAFF_DATA.notifications.filter(n =>
        (!type   || n.type === type) &&
        (!status || n.status === status) &&
        (!search || n.title.toLowerCase().includes(search))
    );

    document.getElementById('notifTableBody').innerHTML = data.map(n => {
        const cfg = NTF_TYPE_CONFIG[n.type] || NTF_TYPE_CONFIG.general;
        return `
        <tr>
            <td>
                <div style="display:flex;align-items:center;gap:8px">
                    <div style="width:34px;height:34px;border-radius:8px;background:${cfg.color}22;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                        <i class="${cfg.icon}" style="color:${cfg.color}"></i>
                    </div>
                    <strong>${n.title}</strong>
                </div>
            </td>
            <td><span class="badge" style="background:${cfg.color}22;color:${cfg.color}">${cfg.label}</span></td>
            <td>
                ${n.target === 'class' ? `<span class="badge badge-recruiting"><i class="fas fa-chalkboard"></i> ${n.targetName}</span>` :
                  n.target === 'student' ? `<span class="badge badge-ongoing"><i class="fas fa-user"></i> ${n.targetName}</span>` :
                  `<span class="badge badge-makeup"><i class="fas fa-users"></i> ${n.targetName}</span>`}
            </td>
            <td>${n.sender}</td>
            <td>${n.date}</td>
            <td>
                ${n.status === 'sent' ? `
                    <div style="display:flex;align-items:center;gap:6px;min-width:80px">
                        <div style="flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden">
                            <div style="height:100%;width:${n.readRate}%;background:var(--success);border-radius:3px"></div>
                        </div>
                        <span style="font-size:.75rem">${n.readRate}%</span>
                    </div>` : '–'}
            </td>
            <td>
                <span class="badge ${n.status==='sent'?'badge-ongoing':n.status==='pending'?'badge-pending':'badge-draft'}">
                    ${n.status==='sent'?'Đã gửi':n.status==='pending'?'Chờ gửi':'Nháp'}
                </span>
            </td>
            <td>
                <button class="btn-icon" title="Xem chi tiết" onclick="viewNotif('${n.id}')"><i class="fas fa-eye"></i></button>
                ${n.status === 'pending' ? `<button class="btn-icon" title="Gửi ngay" onclick="sendNow('${n.id}')"><i class="fas fa-paper-plane"></i></button>` : ''}
                <button class="btn-icon danger" title="Xóa" onclick="deleteNotif('${n.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
    }).join('') || `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-secondary)">Không có thông báo nào</td></tr>`;
}

/* ===== VIEW NOTIF ===== */
function viewNotif(notifId) {
    viewingNotifId = notifId;
    const n = STAFF_DATA.notifications.find(x => x.id === notifId);
    if (!n) return;
    const cfg = NTF_TYPE_CONFIG[n.type] || NTF_TYPE_CONFIG.general;
    document.getElementById('viewNotifTitle').textContent = n.title;
    document.getElementById('viewNotifBody').innerHTML = `
        <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem">
            <span class="badge" style="background:${cfg.color}22;color:${cfg.color}"><i class="${cfg.icon}"></i> ${cfg.label}</span>
            <span class="badge ${n.status==='sent'?'badge-ongoing':'badge-pending'}">${n.status==='sent'?'Đã gửi':'Chờ gửi'}</span>
        </div>
        <table style="width:100%;font-size:.875rem;border-collapse:collapse;margin-bottom:1rem">
            ${nInfoRow('Đối tượng', n.targetName)}
            ${nInfoRow('Người gửi', n.sender)}
            ${nInfoRow('Ngày gửi', n.date)}
            ${nInfoRow('Tỷ lệ đọc', n.status==='sent' ? n.readRate + '%' : '–')}
        </table>
        <div style="background:#f8fafc;border-radius:8px;padding:1rem;font-size:.9rem;white-space:pre-wrap;line-height:1.6;border:1.5px solid var(--border-color)">
            ${n.title}\n\n(Nội dung mẫu thông báo – nội dung đầy đủ sẽ hiện khi kết nối backend)
        </div>
    `;
    document.getElementById('viewNotifDeleteBtn').onclick = () => { deleteNotif(notifId); closeModal('viewNotifModal'); };
    document.getElementById('viewNotifModal').style.display = 'block';
}

function nInfoRow(label, value) {
    return `<tr><td style="padding:5px 10px;color:var(--text-secondary);width:120px">${label}</td><td style="padding:5px 10px;font-weight:600">${value}</td></tr>`;
}

/* ===== CREATE MODAL ===== */
function openCreateModal() {
    populateSelects();
    ['targetClassField','targetStudentField','targetMultiField','scheduledTimeField'].forEach(id =>
        document.getElementById(id).style.display = 'none'
    );
    document.querySelectorAll('[name="ntfTarget"]').forEach(el => el.checked = false);
    document.querySelectorAll('.target-chip').forEach(el => el.classList.remove('selected'));
    document.getElementById('ntfTitle').value = '';
    document.getElementById('ntfContent').value = '';
    document.getElementById('createNotifModal').style.display = 'block';
}

function onTargetChange(radio) {
    document.querySelectorAll('.target-chip').forEach(el => el.classList.remove('selected'));
    const chip = document.getElementById('tchip-' + radio.value);
    if (chip) chip.classList.add('selected');
    document.getElementById('targetClassField').style.display   = radio.value === 'class'   ? 'block' : 'none';
    document.getElementById('targetStudentField').style.display = radio.value === 'student' ? 'block' : 'none';
    document.getElementById('targetMultiField').style.display   = radio.value === 'multi'   ? 'block' : 'none';
}

function loadMultiStudents() {
    const classId = document.getElementById('ntfMultiClass').value;
    const students = classId ? STAFF_DATA.students.filter(s => s.classes.includes(classId)) : [];
    document.getElementById('multiStudentList').innerHTML = students.length
        ? students.map(s => `
            <label style="display:flex;align-items:center;gap:8px;padding:6px 4px;cursor:pointer;border-radius:5px;font-size:.875rem">
                <input type="checkbox" value="${s.id}" checked style="width:15px;height:15px">
                <div class="student-avatar" style="width:26px;height:26px;font-size:.7rem">${s.name[0]}</div>
                ${s.name} – ${s.phone}
            </label>
        `).join('')
        : '<p style="color:var(--text-secondary);font-size:.85rem">Chọn lớp để hiển thị học viên</p>';
}

function applyTemplate(type) {
    const tpl = NTF_TEMPLATES[type];
    if (!tpl) return;
    document.getElementById('ntfTitle').value = tpl.title;
    document.getElementById('ntfContent').value = tpl.content;
    document.getElementById('ntfType').value = type === 'makeup' ? 'schedule' : type;
}

function sendNotification() {
    const title = document.getElementById('ntfTitle').value.trim();
    const type  = document.getElementById('ntfType').value;
    const targetRadio = document.querySelector('[name="ntfTarget"]:checked');
    if (!title) { showToast('error', 'Vui lòng nhập tiêu đề!'); return; }
    if (!targetRadio) { showToast('error', 'Vui lòng chọn đối tượng nhận!'); return; }

    let targetName = '';
    if (targetRadio.value === 'class') {
        const sel = document.getElementById('ntfClass');
        targetName = sel.options[sel.selectedIndex]?.text || 'Lớp không xác định';
    } else if (targetRadio.value === 'student') {
        const sel = document.getElementById('ntfStudent');
        targetName = sel.options[sel.selectedIndex]?.text || 'HV không xác định';
    } else {
        const sel = document.getElementById('ntfMultiClass');
        const count = document.querySelectorAll('#multiStudentList input:checked').length;
        targetName = `${count} HV – ${sel.options[sel.selectedIndex]?.text || ''}`;
    }

    const newId = 'NTF' + String(STAFF_DATA.notifications.length + 1).padStart(3,'0');
    STAFF_DATA.notifications.unshift({
        id: newId, title, type, target: targetRadio.value,
        targetId: '', targetName, sender: 'Giáo vụ (bạn)',
        date: new Date().toLocaleDateString('vi-VN'), status: 'sent', readRate: 0
    });

    closeModal('createNotifModal');
    showToast('success', `Đã gửi thông báo đến ${targetName}!`);
    renderNotifTable();
    renderNotifStats();
}

function saveNotifDraft() {
    const title = document.getElementById('ntfTitle').value.trim();
    if (!title) { showToast('error', 'Vui lòng nhập tiêu đề!'); return; }

    const newId = 'NTF' + String(STAFF_DATA.notifications.length + 1).padStart(3,'0');
    STAFF_DATA.notifications.unshift({
        id: newId, title, type: document.getElementById('ntfType').value, target: 'general',
        targetId: '', targetName: '–', sender: 'Giáo vụ (bạn)',
        date: new Date().toLocaleDateString('vi-VN'), status: 'draft', readRate: 0
    });

    closeModal('createNotifModal');
    showToast('info', 'Đã lưu nháp thông báo!');
    renderNotifTable();
    renderNotifStats();
}

function sendNow(notifId) {
    const n = STAFF_DATA.notifications.find(x => x.id === notifId);
    if (n) n.status = 'sent';
    showToast('success', 'Đã gửi thông báo!');
    renderNotifTable();
    renderNotifStats();
}

function deleteNotif(notifId) {
    if (!confirm('Xóa thông báo này?')) return;
    const idx = STAFF_DATA.notifications.findIndex(x => x.id === notifId);
    if (idx !== -1) STAFF_DATA.notifications.splice(idx, 1);
    showToast('success', 'Đã xóa thông báo!');
    renderNotifTable();
    renderNotifStats();
}

/* ===== TEMPLATES TAB ===== */
function renderTemplates() {
    const templates = [
        { id:'schedule', title:'Hoãn / Đổi buổi học', desc:'Thông báo hoãn hoặc đổi lịch buổi học', icon:'fas fa-calendar-times', color:'#f59e0b' },
        { id:'exam',     title:'Lịch kiểm tra',        desc:'Thông báo ngày, giờ, phạm vi kiểm tra', icon:'fas fa-file-alt',       color:'#3b82f6' },
        { id:'makeup',   title:'Buổi học bù',           desc:'Thông báo lịch học bù sau buổi đã nghỉ', icon:'fas fa-redo-alt',      color:'#14b8a6' },
        { id: 'custom1', title:'Nhắc nhở học phí',      desc:'Nhắc học viên đóng học phí đợt tiếp theo',icon:'fas fa-money-bill-wave', color:'#22c55e' },
        { id: 'custom2', title:'Thông báo khai giảng',  desc:'Thông báo ngày khai giảng lớp mới',        icon:'fas fa-rocket',         color:'#8b5cf6' },
        { id: 'custom3', title:'Điểm danh cảnh báo',    desc:'Cảnh báo học viên vắng quá nhiều buổi',    icon:'fas fa-exclamation-triangle', color:'#ef4444' },
    ];

    document.getElementById('templatesGrid').innerHTML = templates.map(t => `
        <div class="card" style="cursor:pointer;transition:.2s;border:1.5px solid var(--border-color)" onclick="useTemplate('${t.id}')"
             onmouseenter="this.style.borderColor='var(--primary-color)'"
             onmouseleave="this.style.borderColor='var(--border-color)'">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:.75rem">
                <div style="width:44px;height:44px;border-radius:10px;background:${t.color}22;display:flex;align-items:center;justify-content:center">
                    <i class="${t.icon}" style="color:${t.color};font-size:1.1rem"></i>
                </div>
                <strong>${t.title}</strong>
            </div>
            <p style="font-size:.8rem;color:var(--text-secondary)">${t.desc}</p>
            <button class="btn-primary" style="width:100%;margin-top:1rem;font-size:.8rem;padding:8px"
                    onclick="event.stopPropagation();useTemplate('${t.id}')">
                <i class="fas fa-pen"></i> Dùng mẫu này
            </button>
        </div>
    `).join('');
}

function useTemplate(templateId) {
    openCreateModal();
    setTimeout(() => applyTemplate(templateId), 100);
    showTab('list');
}

/* ===== HELPERS ===== */
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
    ['createNotifModal','viewNotifModal'].forEach(id => {
        const m = document.getElementById(id);
        if (m && e.target === m) m.style.display = 'none';
    });
};
