// ===== TUITION MANAGEMENT – Nhân viên Kế toán =====

let currentTab = 'all';
let currentPage = 1;
const PAGE_SIZE = 10;
let currentPayTuitionId = null;
let currentViewTuitionId = null;

document.addEventListener('DOMContentLoaded', () => {
    populateFilters();
    renderSummary();
    applyFilters();
    checkUrlParam();
});

/* ---- Check URL param ---- */
function checkUrlParam() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
        const t = ACC_DATA.tuitions.find(x => x.id === id);
        if (t) openViewModal(id);
    }
}

/* ---- Populate dropdowns ---- */
function populateFilters() {
    const classFilter = document.getElementById('classFilter');
    ACC_DATA.classes.forEach(c => {
        classFilter.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });

    const studentSelect = document.getElementById('tuitionStudentId');
    ACC_DATA.students.forEach(s => {
        studentSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.id})</option>`;
    });
}

/* ---- Tab switch ---- */
function switchTab(tab, btn) {
    currentTab = tab;
    currentPage = 1;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
}

/* ---- Filters ---- */
function applyFilters() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const cls = document.getElementById('classFilter').value;
    const method = document.getElementById('methodFilter').value;

    let data = [...ACC_DATA.tuitions];

    // Tab filter
    if (currentTab === 'pending') {
        // show pending receipts table instead
        renderPendingTab();
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    if (currentTab !== 'all') data = data.filter(t => t.status === currentTab);

    // Search
    if (search) data = data.filter(t => t.studentName.toLowerCase().includes(search) || t.id.toLowerCase().includes(search));
    if (cls) data = data.filter(t => t.classId === cls);
    if (method) data = data.filter(t => t.method === method);

    renderTable(data);
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('classFilter').value = '';
    document.getElementById('methodFilter').value = '';
    applyFilters();
}

/* ---- Summary ---- */
function renderSummary() {
    const tuitions = ACC_DATA.tuitions;
    const totalBilled = tuitions.reduce((s, t) => s + t.amount, 0);
    const totalPaid   = tuitions.reduce((s, t) => s + t.paid,   0);
    const totalDebt   = tuitions.reduce((s, t) => s + t.remaining, 0);

    document.getElementById('summaryRow').innerHTML = `
        <div class="summary-card">
            <div class="s-label">Tổng học phí tạo phiếu</div>
            <div class="s-value" style="color:var(--primary-color)">${fmt(totalBilled)}</div>
            <div class="s-sub">${tuitions.length} phiếu thu</div>
        </div>
        <div class="summary-card">
            <div class="s-label">Đã thu được</div>
            <div class="s-value" style="color:var(--success)">${fmt(totalPaid)}</div>
            <div class="s-sub">${tuitions.filter(t=>t.status==='paid').length} phiếu đã đóng đủ</div>
        </div>
        <div class="summary-card">
            <div class="s-label">Công nợ còn lại</div>
            <div class="s-value" style="color:var(--danger)">${fmt(totalDebt)}</div>
            <div class="s-sub">${tuitions.filter(t=>t.status!=='paid').length} phiếu chưa hoàn tất</div>
        </div>
    `;
}

/* ---- Render Table ---- */
function renderTable(data) {
    const total = data.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

    const slice = data.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const tbody = document.getElementById('tuitionTableBody');

    if (!slice.length) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:2rem;color:var(--text-secondary)">Không có phiếu thu nào</td></tr>`;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    tbody.innerHTML = slice.map(t => {
        const overdue = t.status !== 'paid' && isOverdue(t.dueDate);
        const badge = t.status === 'paid'
            ? `<span class="badge badge-paid">Đã đóng</span>`
            : t.status === 'partial'
            ? `<span class="badge badge-partial">Đóng một phần</span>`
            : `<span class="badge badge-unpaid">Chưa đóng</span>`;
        const overdueTag = overdue ? `<span class="badge badge-overdue" style="font-size:.68rem;margin-left:3px">Quá hạn</span>` : '';
        return `<tr>
            <td><code style="font-size:.78rem;color:var(--primary-color)">${t.id}</code></td>
            <td><strong>${t.studentName}</strong></td>
            <td>${t.className}<br><small style="color:var(--text-secondary)">${t.course}</small></td>
            <td class="money">${fmt(t.amount)}</td>
            <td class="money-green">${fmt(t.paid)}</td>
            <td class="${t.remaining > 0 ? 'money-red' : 'money-green'}">${fmt(t.remaining)}</td>
            <td style="color:${overdue ? 'var(--danger)' : 'inherit'}">${t.dueDate}</td>
            <td>${badge}${overdueTag}</td>
            <td class="td-actions">
                <button class="btn-icon" title="Xem phiếu" onclick="openViewModal('${t.id}')"><i class="fas fa-eye"></i></button>
                ${t.status !== 'paid' ? `<button class="btn-icon" title="Cập nhật thanh toán" onclick="openPayModal('${t.id}')"><i class="fas fa-money-bill-wave"></i></button>` : ''}
                <button class="btn-icon" title="Sửa phiếu" onclick="openEditModal('${t.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" title="Xóa phiếu" onclick="deleteTuition('${t.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
    }).join('');

    renderPagination(total, totalPages);
}

/* ---- Pending tab ---- */
function renderPendingTab() {
    const pending = ACC_DATA.pendingReceipts.filter(p => p.status === 'pending');
    const tbody = document.getElementById('tuitionTableBody');

    if (!pending.length) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:2rem;color:var(--text-secondary)">Không có phiếu chờ xác nhận</td></tr>`;
        return;
    }

    tbody.innerHTML = `
        <tr style="background:#fef3c7">
            <td colspan="9" style="font-weight:600;padding:0.6rem 1rem;font-size:.82rem;color:#92400e">
                <i class="fas fa-clock"></i> Các phiếu nộp dưới đây đang chờ kế toán xác nhận
            </td>
        </tr>
        ${pending.map(p => `
        <tr>
            <td><code style="font-size:.78rem;color:var(--primary-color)">${p.id}</code></td>
            <td><strong>${p.studentName}</strong></td>
            <td>${p.className}</td>
            <td class="money">${fmt(p.amount)}</td>
            <td>—</td><td>—</td>
            <td>${p.submittedDate}</td>
            <td><span class="badge badge-pending">Chờ xác nhận</span></td>
            <td class="td-actions">
                <button class="btn-success" style="padding:5px 10px;font-size:.75rem" onclick="approvePending('${p.id}')"><i class="fas fa-check"></i> Duyệt</button>
                <button class="btn-danger"  style="padding:5px 10px;font-size:.75rem" onclick="rejectPending('${p.id}')"><i class="fas fa-times"></i></button>
            </td>
        </tr>`).join('')}
    `;
}

function approvePending(id) {
    const pr = ACC_DATA.pendingReceipts.find(p => p.id === id);
    if (!pr) return;
    pr.status = 'confirmed';
    const t = ACC_DATA.tuitions.find(x => x.studentId === pr.studentId && x.classId === pr.classId && x.status !== 'paid');
    if (t) {
        t.paid += pr.amount;
        t.remaining = Math.max(0, t.remaining - pr.amount);
        t.status = t.remaining === 0 ? 'paid' : 'partial';
        if (t.remaining === 0) t.paidDate = formatDate(new Date());
    }
    showToast('success', 'Đã xác nhận phiếu ' + id);
    renderPendingTab();
    renderSummary();
}

function rejectPending(id) {
    const pr = ACC_DATA.pendingReceipts.find(p => p.id === id);
    if (pr) { pr.status = 'rejected'; showToast('warning', 'Đã từ chối phiếu ' + id); renderPendingTab(); }
}

/* ---- Pagination ---- */
function renderPagination(total, totalPages) {
    const el = document.getElementById('pagination');
    if (totalPages <= 1) { el.innerHTML = ''; return; }

    let html = `<span class="page-info">Tổng ${total} phiếu</span>`;
    html += `<button class="page-btn" onclick="goPage(${currentPage-1})" ${currentPage===1?'disabled':''}><i class="fas fa-chevron-left"></i></button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" onclick="goPage(${currentPage+1})" ${currentPage===totalPages?'disabled':''}><i class="fas fa-chevron-right"></i></button>`;
    el.innerHTML = html;
}

function goPage(p) {
    const totalPages = Math.ceil(getFilteredData().length / PAGE_SIZE);
    if (p < 1 || p > totalPages) return;
    currentPage = p;
    applyFilters();
}

function getFilteredData() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const cls = document.getElementById('classFilter').value;
    const method = document.getElementById('methodFilter').value;
    let data = [...ACC_DATA.tuitions];
    if (currentTab !== 'all' && currentTab !== 'pending') data = data.filter(t => t.status === currentTab);
    if (search) data = data.filter(t => t.studentName.toLowerCase().includes(search) || t.id.toLowerCase().includes(search));
    if (cls) data = data.filter(t => t.classId === cls);
    if (method) data = data.filter(t => t.method === method);
    return data;
}

/* ---- Create/Edit Modal ---- */
function openCreateModal() {
    document.getElementById('tuitionModalTitle').innerHTML = '<i class="fas fa-plus"></i> Tạo phiếu thu mới';
    document.getElementById('tuitionId').value = '';
    document.getElementById('tuitionStudentId').value = '';
    document.getElementById('tuitionClassId').innerHTML = '<option value="">-- Chọn lớp --</option>';
    document.getElementById('tuitionAmount').value = '';
    const d = new Date(); d.setDate(d.getDate() + 10);
    document.getElementById('tuitionDueDate').value = d.toISOString().split('T')[0];
    document.getElementById('tuitionStatus').value = 'unpaid';
    document.getElementById('tuitionMethod').value = '';
    document.getElementById('tuitionPaid').value = '';
    document.getElementById('tuitionNote').value = '';
    document.getElementById('paidAmountGroup').style.display = 'none';
    document.getElementById('tuitionModal').classList.add('show');
}

function openEditModal(id) {
    const t = ACC_DATA.tuitions.find(x => x.id === id);
    if (!t) return;
    document.getElementById('tuitionModalTitle').innerHTML = '<i class="fas fa-edit"></i> Sửa phiếu thu';
    document.getElementById('tuitionId').value = t.id;
    document.getElementById('tuitionStudentId').value = t.studentId;

    // populate class dropdown
    onStudentChange(t.classId);

    const [dd, mm, yyyy] = t.dueDate.split('/');
    document.getElementById('tuitionDueDate').value = `${yyyy}-${mm}-${dd}`;
    document.getElementById('tuitionAmount').value = t.amount;
    document.getElementById('tuitionStatus').value = t.status;
    document.getElementById('tuitionMethod').value = t.method || '';
    document.getElementById('tuitionPaid').value = t.paid;
    document.getElementById('tuitionNote').value = t.note;
    document.getElementById('paidAmountGroup').style.display = (t.status === 'partial') ? 'block' : (t.status === 'paid' ? 'none' : 'none');
    document.getElementById('tuitionModal').classList.add('show');
}

function closeTuitionModal() {
    document.getElementById('tuitionModal').classList.remove('show');
}

function onStudentChange(preSelectClass) {
    const sid = document.getElementById('tuitionStudentId').value;
    const student = ACC_DATA.students.find(s => s.id === sid);
    const classSelect = document.getElementById('tuitionClassId');
    classSelect.innerHTML = '<option value="">-- Chọn lớp --</option>';
    if (student) {
        student.classes.forEach(cid => {
            const cls = ACC_DATA.classes.find(c => c.id === cid);
            if (cls) classSelect.innerHTML += `<option value="${cls.id}" ${preSelectClass===cls.id?'selected':''}>${cls.name}</option>`;
        });
    }
    autoFillAmount();
}

function autoFillAmount() {
    const cid = document.getElementById('tuitionClassId').value;
    const cls = ACC_DATA.classes.find(c => c.id === cid);
    if (cls) document.getElementById('tuitionAmount').value = cls.tuitionFee;
}

function saveTuition() {
    const sid   = document.getElementById('tuitionStudentId').value;
    const cid   = document.getElementById('tuitionClassId').value;
    const amount = parseFloat(document.getElementById('tuitionAmount').value);
    const dueRaw = document.getElementById('tuitionDueDate').value;
    const status = document.getElementById('tuitionStatus').value;
    const method = document.getElementById('tuitionMethod').value;
    const note   = document.getElementById('tuitionNote').value;
    const paid   = status === 'paid' ? amount : (status === 'partial' ? parseFloat(document.getElementById('tuitionPaid').value) || 0 : 0);

    if (!sid || !cid || !amount || !dueRaw) { showToast('error', 'Vui lòng điền đủ thông tin bắt buộc'); return; }

    const student = ACC_DATA.students.find(s => s.id === sid);
    const cls     = ACC_DATA.classes.find(c => c.id === cid);
    const [yyyy, mm, dd] = dueRaw.split('-');
    const dueDate = `${dd}/${mm}/${yyyy}`;

    const existingId = document.getElementById('tuitionId').value;
    if (existingId) {
        const t = ACC_DATA.tuitions.find(x => x.id === existingId);
        Object.assign(t, { studentId:sid, studentName:student.name, classId:cid, className:cls.name, course:cls.course, amount, paid, remaining:Math.max(0,amount-paid), dueDate, status, method, note });
        showToast('success', 'Đã cập nhật phiếu thu!');
    } else {
        const newId = 'TUI' + String(ACC_DATA.tuitions.length + 1).padStart(3, '0');
        ACC_DATA.tuitions.push({ id:newId, studentId:sid, studentName:student.name, classId:cid, className:cls.name, course:cls.course, amount, paid, remaining:Math.max(0,amount-paid), dueDate, paidDate: paid>=amount ? formatDate(new Date()) : '', status, method, note, createdBy:'KT', createdDate:formatDate(new Date()) });
        showToast('success', 'Đã tạo phiếu thu mới!');
    }

    closeTuitionModal();
    renderSummary();
    applyFilters();
}

function deleteTuition(id) {
    if (!confirm('Xóa phiếu thu ' + id + '?')) return;
    const idx = ACC_DATA.tuitions.findIndex(t => t.id === id);
    if (idx > -1) ACC_DATA.tuitions.splice(idx, 1);
    showToast('success', 'Đã xóa phiếu thu');
    renderSummary();
    applyFilters();
}

/* ---- View / Print Modal ---- */
function openViewModal(id) {
    currentViewTuitionId = id;
    const t = ACC_DATA.tuitions.find(x => x.id === id);
    if (!t) return;

    const history = ACC_DATA.payments.filter(p => p.tuitionId === id);
    const overdue = t.status !== 'paid' && isOverdue(t.dueDate);
    const badge = t.status === 'paid' ? 'badge-paid' : t.status === 'partial' ? 'badge-partial' : 'badge-unpaid';
    const label = t.status === 'paid' ? 'Đã đóng đủ' : t.status === 'partial' ? 'Đóng một phần' : 'Chưa đóng';

    document.getElementById('receiptViewBody').innerHTML = `
        <div class="receipt-view">
            <div class="receipt-title">
                <h2><i class="fas fa-receipt"></i> PHIẾU THU HỌC PHÍ</h2>
                <p>Trung tâm Anh ngữ – Mã phiếu: ${t.id}</p>
            </div>
            <div class="receipt-row"><span class="label">Học viên</span><span class="value">${t.studentName} (${t.studentId})</span></div>
            <div class="receipt-row"><span class="label">Lớp học</span><span class="value">${t.className}</span></div>
            <div class="receipt-row"><span class="label">Khóa học</span><span class="value">${t.course}</span></div>
            <div class="receipt-row"><span class="label">Ngày tạo</span><span class="value">${t.createdDate}</span></div>
            <div class="receipt-row"><span class="label">Hạn đóng</span><span class="value" style="color:${overdue?'var(--danger)':'inherit'}">${t.dueDate}${overdue?' ⚠ Quá hạn':''}</span></div>
            <div class="receipt-row total"><span class="label">Học phí</span><span>${fmt(t.amount)}</span></div>
            <div class="receipt-row"><span class="label">Đã đóng</span><span class="value" style="color:var(--success)">${fmt(t.paid)}</span></div>
            <div class="receipt-row"><span class="label">Còn lại</span><span class="value" style="color:${t.remaining>0?'var(--danger)':'var(--success)'}">${fmt(t.remaining)}</span></div>
            <div class="receipt-row"><span class="label">Trạng thái</span><span><span class="badge ${badge}">${label}</span></span></div>
            ${t.method ? `<div class="receipt-row"><span class="label">Hình thức</span><span class="value">${t.method}</span></div>` : ''}
            ${t.note ? `<div class="receipt-row"><span class="label">Ghi chú</span><span class="value">${t.note}</span></div>` : ''}
        </div>
        ${history.length ? `
        <div style="margin-top:1rem">
            <h4 style="font-size:.88rem;margin-bottom:.5rem"><i class="fas fa-history"></i> Lịch sử thanh toán</h4>
            <table style="font-size:.8rem;width:100%">
                <thead><tr><th>Ngày</th><th>Số tiền</th><th>Hình thức</th><th>NV xác nhận</th></tr></thead>
                <tbody>${history.map(h=>`<tr><td>${h.date}</td><td class="money-green">${fmt(h.amount)}</td><td>${h.method}</td><td>${h.confirmedBy}</td></tr>`).join('')}</tbody>
            </table>
        </div>` : ''}
    `;

    document.getElementById('viewModal').classList.add('show');
}

function closeViewModal() {
    document.getElementById('viewModal').classList.remove('show');
    currentViewTuitionId = null;
}

function printReceipt() {
    window.print();
}

/* ---- Pay Modal ---- */
function openPayModal(id) {
    currentPayTuitionId = id;
    const t = ACC_DATA.tuitions.find(x => x.id === id);
    if (!t) return;

    document.getElementById('payModalInfo').innerHTML = `
        <div class="alert-box alert-info">
            <i class="fas fa-info-circle"></i>
            <div>
                <strong>${t.studentName}</strong> – ${t.className}<br>
                Học phí: <strong>${fmt(t.amount)}</strong> &nbsp;|&nbsp;
                Đã đóng: <strong style="color:var(--success)">${fmt(t.paid)}</strong> &nbsp;|&nbsp;
                Còn nợ: <strong style="color:var(--danger)">${fmt(t.remaining)}</strong>
            </div>
        </div>`;
    document.getElementById('payAmountInput').value = t.remaining;
    document.getElementById('payNoteInput').value = '';
    document.getElementById('payModal').classList.add('show');
}

function closePayModal() {
    document.getElementById('payModal').classList.remove('show');
    currentPayTuitionId = null;
}

function confirmPayment() {
    const amtInput = parseFloat(document.getElementById('payAmountInput').value);
    const method = document.getElementById('payMethodInput').value;
    const note = document.getElementById('payNoteInput').value;

    if (!amtInput || amtInput <= 0) { showToast('error', 'Nhập số tiền hợp lệ'); return; }

    const t = ACC_DATA.tuitions.find(x => x.id === currentPayTuitionId);
    if (!t) return;

    const actual = Math.min(amtInput, t.remaining);
    t.paid += actual;
    t.remaining = Math.max(0, t.remaining - actual);
    t.method = method;
    t.status = t.remaining === 0 ? 'paid' : 'partial';
    if (t.remaining === 0) t.paidDate = formatDate(new Date());

    // Add payment record
    const payId = 'PAY' + String(ACC_DATA.payments.length + 1).padStart(3, '0');
    ACC_DATA.payments.push({ id:payId, tuitionId:t.id, studentId:t.studentId, studentName:t.studentName, amount:actual, date:formatDate(new Date()), method, confirmedBy:'KT', note });

    showToast('success', `Đã ghi nhận thanh toán ${fmt(actual)}`);
    closePayModal();
    renderSummary();
    applyFilters();
}

/* ---- Export ---- */
function exportAll() {
    let rows = 'Mã phiếu,Học viên,Lớp,Học phí,Đã đóng,Còn nợ,Hạn đóng,Trạng thái\n';
    ACC_DATA.tuitions.forEach(t => {
        const st = t.status === 'paid' ? 'Đã đóng' : t.status === 'partial' ? 'Đóng một phần' : 'Chưa đóng';
        rows += `${t.id},"${t.studentName}","${t.className}",${t.amount},${t.paid},${t.remaining},${t.dueDate},${st}\n`;
    });
    const blob = new Blob(['\uFEFF' + rows], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'hoc-phi.csv'; a.click();
    showToast('success', 'Đã xuất danh sách phiếu thu!');
}

/* ---- Helpers ---- */
function fmt(n) { return (n || 0).toLocaleString('vi-VN') + ' đ'; }

function formatDate(d) {
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

function isOverdue(dueDateStr) {
    if (!dueDateStr) return false;
    const [dd, mm, yyyy] = dueDateStr.split('/');
    return new Date(+yyyy, +mm - 1, +dd) < new Date(new Date().setHours(0,0,0,0));
}

function showToast(type, msg) {
    const icons = { success:'fas fa-check-circle', error:'fas fa-times-circle', info:'fas fa-info-circle', warning:'fas fa-exclamation-triangle' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="${icons[type]||icons.info}"></i><span>${msg}</span>`;
    document.getElementById('toastContainer').appendChild(el);
    setTimeout(() => el.remove(), 3500);
}
