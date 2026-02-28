// ===== DEBT MANAGEMENT – Nhân viên Kế toán =====

let currentPage = 1;
const PAGE_SIZE = 10;
let currentReminderTuitionIds = [];

document.addEventListener('DOMContentLoaded', () => {
    populateClassFilter();
    renderSummary();
    applyFilters();
});

/* ---- Populate class filter ---- */
function populateClassFilter() {
    const sel = document.getElementById('classFilter');
    ACC_DATA.classes.forEach(c => {
        sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}

/* ---- Summary ---- */
function renderSummary() {
    const debts = ACC_DATA.tuitions.filter(t => t.status !== 'paid');
    const totalDebt   = debts.reduce((s, t) => s + t.remaining, 0);
    const overdueList = debts.filter(t => isOverdue(t.dueDate));
    const overdueTot  = overdueList.reduce((s, t) => s + t.remaining, 0);
    const partialList = debts.filter(t => t.status === 'partial');

    document.getElementById('summaryRow').innerHTML = `
        <div class="summary-card">
            <div class="s-label">Tổng công nợ</div>
            <div class="s-value" style="color:var(--danger)">${fmt(totalDebt)}</div>
            <div class="s-sub">${debts.length} phiếu chưa hoàn tất</div>
        </div>
        <div class="summary-card">
            <div class="s-label">Công nợ quá hạn</div>
            <div class="s-value" style="color:#dc2626">${fmt(overdueTot)}</div>
            <div class="s-sub">${overdueList.length} phiếu quá hạn &nbsp;<button class="btn-icon" style="vertical-align:middle" onclick="filterOverdue()"><i class="fas fa-filter"></i></button></div>
        </div>
        <div class="summary-card">
            <div class="s-label">Đóng một phần</div>
            <div class="s-value" style="color:var(--warning)">${partialList.length} phiếu</div>
            <div class="s-sub">Chưa thanh toán hết</div>
        </div>
    `;
}

function filterOverdue() {
    document.getElementById('dueDateFilter').value = 'overdue';
    applyFilters();
}

/* ---- Filters ---- */
function applyFilters() {
    const search  = document.getElementById('searchInput').value.toLowerCase();
    const cls     = document.getElementById('classFilter').value;
    const dueF    = document.getElementById('dueDateFilter').value;
    const statF   = document.getElementById('statusFilter').value;

    let data = ACC_DATA.tuitions.filter(t => t.status !== 'paid');

    if (search) data = data.filter(t => t.studentName.toLowerCase().includes(search) || t.studentId.toLowerCase().includes(search));
    if (cls)    data = data.filter(t => t.classId === cls);
    if (statF)  data = data.filter(t => t.status === statF);

    const today = new Date(new Date().setHours(0,0,0,0));
    if (dueF === 'overdue') {
        data = data.filter(t => isOverdue(t.dueDate));
    } else if (dueF === 'due7') {
        data = data.filter(t => {
            const due = parseDueDate(t.dueDate);
            return due >= today && (due - today) <= 7 * 86400000;
        });
    } else if (dueF === 'due30') {
        data = data.filter(t => {
            const due = parseDueDate(t.dueDate);
            return due >= today && (due - today) <= 30 * 86400000;
        });
    }

    // sort: overdue first, then by remaining desc
    data.sort((a, b) => {
        const ao = isOverdue(a.dueDate) ? 1 : 0;
        const bo = isOverdue(b.dueDate) ? 1 : 0;
        if (bo !== ao) return bo - ao;
        return b.remaining - a.remaining;
    });

    renderTable(data);
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('classFilter').value = '';
    document.getElementById('dueDateFilter').value = '';
    document.getElementById('statusFilter').value = '';
    applyFilters();
}

/* ---- Table ---- */
function renderTable(data) {
    const total = data.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
    const slice = data.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const tbody = document.getElementById('debtTableBody');

    if (!slice.length) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-secondary)">
            <i class="fas fa-check-circle" style="font-size:1.5rem;color:var(--success);display:block;margin-bottom:.5rem"></i>
            Không có công nợ nào trong kết quả lọc</td></tr>`;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    tbody.innerHTML = slice.map(t => {
        const overdue = isOverdue(t.dueDate);
        const daysLeft = daysUntilDue(t.dueDate);
        const dueDateStyle = overdue ? 'color:var(--danger);font-weight:700' : daysLeft <= 7 ? 'color:var(--warning);font-weight:600' : '';
        const badge = t.status === 'partial'
            ? `<span class="badge badge-partial">Đóng một phần</span>`
            : `<span class="badge badge-unpaid">Chưa đóng</span>`;
        const overdueTag = overdue ? `<span class="badge badge-overdue" style="margin-left:4px">Quá hạn ${Math.abs(daysLeft)}n</span>` : '';
        const dueTag = !overdue && daysLeft <= 7
            ? `<span class="badge badge-pending" style="margin-left:4px">Còn ${daysLeft}n</span>` : '';

        return `<tr>
            <td>
                <strong>${t.studentName}</strong><br>
                <small style="color:var(--text-secondary)">${t.studentId}</small>
                <button class="btn-icon" style="vertical-align:middle;margin-left:4px" title="Xem tất cả nợ của học viên này" onclick="showStudentDebts('${t.studentId}')"><i class="fas fa-list"></i></button>
            </td>
            <td>${t.className}</td>
            <td>${fmt(t.amount)}</td>
            <td class="money-green">${fmt(t.paid)}</td>
            <td class="money-red">${fmt(t.remaining)}</td>
            <td>
                <span style="${dueDateStyle}">${t.dueDate}</span>
                ${overdueTag}${dueTag}
            </td>
            <td>${badge}</td>
            <td class="td-actions">
                <button class="btn-icon" title="Gửi nhắc nợ" onclick="openReminderModal(['${t.id}'])"><i class="fas fa-bell"></i></button>
                <button class="btn-icon" title="Cập nhật thanh toán" onclick="window.location='TuitionManagement.html?id=${t.id}'"><i class="fas fa-money-bill-wave"></i></button>
            </td>
        </tr>`;
    }).join('');

    renderPagination(total, totalPages);
}

/* ---- Student debt detail ---- */
function showStudentDebts(studentId) {
    const student = ACC_DATA.students.find(s => s.id === studentId);
    const debts = ACC_DATA.tuitions.filter(t => t.studentId === studentId && t.status !== 'paid');
    const totalDebt = debts.reduce((s, t) => s + t.remaining, 0);

    document.getElementById('studentDebtTitle').innerHTML =
        `<i class="fas fa-user" style="color:var(--primary-color)"></i> 
         Công nợ của ${student ? student.name : studentId} 
         <span class="badge badge-unpaid" style="margin-left:.5rem">${fmt(totalDebt)}</span>`;

    if (!debts.length) {
        document.getElementById('studentDebtBody').innerHTML = `<div class="empty-state"><i class="fas fa-check-double"></i><p>Không có công nợ</p></div>`;
    } else {
        document.getElementById('studentDebtBody').innerHTML = `
            <div class="table-wrapper">
                <table>
                    <thead><tr><th>Phiếu</th><th>Lớp</th><th>Học phí</th><th>Đã đóng</th><th>Còn nợ</th><th>Hạn</th><th>TT</th></tr></thead>
                    <tbody>
                        ${debts.map(t => {
                            const badge = t.status === 'partial' ? 'badge-partial' : 'badge-unpaid';
                            const label = t.status === 'partial' ? 'Đóng một phần' : 'Chưa đóng';
                            return `<tr>
                                <td><code style="font-size:.78rem;color:var(--primary-color)">${t.id}</code></td>
                                <td>${t.className}</td>
                                <td>${fmt(t.amount)}</td>
                                <td class="money-green">${fmt(t.paid)}</td>
                                <td class="money-red">${fmt(t.remaining)}</td>
                                <td style="color:${isOverdue(t.dueDate)?'var(--danger)':'inherit'}">${t.dueDate}</td>
                                <td><span class="badge ${badge}">${label}</span></td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            <div style="margin-top:1rem;text-align:right">
                <button class="btn-warning" onclick="openReminderModal(${JSON.stringify(debts.map(d=>d.id))})">
                    <i class="fas fa-bell"></i> Gửi nhắc nợ tất cả (${debts.length} phiếu)
                </button>
            </div>`;
    }

    document.getElementById('studentDebtCard').style.display = 'block';
    document.getElementById('studentDebtCard').scrollIntoView({ behavior:'smooth' });
}

/* ---- Reminder Modal ---- */
function openReminderModal(tuitionIds) {
    currentReminderTuitionIds = tuitionIds;
    const tuitions = tuitionIds.map(id => ACC_DATA.tuitions.find(t => t.id === id)).filter(Boolean);

    const totalDebt = tuitions.reduce((s, t) => s + t.remaining, 0);
    const names = [...new Set(tuitions.map(t => t.studentName))].join(', ');

    document.getElementById('reminderTargetInfo').innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <div>
            <strong>${names}</strong><br>
            Tổng ${tuitions.length} phiếu nợ – Tổng nợ: <strong style="color:var(--danger)">${fmt(totalDebt)}</strong>
        </div>`;

    // Pre-fill message template
    const t0 = tuitions[0];
    document.getElementById('reminderMsg').value =
        `Kính gửi Học viên ${t0.studentName},\n\n` +
        `Trung tâm Anh ngữ xin nhắc học viên về ${tuitions.length > 1 ? tuitions.length + ' khoản học phí ' : 'khoản học phí '}còn nợ:\n` +
        tuitions.map(t => `- ${t.className}: còn ${fmt(t.remaining)} (hạn ${t.dueDate})`).join('\n') + '\n\n' +
        `Vui lòng thanh toán đúng hạn để đảm bảo quyền lợi học tập.\n\nXin cảm ơn!`;

    document.getElementById('reminderModal').classList.add('show');
}

function closeReminderModal() {
    document.getElementById('reminderModal').classList.remove('show');
    currentReminderTuitionIds = [];
}

function sendReminder() {
    const chkSMS      = document.getElementById('chkSMS').checked;
    const chkEmail    = document.getElementById('chkEmail').checked;
    const chkInternal = document.getElementById('chkInternal').checked;

    if (!chkSMS && !chkEmail && !chkInternal) {
        showToast('error', 'Chọn ít nhất một kênh gửi'); return;
    }

    const channels = [chkSMS && 'SMS/Zalo', chkEmail && 'Email', chkInternal && 'Nội bộ'].filter(Boolean).join(', ');
    showToast('success', `Đã gửi nhắc nợ qua ${channels} đến ${currentReminderTuitionIds.length} phiếu`);
    closeReminderModal();
}

/* ---- Send all reminders ---- */
function sendAllReminders() {
    const overdueDebts = ACC_DATA.tuitions.filter(t => t.status !== 'paid' && isOverdue(t.dueDate));
    if (!overdueDebts.length) { showToast('info', 'Không có công nợ quá hạn cần nhắc'); return; }
    openReminderModal(overdueDebts.map(t => t.id));
}

/* ---- Export ---- */
function exportDebt() {
    const debts = ACC_DATA.tuitions.filter(t => t.status !== 'paid');
    let rows = 'Học viên,Mã HV,Lớp,Học phí,Đã đóng,Còn nợ,Hạn đóng,Trạng thái,Quá hạn\n';
    debts.forEach(t => {
        const st = t.status === 'partial' ? 'Đóng một phần' : 'Chưa đóng';
        const ov = isOverdue(t.dueDate) ? 'Quá hạn' : 'Còn hạn';
        rows += `"${t.studentName}",${t.studentId},"${t.className}",${t.amount},${t.paid},${t.remaining},${t.dueDate},${st},${ov}\n`;
    });
    const blob = new Blob(['\uFEFF' + rows], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cong-no.csv'; a.click();
    showToast('success', 'Đã xuất danh sách công nợ!');
}

/* ---- Pagination ---- */
function renderPagination(total, totalPages) {
    const el = document.getElementById('pagination');
    if (totalPages <= 1) { el.innerHTML = ''; return; }

    let html = `<span class="page-info">Tổng ${total} công nợ</span>`;
    html += `<button class="page-btn" onclick="prevPage()" ${currentPage===1?'disabled':''}><i class="fas fa-chevron-left"></i></button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" onclick="nextPage()" ${currentPage===totalPages?'disabled':''}><i class="fas fa-chevron-right"></i></button>`;
    el.innerHTML = html;
}

function goPage(p) { currentPage = p; applyFilters(); }
function prevPage() { if (currentPage > 1) { currentPage--; applyFilters(); } }
function nextPage() { currentPage++; applyFilters(); }

/* ---- Helpers ---- */
function fmt(n) { return (n || 0).toLocaleString('vi-VN') + ' đ'; }

function parseDueDate(str) {
    const [dd, mm, yyyy] = str.split('/');
    return new Date(+yyyy, +mm - 1, +dd);
}

function isOverdue(str) {
    if (!str) return false;
    return parseDueDate(str) < new Date(new Date().setHours(0,0,0,0));
}

function daysUntilDue(str) {
    if (!str) return 999;
    const diff = parseDueDate(str) - new Date(new Date().setHours(0,0,0,0));
    return Math.round(diff / 86400000);
}

function showToast(type, msg) {
    const icons = { success:'fas fa-check-circle', error:'fas fa-times-circle', info:'fas fa-info-circle', warning:'fas fa-exclamation-triangle' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="${icons[type]||icons.info}"></i><span>${msg}</span>`;
    document.getElementById('toastContainer').appendChild(el);
    setTimeout(() => el.remove(), 3500);
}
