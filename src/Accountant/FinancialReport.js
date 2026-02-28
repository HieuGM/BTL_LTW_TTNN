// ===== FINANCIAL REPORT – Nhân viên Kế toán =====

let currentPeriod = 'month';
let currentTab = 'revenue';
let filteredRevData = [];

document.addEventListener('DOMContentLoaded', () => {
    initDateInputs();
    setPeriod('month', document.querySelector('.period-btn.active'));
});

/* ---- Init date inputs ---- */
function initDateInputs() {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    document.getElementById('fromMonth').value = ym;
    document.getElementById('toMonth').value   = ym;
}

/* ---- Period ---- */
function setPeriod(period, btn) {
    currentPeriod = period;
    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const allData = ACC_DATA.monthlyRevenue;
    const now = new Date();
    let data;

    if (period === 'month') {
        data = allData.filter(d => d.month === now.getMonth()+1 && d.year === now.getFullYear());
    } else if (period === 'last3') {
        data = getLast(allData, 3);
    } else if (period === 'last6') {
        data = getLast(allData, 6);
    } else if (period === 'year') {
        data = allData.filter(d => d.year === now.getFullYear());
    } else {
        data = allData;
    }

    filteredRevData = data;
    renderAll();
}

function applyCustomPeriod() {
    const from = document.getElementById('fromMonth').value;
    const to   = document.getElementById('toMonth').value;
    if (!from || !to) { showToast('error', 'Vui lòng chọn khoảng thời gian'); return; }

    const [fy, fm] = from.split('-').map(Number);
    const [ty, tm] = to.split('-').map(Number);

    filteredRevData = ACC_DATA.monthlyRevenue.filter(d => {
        const inFrom = d.year > fy || (d.year === fy && d.month >= fm);
        const inTo   = d.year < ty || (d.year === ty && d.month <= tm);
        return inFrom && inTo;
    });

    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    currentPeriod = 'custom';
    renderAll();
}

function getLast(data, n) {
    return [...data].slice(-n);
}

/* ---- Render all ---- */
function renderAll() {
    renderKPI();
    renderRevenueChart();
    renderRevenueTable();
    renderClassRevenue();
    renderDebtTab();
    renderPayHistory();
}

/* ---- Tab switch ---- */
function switchTab(tab, btn) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
}

/* ---- KPI Cards ---- */
function renderKPI() {
    const totalRevenue = filteredRevData.reduce((s, d) => s + d.revenue, 0);

    const allMonths = ACC_DATA.monthlyRevenue;
    const prevMonths = allMonths.slice(-2);
    const change = prevMonths.length >= 2
        ? ((prevMonths[1].revenue - prevMonths[0].revenue) / prevMonths[0].revenue * 100).toFixed(1)
        : null;

    const totalBilled = ACC_DATA.tuitions.reduce((s, t) => s + t.amount, 0);
    const totalPaid   = ACC_DATA.tuitions.reduce((s, t) => s + t.paid, 0);
    const collectRate = totalBilled > 0 ? Math.round(totalPaid / totalBilled * 100) : 0;
    const totalDebt   = ACC_DATA.tuitions.filter(t => t.status !== 'paid').reduce((s, t) => s + t.remaining, 0);

    const kpis = [
        { label:'Doanh thu kỳ này', value: fmt(totalRevenue), color:'var(--primary-color)',
          change: change !== null ? `${change > 0 ? '▲' : '▼'} ${Math.abs(change)}% so tháng trước` : '', changeClass: change > 0 ? 'up' : 'down' },
        { label:'Tổng học phí tạo phiếu', value: fmt(totalBilled), color:'var(--info)', change:'', changeClass:'' },
        { label:'Tỷ lệ thu tiền', value: collectRate + '%', color: collectRate >= 80 ? 'var(--success)' : 'var(--warning)',
          change:`Đã thu ${fmt(totalPaid)}`, changeClass: collectRate >= 80 ? 'up' : 'down' },
        { label:'Tổng công nợ còn lại', value: fmt(totalDebt), color:'var(--danger)',
          change:`${ACC_DATA.tuitions.filter(t=>t.status!=='paid').length} phiếu chưa hoàn tất`, changeClass:'down' },
    ];

    document.getElementById('kpiGrid').innerHTML = kpis.map(k => `
        <div class="kpi-card">
            <div class="kpi-val" style="color:${k.color}">${k.value}</div>
            <div class="kpi-label">${k.label}</div>
            ${k.change ? `<div class="kpi-change ${k.changeClass}">${k.change}</div>` : ''}
        </div>
    `).join('');
}

/* ---- Revenue Chart ---- */
function renderRevenueChart() {
    const data = filteredRevData;
    const max = Math.max(...data.map(d => d.revenue), 1);

    document.getElementById('chartSubtitle').textContent = `Hiển thị ${data.length} kỳ | Tổng: ${fmt(data.reduce((s,d)=>s+d.revenue,0))}`;

    if (!data.length) {
        document.getElementById('revenueChart').innerHTML = `<div class="empty-state" style="width:100%"><i class="fas fa-chart-bar"></i><p>Không có dữ liệu</p></div>`;
        return;
    }

    document.getElementById('revenueChart').innerHTML = data.map(d => {
        const pct = Math.round((d.revenue / max) * 100);
        return `<div class="bar-group">
            <div class="bar-full" style="height:${Math.max(pct, 5)}%">
                <span class="bar-full-val">${fmtShort(d.revenue)}</span>
            </div>
            <span class="bar-full-label">T${d.month}/${d.year}</span>
        </div>`;
    }).join('');
}

/* ---- Revenue Table ---- */
function renderRevenueTable() {
    const data = filteredRevData;
    const tbody = document.getElementById('revenueTableBody');

    if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:1.5rem;color:var(--text-secondary)">Không có dữ liệu</td></tr>`;
        return;
    }

    let cumulative = 0;
    tbody.innerHTML = data.map((d, i) => {
        cumulative += d.revenue;
        const prev = i > 0 ? data[i-1].revenue : null;
        const diff = prev !== null ? d.revenue - prev : null;
        const diffClass = diff === null ? '' : diff >= 0 ? 'money-green' : 'money-red';
        const diffSign  = diff === null ? '—' : (diff >= 0 ? '+' : '') + fmt(diff);
        return `<tr>
            <td><strong>Tháng ${d.month}/${d.year}</strong></td>
            <td class="money">${fmt(d.revenue)}</td>
            <td class="${diffClass}">${diffSign}</td>
            <td style="color:var(--text-secondary)">${fmt(cumulative)}</td>
        </tr>`;
    }).join('');

    // Totals row
    const total = data.reduce((s, d) => s + d.revenue, 0);
    tbody.innerHTML += `<tr style="background:#f8f5ff;font-weight:700">
        <td>Tổng cộng</td>
        <td class="money">${fmt(total)}</td>
        <td>—</td>
        <td class="money">${fmt(total)}</td>
    </tr>`;
}

/* ---- Class Revenue ---- */
function renderClassRevenue() {
    const data = ACC_DATA.classRevenue;
    const totalPaid = data.reduce((s, c) => s + c.totalPaid, 0);

    // Table
    document.getElementById('classRevenueBody').innerHTML = data.map(cr => {
        const pct = cr.totalBilled > 0 ? Math.round(cr.totalPaid / cr.totalBilled * 100) : 0;
        const fillClass = pct >= 90 ? 'success' : pct >= 60 ? 'warning' : 'danger';
        const cls = ACC_DATA.classes.find(c => c.id === cr.classId);
        return `<tr>
            <td><strong>${cr.className}</strong></td>
            <td>${cls ? cls.course : '—'}</td>
            <td>${fmt(cr.totalBilled)}</td>
            <td class="money-green">${fmt(cr.totalPaid)}</td>
            <td class="${cr.totalBilled - cr.totalPaid > 0 ? 'money-red' : 'money-green'}">${fmt(cr.totalBilled - cr.totalPaid)}</td>
            <td>
                <div style="display:flex;align-items:center;gap:.5rem">
                    <div class="progress-bar-wrap" style="flex:1">
                        <div class="progress-bar-fill ${fillClass}" style="width:${pct}%"></div>
                    </div>
                    <span style="font-size:.78rem;font-weight:600;min-width:32px">${pct}%</span>
                </div>
            </td>
        </tr>`;
    }).join('');

    // Pie-style (CSS bars as horizontal proportional)
    const pieEl = document.getElementById('classPieChart');
    pieEl.innerHTML = data.map(cr => {
        const pct = totalPaid > 0 ? Math.round(cr.totalPaid / totalPaid * 100) : 0;
        const colors = ['#7c3aed','#3b82f6','#22c55e','#f59e0b','#ef4444'];
        const idx    = data.indexOf(cr);
        return `<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.6rem">
            <div style="width:12px;height:12px;border-radius:3px;background:${colors[idx%5]};flex-shrink:0"></div>
            <span style="font-size:.78rem;flex:1;color:var(--text-secondary)">${cr.className}</span>
            <span style="font-size:.82rem;font-weight:700;color:${colors[idx%5]}">${pct}%</span>
        </div>`;
    }).join('');

    // Progress list
    document.getElementById('classProgressList').innerHTML = data.map(cr => {
        const pct = cr.totalBilled > 0 ? Math.round(cr.totalPaid / cr.totalBilled * 100) : 0;
        const fillClass = pct >= 90 ? 'success' : pct >= 60 ? 'warning' : 'danger';
        return `<div style="margin-bottom:.9rem">
            <div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:3px">
                <span style="font-weight:600">${cr.className}</span>
                <span>${fmt(cr.totalPaid)} / ${fmt(cr.totalBilled)}</span>
            </div>
            <div class="progress-bar-wrap">
                <div class="progress-bar-fill ${fillClass}" style="width:${pct}%"></div>
            </div>
        </div>`;
    }).join('');
}

/* ---- Debt Tab ---- */
function renderDebtTab() {
    const debts     = ACC_DATA.tuitions.filter(t => t.status !== 'paid');
    const overdue   = debts.filter(t => isOverdue(t.dueDate));
    const totalDebt = debts.reduce((s, t) => s + t.remaining, 0);
    const totalOver = overdue.reduce((s, t) => s + t.remaining, 0);

    document.getElementById('debtSummary').innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1rem">
            <div class="kpi-card">
                <div class="kpi-val" style="color:var(--danger)">${fmt(totalDebt)}</div>
                <div class="kpi-label">Tổng công nợ</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-val" style="color:#dc2626">${fmt(totalOver)}</div>
                <div class="kpi-label">Công nợ quá hạn</div>
                <div class="kpi-change down">${overdue.length} phiếu</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-val" style="color:var(--warning)">${fmt(totalDebt - totalOver)}</div>
                <div class="kpi-label">Công nợ trong hạn</div>
                <div class="kpi-change">${debts.length - overdue.length} phiếu</div>
            </div>
        </div>
    `;

    const tbody = document.getElementById('overdueBody');
    if (!overdue.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:1.5rem;color:var(--text-secondary)"><i class="fas fa-check-circle" style="color:var(--success)"></i> Không có phiếu quá hạn</td></tr>`;
        return;
    }

    tbody.innerHTML = overdue.sort((a,b) => b.remaining - a.remaining).map(t => {
        const days = Math.abs(Math.round((parseDueDate(t.dueDate) - new Date(new Date().setHours(0,0,0,0))) / 86400000));
        return `<tr>
            <td><strong>${t.studentName}</strong></td>
            <td>${t.className}</td>
            <td class="money-red">${fmt(t.remaining)}</td>
            <td style="color:var(--danger)">${t.dueDate}</td>
            <td><span class="badge badge-overdue">${days} ngày</span></td>
        </tr>`;
    }).join('');
}

/* ---- Payment History ---- */
function renderPayHistory() {
    const search = (document.getElementById('paySearch')?.value || '').toLowerCase();
    const method = document.getElementById('payMethodFilter')?.value || '';

    let data = [...ACC_DATA.payments];
    if (search) data = data.filter(p => p.studentName.toLowerCase().includes(search));
    if (method) data = data.filter(p => p.method === method);

    data.sort((a, b) => {
        const da = parseDMY(a.date), db = parseDMY(b.date);
        return db - da;
    });

    const total = data.reduce((s, p) => s + p.amount, 0);
    document.getElementById('payHistoryTotal').textContent = `Tổng thu: ${fmt(total)}`;

    const tbody = document.getElementById('payHistoryBody');
    if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:1.5rem;color:var(--text-secondary)">Không có lịch sử</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(p => `
        <tr>
            <td><code style="font-size:.78rem;color:var(--primary-color)">${p.id}</code></td>
            <td><strong>${p.studentName}</strong></td>
            <td class="money-green">${fmt(p.amount)}</td>
            <td>${p.date}</td>
            <td><span class="badge badge-info">${p.method}</span></td>
            <td>${p.confirmedBy}</td>
            <td style="color:var(--text-secondary);font-size:.8rem">${p.note || '—'}</td>
        </tr>
    `).join('');
}

/* ---- Export CSV ---- */
function exportCSV() {
    let rows = 'Tháng,Năm,Doanh thu\n';
    filteredRevData.forEach(d => { rows += `${d.month},${d.year},${d.revenue}\n`; });

    rows += '\n--- Theo lớp ---\n';
    rows += 'Lớp,Tổng học phí,Đã thu,Chưa thu,Tỷ lệ\n';
    ACC_DATA.classRevenue.forEach(cr => {
        const pct = cr.totalBilled > 0 ? Math.round(cr.totalPaid / cr.totalBilled * 100) : 0;
        rows += `"${cr.className}",${cr.totalBilled},${cr.totalPaid},${cr.totalBilled - cr.totalPaid},${pct}%\n`;
    });

    rows += '\n--- Công nợ ---\n';
    rows += 'Học viên,Lớp,Còn nợ,Hạn đóng,Quá hạn\n';
    ACC_DATA.tuitions.filter(t => t.status !== 'paid').forEach(t => {
        rows += `"${t.studentName}","${t.className}",${t.remaining},${t.dueDate},${isOverdue(t.dueDate)?'Quá hạn':'Còn hạn'}\n`;
    });

    const blob = new Blob(['\uFEFF' + rows], { type:'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'bao-cao-tai-chinh.csv'; a.click();
    showToast('success', 'Đã xuất báo cáo tài chính!');
}

/* ---- Helpers ---- */
function fmt(n) { return (n || 0).toLocaleString('vi-VN') + ' đ'; }

function fmtShort(n) {
    if (n >= 1e9) return (n/1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n/1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n/1e3).toFixed(0) + 'K';
    return n;
}

function parseDueDate(str) {
    const [dd, mm, yyyy] = str.split('/');
    return new Date(+yyyy, +mm - 1, +dd);
}

function parseDMY(str) {
    const [dd, mm, yyyy] = str.split('/');
    return new Date(+yyyy, +mm - 1, +dd);
}

function isOverdue(str) {
    if (!str) return false;
    return parseDueDate(str) < new Date(new Date().setHours(0,0,0,0));
}

function showToast(type, msg) {
    const icons = { success:'fas fa-check-circle', error:'fas fa-times-circle', info:'fas fa-info-circle', warning:'fas fa-exclamation-triangle' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="${icons[type]||icons.info}"></i><span>${msg}</span>`;
    document.getElementById('toastContainer').appendChild(el);
    setTimeout(() => el.remove(), 3500);
}
