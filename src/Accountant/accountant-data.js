/* ===== ACCOUNTANT MODULE – SHARED FAKE DATA ===== */

const ACC_DATA = {

    /* ---------- CLASSES ---------- */
    classes: [
        { id:'CLS001', name:'IELTS 6.5 – Sáng',   course:'IELTS Foundation',  tuitionFee: 4500000, enrolled:15 },
        { id:'CLS002', name:'TOEIC 650+ – Tối',    course:'TOEIC Cơ bản',      tuitionFee: 3200000, enrolled:7  },
        { id:'CLS003', name:'Giao tiếp Cơ bản',    course:'Giao tiếp mất gốc', tuitionFee: 2800000, enrolled:10 },
        { id:'CLS004', name:'IELTS 7.0 Intensive',  course:'IELTS Advanced',    tuitionFee: 6000000, enrolled:12 },
        { id:'CLS005', name:'TOEIC 450+ – Sáng',    course:'TOEIC Cơ bản',      tuitionFee: 3200000, enrolled:3  },
    ],

    /* ---------- STUDENTS ---------- */
    students: [
        { id:'ST001', name:'Nguyễn Thị An',   phone:'0901234567', email:'an.nguyen@email.com',   classes:['CLS001','CLS004'] },
        { id:'ST002', name:'Trần Văn Bình',    phone:'0912345678', email:'binh.tran@email.com',   classes:['CLS001'] },
        { id:'ST003', name:'Lê Thị Cúc',       phone:'0923456789', email:'cuc.le@email.com',       classes:['CLS002'] },
        { id:'ST004', name:'Phạm Minh Dũng',   phone:'0934567890', email:'dung.pham@email.com',   classes:['CLS004'] },
        { id:'ST005', name:'Hoàng Thu Hà',     phone:'0945678901', email:'ha.hoang@email.com',    classes:['CLS002','CLS003'] },
        { id:'ST006', name:'Vũ Quốc Hùng',     phone:'0956789012', email:'hung.vu@email.com',     classes:['CLS001'] },
        { id:'ST007', name:'Đặng Thị Lan',     phone:'0967890123', email:'lan.dang@email.com',    classes:['CLS003'] },
        { id:'ST008', name:'Bùi Văn Mạnh',     phone:'0978901234', email:'manh.bui@email.com',    classes:['CLS005'] },
    ],

    /* ---------- TUITION RECEIPTS (Phiếu thu) ---------- */
    tuitions: [
        { id:'TUI001', studentId:'ST001', studentName:'Nguyễn Thị An',
          classId:'CLS001', className:'IELTS 6.5 – Sáng', course:'IELTS Foundation',
          amount:4500000, paid:4500000, remaining:0, dueDate:'10/01/2026',
          paidDate:'08/01/2026', status:'paid', method:'Chuyển khoản', note:'', createdBy:'KT Hoa', createdDate:'01/01/2026' },
        { id:'TUI002', studentId:'ST001', studentName:'Nguyễn Thị An',
          classId:'CLS004', className:'IELTS 7.0 Intensive', course:'IELTS Advanced',
          amount:6000000, paid:3000000, remaining:3000000, dueDate:'10/02/2026',
          paidDate:'', status:'partial', method:'Tiền mặt', note:'Học viên đề nghị trả 2 lần', createdBy:'KT Hoa', createdDate:'01/02/2026' },
        { id:'TUI003', studentId:'ST002', studentName:'Trần Văn Bình',
          classId:'CLS001', className:'IELTS 6.5 – Sáng', course:'IELTS Foundation',
          amount:4500000, paid:0, remaining:4500000, dueDate:'05/02/2026',
          paidDate:'', status:'unpaid', method:'', note:'', createdBy:'KT Hoa', createdDate:'01/01/2026' },
        { id:'TUI004', studentId:'ST003', studentName:'Lê Thị Cúc',
          classId:'CLS002', className:'TOEIC 650+ – Tối', course:'TOEIC Cơ bản',
          amount:3200000, paid:3200000, remaining:0, dueDate:'15/01/2026',
          paidDate:'14/01/2026', status:'paid', method:'Chuyển khoản', note:'', createdBy:'KT Minh', createdDate:'05/01/2026' },
        { id:'TUI005', studentId:'ST004', studentName:'Phạm Minh Dũng',
          classId:'CLS004', className:'IELTS 7.0 Intensive', course:'IELTS Advanced',
          amount:6000000, paid:0, remaining:6000000, dueDate:'20/01/2026',
          paidDate:'', status:'unpaid', method:'', note:'Vắng liên lạc', createdBy:'KT Hoa', createdDate:'10/01/2026' },
        { id:'TUI006', studentId:'ST005', studentName:'Hoàng Thu Hà',
          classId:'CLS002', className:'TOEIC 650+ – Tối', course:'TOEIC Cơ bản',
          amount:3200000, paid:3200000, remaining:0, dueDate:'15/01/2026',
          paidDate:'15/01/2026', status:'paid', method:'Tiền mặt', note:'', createdBy:'KT Minh', createdDate:'05/01/2026' },
        { id:'TUI007', studentId:'ST005', studentName:'Hoàng Thu Hà',
          classId:'CLS003', className:'Giao tiếp Cơ bản', course:'Giao tiếp mất gốc',
          amount:2800000, paid:1400000, remaining:1400000, dueDate:'01/03/2026',
          paidDate:'', status:'partial', method:'Tiền mặt', note:'Trả đợt 1', createdBy:'KT Minh', createdDate:'20/02/2026' },
        { id:'TUI008', studentId:'ST006', studentName:'Vũ Quốc Hùng',
          classId:'CLS001', className:'IELTS 6.5 – Sáng', course:'IELTS Foundation',
          amount:4500000, paid:0, remaining:4500000, dueDate:'10/12/2025',
          paidDate:'', status:'unpaid', method:'', note:'Đã thôi học – cần xử lý', createdBy:'KT Hoa', createdDate:'01/12/2025' },
        { id:'TUI009', studentId:'ST007', studentName:'Đặng Thị Lan',
          classId:'CLS003', className:'Giao tiếp Cơ bản', course:'Giao tiếp mất gốc',
          amount:2800000, paid:2800000, remaining:0, dueDate:'28/02/2026',
          paidDate:'26/02/2026', status:'paid', method:'Chuyển khoản', note:'', createdBy:'KT Minh', createdDate:'20/02/2026' },
        { id:'TUI010', studentId:'ST008', studentName:'Bùi Văn Mạnh',
          classId:'CLS005', className:'TOEIC 450+ – Sáng', course:'TOEIC Cơ bản',
          amount:3200000, paid:0, remaining:3200000, dueDate:'15/03/2026',
          paidDate:'', status:'unpaid', method:'', note:'', createdBy:'KT Hoa', createdDate:'01/03/2026' },
    ],

    /* ---------- PENDING RECEIPTS (Phiếu thu chờ xác nhận) ---------- */
    pendingReceipts: [
        { id:'PR001', studentId:'ST001', studentName:'Nguyễn Thị An',
          classId:'CLS004', className:'IELTS 7.0 Intensive',
          amount:3000000, method:'Chuyển khoản', submittedDate:'27/02/2026',
          proof:'TRANSFER_001.jpg', status:'pending' },
        { id:'PR002', studentId:'ST008', studentName:'Bùi Văn Mạnh',
          classId:'CLS005', className:'TOEIC 450+ – Sáng',
          amount:3200000, method:'Tiền mặt', submittedDate:'28/02/2026',
          proof:'', status:'pending' },
    ],

    /* ---------- PAYMENT HISTORY ---------- */
    payments: [
        { id:'PAY001', tuitionId:'TUI001', studentId:'ST001', studentName:'Nguyễn Thị An',
          amount:4500000, date:'08/01/2026', method:'Chuyển khoản', confirmedBy:'KT Hoa', note:'Thanh toán đầy đủ' },
        { id:'PAY002', tuitionId:'TUI002', studentId:'ST001', studentName:'Nguyễn Thị An',
          amount:3000000, date:'01/02/2026', method:'Tiền mặt', confirmedBy:'KT Hoa', note:'Đợt 1' },
        { id:'PAY003', tuitionId:'TUI004', studentId:'ST003', studentName:'Lê Thị Cúc',
          amount:3200000, date:'14/01/2026', method:'Chuyển khoản', confirmedBy:'KT Minh', note:'' },
        { id:'PAY004', tuitionId:'TUI006', studentId:'ST005', studentName:'Hoàng Thu Hà',
          amount:3200000, date:'15/01/2026', method:'Tiền mặt', confirmedBy:'KT Minh', note:'' },
        { id:'PAY005', tuitionId:'TUI007', studentId:'ST005', studentName:'Hoàng Thu Hà',
          amount:1400000, date:'20/02/2026', method:'Tiền mặt', confirmedBy:'KT Minh', note:'Đợt 1' },
        { id:'PAY006', tuitionId:'TUI009', studentId:'ST007', studentName:'Đặng Thị Lan',
          amount:2800000, date:'26/02/2026', method:'Chuyển khoản', confirmedBy:'KT Minh', note:'' },
    ],

    /* ---------- MONTHLY REVENUE ---------- */
    monthlyRevenue: [
        { month: 9,  year:2025, revenue:28500000 },
        { month:10,  year:2025, revenue:31200000 },
        { month:11,  year:2025, revenue:29800000 },
        { month:12,  year:2025, revenue:35600000 },
        { month: 1,  year:2026, revenue:42100000 },
        { month: 2,  year:2026, revenue:18400000 },
    ],

    /* ---------- CLASS REVENUE ---------- */
    classRevenue: [
        { classId:'CLS001', className:'IELTS 6.5 – Sáng',   totalBilled:67500000, totalPaid:63000000 },
        { classId:'CLS002', className:'TOEIC 650+ – Tối',    totalBilled:22400000, totalPaid:22400000 },
        { classId:'CLS003', className:'Giao tiếp Cơ bản',    totalBilled:28000000, totalPaid:25200000 },
        { classId:'CLS004', className:'IELTS 7.0 Intensive',  totalBilled:72000000, totalPaid:63000000 },
        { classId:'CLS005', name:'TOEIC 450+ – Sáng',        totalBilled: 9600000, totalPaid:0        },
    ],
};
