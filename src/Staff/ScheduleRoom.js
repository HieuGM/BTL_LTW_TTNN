// ===== SCHEDULE & ROOM MANAGEMENT – Nhân viên Giáo vụ =====

const DAYS = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
const DAYS_SHORT = ['CN','T2','T3','T4','T5','T6','T7'];

let weekOffset = 0;
let editingRoomId = null;

document.addEventListener('DOMContentLoaded', () => {
    populateFilters();
    renderWeekCalendar();
    renderRoomsGrid();
    renderRoomUsageChart();
    setDefaultConflictDates();
});

/* ===== FILTERS ===== */
function populateFilters() {
    const clsOpts  = STAFF_DATA.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    const roomOpts = STAFF_DATA.rooms.map(r => `<option value="${r.id}">${r.name}</option>`).join('');

    ['scheduleClassFilter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<option value="">Tất cả lớp</option>' + clsOpts;
    });

    ['scheduleRoomFilter','conflictRoom'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<option value="">Tất cả phòng</option>' + roomOpts;
    });

    const arClass = document.getElementById('arClass');
    if (arClass) arClass.innerHTML = '<option value="">Chọn lớp...</option>' + clsOpts;

    const arRoom = document.getElementById('arRoom');
    if (arRoom) arRoom.innerHTML = '<option value="">Chọn phòng...</option>' +
        STAFF_DATA.rooms.map(r => `<option value="${r.id}">${r.name} (${r.capacity} chỗ)</option>`).join('');
}

/* ===== WEEK CALENDAR ===== */
function getWeekDates(offset) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + offset * 7);
    return Array.from({length:7}, (_,i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
    });
}

function renderWeekCalendar() {
    const dates     = getWeekDates(weekOffset);
    const today     = new Date();
    const classFilter = document.getElementById('scheduleClassFilter').value;
    const roomFilter  = document.getElementById('scheduleRoomFilter').value;

    // Week label
    const fmt = d => `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`;
    document.getElementById('weekLabel').textContent =
        `Tuần ${fmt(dates[0])} – ${fmt(dates[6])} / ${dates[0].getFullYear()}`;

    const slots = STAFF_DATA.weekSlots.filter(sl =>
        (!classFilter || sl.classId === classFilter) &&
        (!roomFilter  || STAFF_DATA.classes.find(c => c.id === sl.classId)?.room?.includes(roomFilter))
    );

    const cal = document.getElementById('weekCalendar');
    cal.innerHTML = dates.map((date, dow) => {
        const isToday = date.toDateString() === today.toDateString();
        const daySlots = slots.filter(sl => sl.day === dow);
        return `
        <div class="day-column">
            <div class="day-header ${isToday ? 'today-header' : ''}">
                <strong>${DAYS_SHORT[dow]}</strong><br>
                <span style="font-size:.8rem">${date.getDate()}/${date.getMonth()+1}</span>
                ${isToday ? '<br><span style="font-size:.65rem;background:white;color:var(--primary-color);padding:1px 5px;border-radius:3px">Hôm nay</span>' : ''}
            </div>
            <div class="day-slots">
                ${daySlots.length
                    ? daySlots.map(sl => {
                        const cls = STAFF_DATA.classes.find(c => c.id === sl.classId);
                        return `<div class="slot-event" onclick="showSlotDetail('${sl.classId}')">
                            <strong>${sl.className}</strong>
                            <span>${sl.time}</span>
                            <span style="opacity:.75">${sl.room}</span>
                        </div>`;
                      }).join('')
                    : '<div style="height:100%;color:#d1d5db;font-size:.7rem;text-align:center;padding-top:8px">Trống</div>'
                }
            </div>
        </div>`;
    }).join('');
}

function changeWeek(dir) {
    weekOffset += dir;
    renderWeekCalendar();
}

function showSlotDetail(classId) {
    const cls = STAFF_DATA.classes.find(c => c.id === classId);
    if (!cls) return;
    showToast('info', `${cls.name} – ${cls.teacher||'Chưa có GV'} – ${cls.room} – ${cls.time}`);
}

function printSchedule() {
    window.print();
}

/* ===== ROOMS GRID ===== */
function renderRoomsGrid() {
    document.getElementById('roomsGrid').innerHTML = STAFF_DATA.rooms.map(r => `
        <div class="room-card">
            <div class="room-card-header">
                <h3><i class="fas fa-door-open" style="color:var(--primary-color)"></i> ${r.name}</h3>
                <span class="badge ${r.status==='available'?'badge-available':r.status==='busy'?'badge-busy':'badge-pending'}">
                    ${r.status==='available'?'Còn trống':r.status==='busy'?'Đang dùng':'Bảo trì'}
                </span>
            </div>
            <div class="room-card-body">
                <p><i class="fas fa-users"></i> Sức chứa: <strong>${r.capacity} người</strong></p>
                <p><i class="fas fa-tv"></i> ${r.equipment}</p>
                <p><i class="fas fa-building"></i> Tầng ${r.floor}</p>

                <!-- Classes using this room -->
                ${(() => {
                    const assigned = STAFF_DATA.classes.filter(c => c.room && c.room.includes(r.name.split(' ').pop()));
                    return assigned.length
                        ? `<div style="margin-top:8px"><p style="font-weight:600;margin-bottom:4px;font-size:.78rem;color:var(--text-secondary)">Đang sử dụng:</p>${assigned.map(c => `<span class="badge badge-recruiting" style="margin:1px 2px;font-size:.7rem">${c.name}</span>`).join('')}</div>`
                        : `<p style="color:var(--text-secondary);font-size:.78rem;margin-top:6px">Chưa xếp lớp nào</p>`;
                })()}
            </div>
            <div class="room-card-footer">
                <button class="btn-icon" title="Chỉnh sửa" onclick="openRoomModal('${r.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger" title="Xóa" onclick="deleteRoom('${r.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

/* ===== ROOM MODAL ===== */
function openRoomModal(roomId) {
    editingRoomId = roomId;
    document.getElementById('roomModalTitle').textContent = roomId ? 'Chỉnh sửa phòng' : 'Thêm phòng học';
    if (roomId) {
        const r = STAFF_DATA.rooms.find(x => x.id === roomId);
        if (r) {
            document.getElementById('rmName').value = r.name;
            document.getElementById('rmFloor').value = r.floor;
            document.getElementById('rmCapacity').value = r.capacity;
            document.getElementById('rmEquipment').value = r.equipment;
            document.getElementById('rmStatus').value = r.status;
        }
    } else {
        ['rmName','rmEquipment'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('rmFloor').value = 1;
        document.getElementById('rmCapacity').value = 20;
        document.getElementById('rmStatus').value = 'available';
    }
    document.getElementById('roomModal').style.display = 'block';
}

function saveRoom() {
    const name = document.getElementById('rmName').value.trim();
    if (!name) { showToast('error', 'Vui lòng nhập tên phòng!'); return; }
    if (editingRoomId) {
        const r = STAFF_DATA.rooms.find(x => x.id === editingRoomId);
        if (r) {
            r.name = name;
            r.floor = parseInt(document.getElementById('rmFloor').value);
            r.capacity = parseInt(document.getElementById('rmCapacity').value);
            r.equipment = document.getElementById('rmEquipment').value;
            r.status = document.getElementById('rmStatus').value;
        }
        showToast('success', 'Đã cập nhật phòng học!');
    } else {
        const newId = 'R' + name.replace(/\D/g,'');
        STAFF_DATA.rooms.push({
            id: newId, name,
            floor: parseInt(document.getElementById('rmFloor').value),
            capacity: parseInt(document.getElementById('rmCapacity').value),
            equipment: document.getElementById('rmEquipment').value,
            status: document.getElementById('rmStatus').value,
        });
        showToast('success', 'Đã thêm phòng học mới!');
    }
    closeModal('roomModal');
    renderRoomsGrid();
    populateFilters();
}

function deleteRoom(roomId) {
    if (!confirm('Xóa phòng học này?')) return;
    const idx = STAFF_DATA.rooms.findIndex(r => r.id === roomId);
    if (idx !== -1) STAFF_DATA.rooms.splice(idx, 1);
    showToast('success', 'Đã xóa phòng!');
    renderRoomsGrid();
}

/* ===== ASSIGN ROOM ===== */
function openAssignRoomModal() {
    populateFilters();
    document.getElementById('arConflictCheck').innerHTML = '';
    document.getElementById('assignRoomModal').style.display = 'block';
}

function autoFillClassInfo() {
    const classId = document.getElementById('arClass').value;
    const cls = STAFF_DATA.classes.find(c => c.id === classId);
    document.getElementById('arSchedule').value = cls?.schedule || '';
    document.getElementById('arTime').value = cls?.time || '';
}

function confirmAssignRoom() {
    const classId = document.getElementById('arClass').value;
    const roomId  = document.getElementById('arRoom').value;
    if (!classId || !roomId) { showToast('error', 'Vui lòng chọn lớp và phòng!'); return; }
    const cls  = STAFF_DATA.classes.find(c => c.id === classId);
    const room = STAFF_DATA.rooms.find(r => r.id === roomId);
    if (cls && room) {
        cls.room = room.name;
        room.status = 'busy';
    }
    closeModal('assignRoomModal');
    showToast('success', `Đã xếp ${room?.name} cho lớp ${cls?.name}!`);
    renderRoomsGrid();
    renderWeekCalendar();
}

/* ===== CONFLICT CHECKER ===== */
function setDefaultConflictDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('conflictDate').value = today;
    document.getElementById('conflictStart').value = '08:00';
    document.getElementById('conflictEnd').value = '10:00';
}

function checkConflict() {
    const roomId = document.getElementById('conflictRoom').value;
    const date   = document.getElementById('conflictDate').value;
    const start  = document.getElementById('conflictStart').value;
    const end    = document.getElementById('conflictEnd').value;

    if (!roomId || !date || !start || !end) { showToast('error', 'Vui lòng điền đủ thông tin!'); return; }

    const room = STAFF_DATA.rooms.find(r => r.id === roomId);

    // Simulate conflict check: look for classes using this room on matching days
    const dow = new Date(date).getDay();
    const slots = STAFF_DATA.weekSlots.filter(sl => {
        const cls = STAFF_DATA.classes.find(c => c.id === sl.classId);
        return sl.day === dow && cls?.room?.includes(room?.name || '');
    });

    const result = document.getElementById('conflictResult');
    if (slots.length) {
        result.innerHTML = `
            <div class="conflict-result conflict-error">
                <i class="fas fa-times-circle"></i>
                <strong>Xung đột!</strong> Phòng ${room?.name} đã có lịch vào ngày này:
                ${slots.map(sl => {
                    const cls = STAFF_DATA.classes.find(c => c.id === sl.classId);
                    return `<div style="margin-top:6px;padding-left:1rem">• <strong>${sl.className}</strong> – ${cls?.time} (GV: ${cls?.teacher||'?'})</div>`;
                }).join('')}
            </div>`;
    } else {
        result.innerHTML = `
            <div class="conflict-result conflict-ok">
                <i class="fas fa-check-circle"></i>
                <strong>Không có xung đột!</strong> ${room?.name} trống vào ${start}–${end} ngày ${date.split('-').reverse().join('/')}.
            </div>`;
    }
}

/* ===== ROOM USAGE CHART ===== */
function renderRoomUsageChart() {
    const usages = STAFF_DATA.rooms.map(r => {
        const classes = STAFF_DATA.classes.filter(c => c.room && c.room.includes(r.name.split(' ').pop()));
        const sessions = classes.length * 3; // approx 3 sessions/week
        const pct = Math.min(100, Math.round(sessions / 15 * 100));
        return { name: r.name, classes: classes.length, pct };
    });

    document.getElementById('roomUsageChart').innerHTML = usages.map(u => `
        <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #f1f5f9">
            <span style="width:90px;font-size:.875rem;font-weight:600">${u.name}</span>
            <div style="flex:1;height:10px;background:#f1f5f9;border-radius:5px;overflow:hidden">
                <div style="height:100%;width:${u.pct}%;background:${u.pct>70?'var(--danger)':u.pct>40?'var(--warning)':'var(--success)'};border-radius:5px;transition:.4s"></div>
            </div>
            <span style="width:80px;font-size:.8rem;color:var(--text-secondary)">${u.classes} lớp · ${u.pct}%</span>
        </div>
    `).join('');
}

/* ===== HELPERS ===== */
function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tab + 'Tab').classList.add('active');
    const idx = { weekly:0, rooms:1, conflict:2 };
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
    ['assignRoomModal','roomModal'].forEach(id => {
        const m = document.getElementById(id);
        if (m && e.target === m) m.style.display = 'none';
    });
};
