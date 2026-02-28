// ===== DASHBOARD – Nhân viên Kế toán =====

let currentReceiptId = null;

document.addEventListener('DOMContentLoaded', () => {
    setTodayLabel();
    renderStats();
    renderPendingReceipts();
    renderUrgentDebts();
    renderMonthlyChart();
    renderClassRevenue();
    renderDebtorTable();
    updateDebtBadge();
});

/* ---- Today label ---- */
function setTodayLabel() {
    const days = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
    const d = new Date();
    document.getElementById('todayLabel').textContent =
        `${days[d.getDay()]}, ngày ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

/* ---- Stats ---- */
function renderStats() {
    const { tuitions, payments, pendingReceipts } = ACC_DATA;

    const todayStr = formatDate(new Date());
    const todayRevenue = payments
        .filter(p => p.date === todayStr)
        .reduce((s, p) => s + p.amount, 0);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear  = new Date().getFullYear();
    const monthRec = ACC_DATA.monthlyRevenue.find(m => m.month === currentMonth && m.year === currentYear);
    const monthRevenue = monthRec ? monthRec.revenue : 0;

    const totalDebt = tuitions
        .filter(t => t.status !== 'paid')
        .reduce((s, t) => s + t.remaining, 0);

    const overdueCount = tuitions.filter(t => t.status !== 'paid' && isOverdue(t.dueDate)).length;

    const stats = [
        { label:'Thu hôm nay',          value: fmt(todayRevenue),  icon:'fas fa-hand-holding-dollar', color:'#059669' },
        { label:'Doanh thu tháng này',   value: fmt(monthRevenue),  icon:'fas fa-chart-line',          color:'#7c3aed' },
        { label:'Tổng công nợ',          value: fmt(totalDebt),      icon:'fas fa-exclamation-circle',  color:'#ef4444' },
        { label:'Phiếu quá hạn',         value: overdueCount + ' phiếu', icon:'fas fa-calendar-times', color:'#f59e0b' },
        { label:'Phiếu chờ xác nhận',    value: pendingReceipts.filter(p=>p.status==='pending').length, icon:'fas fa-clock', color:'#3b82f6' },
        { label:'Đã thanh toán đầy đủ',  value: tuitions.filter(t=>t.status==='paid').length + ' phiếu', icon:'fas fa-check-circle', color:'#22c55e' },
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

/* ---- Pending Receipts ---- */
function renderPendingReceipts() {
    const list = ACC_DATA.pendingReceipts.filter(p => p.status === 'pending');
    document.getElementById('pendingCount').textContent = list.length + ' phiếu';

    const el = document.getElementById('pendingReceiptsList');
    if (!list.length) {
        el.innerHTML = `<div class="empty-state"><i class="fas fa-check-double"></i><p>Không có phiếu chờ xác nhận</p></div>`;
        return;
    }

    el.innerHTML = list.map(p => `
        <div class="debt-item">
            <div class="debt-item-info">
                <h4>${p.studentName}</h4>
                <p><i class="fas fa-chalkboard"></i> ${p.className} &nbsp;|&nbsp;
                   <i class="fas fa-calendar"></i> ${p.submittedDate} &nbsp;|&nbsp;
                   <i class="fas fa-wallet"></i> ${p.method}</p>
            </div>
            <div style="text-align:right">
                <div class="money" style="font-size:.95rem">${fmt(p.amount)}</div>
                <button class="btn-primary" style="margin-top:6px;padding:5px 10px;font-size:.75rem"
                    onclick="openConfirmModal('${p.id}')">
                    <i class="fas fa-check"></i> Xác nhận
                </button>
            </div>
        </div>
    `).join('');
}

/* ---- Urgent Debts ---- */
function renderUrgentDebts() {
    const overdue = ACC_DATA.tuitions.filter(t => t.status !== 'paid' && isOverdue(t.dueDate));
    const el = document.getElementById('urgentDebtList');

    if (!overdue.length) {
        el.innerHTML = `<div class="empty-state"><i class="fas fa-check-circle"></i><p>Không có công nợ quá hạn</p></div>`;
        return;
    }

    el.innerHTML = overdue.slice(0, 5).map(t => `
        <div class="debt-item">
            <div class="debt-item-info">
                <h4>${t.studentName}</h4>
                <p>${t.className} &nbsp;|&nbsp; Hạn: <strong style="color:var(--danger)">${t.dueDate}</strong></p>
            </div>
            <div style="text-align:right">
                <div class="money-red" style="font-size:.95rem">${fmt(t.remaining)}</div>
                <span class="badge badge-overdue" style="margin-top:4px;">Quá hạn</span>
            </div>
        </div>
    `).join('');
}

/* ---- Monthly Chart ---- */
function renderMonthlyChart() {
    const data = ACC_DATA.monthlyRevenue;
    const max  = Math.max(...data.map(d => d.revenue));

    const bars = data.map(d => {
        const pct = max > 0 ? Math.round((d.revenue / max) * 100) : 0;
        return `
            <div class="chart-bar-wrap">
                <div class="chart-bar" style="height:${pct}%"
                     data-label="${fmt(d.revenue)}"></div>
                <span class="chart-label">T${d.month}</span>
            </div>`;
    }).join('');

    document.getElementById('monthlyChart').innerHTML = `
        <div class="revenue-chart">${bars}</div>
        <div style="text-align:center;font-size:.75rem;color:var(--text-secondary);margin-top:.5rem">
            Đơn vị: VNĐ &nbsp;|&nbsp; Tháng gần nhất: <strong>${fmt(data[data.length-1].revenue)}</strong>
        </div>`;
}

/* ---- Class Revenue ---- */
function renderClassRevenue() {
    const el = document.getElementById('classRevenueList');
    el.innerHTML = ACC_DATA.classRevenue.map(cr => {
        const pct = cr.totalBilled > 0 ? Math.round((cr.totalPaid / cr.totalBilled) * 100) : 0;
        const fillClass = pct >= 90 ? 'success' : pct >= 60 ? 'warning' : 'danger';
        return `
            <div style="margin-bottom:1rem">
                <div style="display:flex;justify-content:space-between;font-size:.82rem;margin-bottom:4px">
                    <span style="font-weight:600">${cr.className}</span>
                    <span style="color:var(--text-secondary)">${pct}%</span>
                </div>
                <div class="progress-bar-wrap">
                    <div class="progress-bar-fill ${fillClass}" style="width:${pct}%"></div>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--text-secondary);margin-top:2px">
                    <span>Đã thu: ${fmt(cr.totalPaid)}</span>
                    <span>/${fmt(cr.totalBilled)}</span>
                </div>
            </div>`;
    }).join('');
}

/* ---- Debtor Table ---- */
function renderDebtorTable() {
    const tbody = document.getElementById('debtorTableBody');
    const debts = ACC_DATA.tuitions
        .filter(t => t.status !== 'paid')
        .sort((a, b) => b.remaining - a.remaining);

    if (!debts.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-secondary);padding:2rem">Không có công nợ nào</td></tr>`;
        return;
    }

    tbody.innerHTML = debts.slice(0, 8).map(t => {
        const overdue = isOverdue(t.dueDate);
        const badge = t.status === 'partial'
            ? `<span class="badge badge-partial">Đóng một phần</span>`
            : `<span class="badge badge-unpaid">Chưa đóng</span>`;
        const overdueTag = overdue ? `<span class="badge badge-overdue" style="margin-left:4px">Quá hạn</span>` : '';
        return `<tr>
            <td><strong>${t.studentName}</strong><br><small style="color:var(--text-secondary)">${t.studentId}</small></td>
            <td>${t.className}</td>
            <td class="money-red">${fmt(t.remaining)}<br><small style="color:var(--text-secondary)">/ ${fmt(t.amount)}</small></td>
            <td style="color:${overdue?'var(--danger)':'inherit'}">${t.dueDate}</td>
            <td>${badge}${overdueTag}</td>
            <td class="td-actions">
                <button class="btn-icon" title="Tạo nhắc nợ" onclick="sendDebtReminder('${t.id}')"><i class="fas fa-bell"></i></button>
                <button class="btn-icon" title="Xem phiếu" onclick="window.location='TuitionManagement.html?id=${t.id}'"><i class="fas fa-eye"></i></button>
            </td>
        </tr>`;
    }).join('');
}

/* ---- Update debt badge ---- */
function updateDebtBadge() {
    const count = ACC_DATA.tuitions.filter(t => t.status !== 'paid' && isOverdue(t.dueDate)).length;
    const badge = document.getElementById('debtBadge');
    if (count > 0) badge.textContent = count;
    else badge.style.display = 'none';
}

/* ---- Confirm Modal ---- */
function openConfirmModal(receiptId) {
    currentReceiptId = receiptId;
    const pr = ACC_DATA.pendingReceipts.find(p => p.id === receiptId);
    if (!pr) return;

    document.getElementById('confirmModalBody').innerHTML = `
        <div class="alert-box alert-info">
            <i class="fas fa-info-circle"></i>
            <div>
                <strong>${pr.studentName}</strong> nộp phiếu xác nhận thanh toán<br>
                Lớp: ${pr.className} &nbsp;|&nbsp; Hình thức: ${pr.method} &nbsp;|&nbsp; Ngày nộp: ${pr.submittedDate}
                <br><span style="font-size:1.1rem;font-weight:700;color:var(--primary-color)">${fmt(pr.amount)}</span>
            </div>
        </div>
        ${pr.proof ? `<p style="font-size:.82rem;color:var(--text-secondary)"><i class="fas fa-paperclip"></i> Chứng từ: ${pr.proof}</p>` : ''}
    `;

    document.getElementById('confirmNote').value = '';
    document.getElementById('confirmModal').classList.add('show');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('show');
    currentReceiptId = null;
}

function approveReceipt() {
    const pr = ACC_DATA.pendingReceipts.find(p => p.id === currentReceiptId);
    if (!pr) return;

    // Mark pending receipt as confirmed
    pr.status = 'confirmed';

    // Find related tuition and update
    const tuition = ACC_DATA.tuitions.find(t => t.studentId === pr.studentId && t.classId === pr.classId && t.status !== 'paid');
    if (tuition) {
        tuition.paid += pr.amount;
        tuition.remaining = Math.max(0, tuition.remaining - pr.amount);
        tuition.status = tuition.remaining === 0 ? 'paid' : 'partial';
        if (tuition.remaining === 0) tuition.paidDate = formatDate(new Date());
    }

    showToast('success', 'Đã xác nhận thanh toán thành công!');
    closeConfirmModal();
    renderPendingReceipts();
    renderDebtorTable();
    renderStats();
    updateDebtBadge();
}

function rejectReceipt() {
    const pr = ACC_DATA.pendingReceipts.find(p => p.id === currentReceiptId);
    if (!pr) return;
    pr.status = 'rejected';
    showToast('warning', 'Đã từ chối phiếu thu.');
    closeConfirmModal();
    renderPendingReceipts();
}

/* ---- Send Debt Reminder ---- */
function sendDebtReminder(tuitionId) {
    const t = ACC_DATA.tuitions.find(x => x.id === tuitionId);
    if (!t) return;
    showToast('info', `Đã gửi nhắc nợ đến ${t.studentName}`);
}

/* ---- Helpers ---- */
function fmt(n) {
    return n.toLocaleString('vi-VN') + ' đ';
}

function formatDate(d) {
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

function isOverdue(dueDateStr) {
    if (!dueDateStr) return false;
    const [dd, mm, yyyy] = dueDateStr.split('/');
    const due = new Date(+yyyy, +mm - 1, +dd);
    return due < new Date(new Date().setHours(0,0,0,0));
}

function showToast(type, msg) {
    const icons = { success:'fas fa-check-circle', error:'fas fa-times-circle', info:'fas fa-info-circle', warning:'fas fa-exclamation-triangle' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="${icons[type]||icons.info}"></i><span>${msg}</span>`;
    document.getElementById('toastContainer').appendChild(el);
    setTimeout(() => el.remove(), 3500);
}
