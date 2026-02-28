/* ===== STAFF MODULE – SHARED FAKE DATA ===== */

const STAFF_DATA = {

    /* ---------- CLASSES ---------- */
    classes: [
        { id:'CLS001', code:'CLS001', name:'IELTS 6.5 – Sáng', course:'IELTS Foundation',
          teacher:'Nguyễn Văn A', teacherId:'T01', room:'Phòng 101',
          schedule:'T2-T4-T6', time:'08:00-10:00', startDate:'05/01/2026', endDate:'30/04/2026',
          enrolled:15, capacity:20, totalSessions:36, doneSessions:12,
          status:'ongoing', missingTeacher:false },
        { id:'CLS002', code:'CLS002', name:'TOEIC 650+ – Tối', course:'TOEIC Cơ bản',
          teacher:'Trần Thị B', teacherId:'T02', room:'Phòng 202',
          schedule:'T3-T5-T7', time:'18:00-20:00', startDate:'10/01/2026', endDate:'10/04/2026',
          enrolled:7, capacity:20, totalSessions:30, doneSessions:8,
          status:'recruiting', missingTeacher:false },
        { id:'CLS003', code:'CLS003', name:'Giao tiếp Cơ bản', course:'Giao tiếp mất gốc',
          teacher:'', teacherId:'', room:'Phòng 103',
          schedule:'T7-CN', time:'09:00-11:00', startDate:'20/02/2026', endDate:'20/04/2026',
          enrolled:10, capacity:15, totalSessions:24, doneSessions:0,
          status:'recruiting', missingTeacher:true },
        { id:'CLS004', code:'CLS004', name:'IELTS 7.0 Intensive', course:'IELTS Advanced',
          teacher:'Phạm Thị D', teacherId:'T04', room:'Phòng 301',
          schedule:'T2-T3-T4-T5-T6', time:'14:00-16:00', startDate:'02/02/2026', endDate:'30/03/2026',
          enrolled:12, capacity:12, totalSessions:40, doneSessions:20,
          status:'ongoing', missingTeacher:false },
        { id:'CLS005', code:'CLS005', name:'TOEIC 450+ – Sáng', course:'TOEIC Cơ bản',
          teacher:'Lê Văn E', teacherId:'T05', room:'Phòng 201',
          schedule:'T2-T4-T6', time:'10:00-12:00', startDate:'01/03/2026', endDate:'01/06/2026',
          enrolled:3, capacity:20, totalSessions:30, doneSessions:0,
          status:'recruiting', missingTeacher:false },
    ],

    /* ---------- TODAY SESSIONS ---------- */
    todaySessions: [
        { classId:'CLS001', className:'IELTS 6.5 – Sáng', teacher:'Nguyễn Văn A',
          room:'Phòng 101', time:'08:00-10:00', session:13, enrolled:15, attended:null },
        { classId:'CLS004', className:'IELTS 7.0 Intensive', teacher:'Phạm Thị D',
          room:'Phòng 301', time:'14:00-16:00', session:21, enrolled:12, attended:11 },
    ],

    /* ---------- ROOMS ---------- */
    rooms: [
        { id:'R101', name:'Phòng 101', floor:1, capacity:25, equipment:'Máy chiếu, bảng thông minh', status:'available' },
        { id:'R102', name:'Phòng 102', floor:1, capacity:20, equipment:'Máy chiếu, điều hòa', status:'busy' },
        { id:'R103', name:'Phòng 103', floor:1, capacity:15, equipment:'Bảng trắng, điều hòa', status:'available' },
        { id:'R201', name:'Phòng 201', floor:2, capacity:25, equipment:'Máy chiếu, bảng thông minh', status:'available' },
        { id:'R202', name:'Phòng 202', floor:2, capacity:20, equipment:'Máy chiếu, loa', status:'available' },
        { id:'R301', name:'Phòng 301', floor:3, capacity:30, equipment:'Bảng thông minh, hệ thống âm thanh', status:'busy' },
    ],

    /* ---------- STUDENTS ---------- */
    students: [
        { id:'ST001', name:'Nguyễn Thị An', phone:'0901234567', email:'an.nguyen@email.com',
          dob:'01/01/2000', classes:['CLS001','CLS004'], status:'active', note:'' },
        { id:'ST002', name:'Trần Văn Bình', phone:'0912345678', email:'binh.tran@email.com',
          dob:'15/03/1999', classes:['CLS001'], status:'active', note:'' },
        { id:'ST003', name:'Lê Thị Cúc', phone:'0923456789', email:'cuc.le@email.com',
          dob:'20/07/2001', classes:['CLS002'], status:'reserved', note:'Bảo lưu đến 01/05/2026' },
        { id:'ST004', name:'Phạm Minh Dũng', phone:'0934567890', email:'dung.pham@email.com',
          dob:'05/11/2000', classes:['CLS004'], status:'active', note:'' },
        { id:'ST005', name:'Hoàng Thu Hà', phone:'0945678901', email:'ha.hoang@email.com',
          dob:'12/08/2002', classes:['CLS002','CLS003'], status:'active', note:'' },
        { id:'ST006', name:'Vũ Quốc Hùng', phone:'0956789012', email:'hung.vu@email.com',
          dob:'30/04/1998', classes:['CLS001'], status:'quit', note:'Thôi học từ 15/02/2026' },
    ],

    /* ---------- PENDING REQUESTS ---------- */
    requests: [
        { id:'REQ001', type:'transfer', studentId:'ST001', studentName:'Nguyễn Thị An',
          from:'CLS001', to:'CLS002', reason:'Đổi ca công việc', date:'25/02/2026', status:'pending' },
        { id:'REQ002', type:'reserve', studentId:'ST003', studentName:'Lê Thị Cúc',
          from:'CLS002', to:'', reason:'Ốm dài ngày', date:'20/02/2026', status:'pending' },
        { id:'REQ003', type:'absence', studentId:'ST004', studentName:'Phạm Minh Dũng',
          from:'CLS004', to:'', reason:'Đi công tác', date:'26/02/2026', status:'pending' },
        { id:'REQ004', type:'makeup', studentId:'ST002', studentName:'Trần Văn Bình',
          from:'CLS001', to:'', reason:'Nghỉ buổi 12', date:'27/02/2026', status:'pending' },
    ],

    /* ---------- ATTENDANCE SESSIONS ---------- */
    attendanceSessions: [
        { id:'ATT001', classId:'CLS001', className:'IELTS 6.5 – Sáng', sessionNo:12,
          date:'24/02/2026', time:'08:00-10:00', teacher:'Nguyễn Văn A',
          present:14, absent:1, late:0, total:15, createdBy:'GV' },
        { id:'ATT002', classId:'CLS004', className:'IELTS 7.0 Intensive', sessionNo:20,
          date:'24/02/2026', time:'14:00-16:00', teacher:'Phạm Thị D',
          present:10, absent:1, late:1, total:12, createdBy:'GV' },
        { id:'ATT003', classId:'CLS001', className:'IELTS 6.5 – Sáng', sessionNo:11,
          date:'22/02/2026', time:'08:00-10:00', teacher:'Nguyễn Văn A',
          present:13, absent:2, late:0, total:15, createdBy:'Giáo vụ' },
        { id:'ATT004', classId:'CLS002', className:'TOEIC 650+ – Tối', sessionNo:8,
          date:'21/02/2026', time:'18:00-20:00', teacher:'Trần Thị B',
          present:6, absent:1, late:0, total:7, createdBy:'GV' },
    ],

    /* ---------- ATTENDANCE DETAILS per SESSION ---------- */
    attendanceDetails: {
        'ATT001': [
            { studentId:'ST001', name:'Nguyễn Thị An',  status:'present', note:'' },
            { studentId:'ST002', name:'Trần Văn Bình',  status:'absent',  note:'Nghỉ không phép' },
            { studentId:'ST004', name:'Phạm Minh Dũng', status:'present', note:'' },
        ],
        'ATT002': [
            { studentId:'ST001', name:'Nguyễn Thị An',  status:'late',    note:'Trễ 15 phút' },
            { studentId:'ST004', name:'Phạm Minh Dũng', status:'present', note:'' },
            { studentId:'ST005', name:'Hoàng Thu Hà',   status:'absent',  note:'Nghỉ có phép' },
        ]
    },

    /* ---------- NOTIFICATIONS ---------- */
    notifications: [
        { id:'NTF001', title:'Hoãn buổi học thứ 6 (28/02)', type:'schedule', target:'class',
          targetId:'CLS001', targetName:'IELTS 6.5 – Sáng', sender:'Giáo vụ Minh',
          date:'27/02/2026', status:'sent', readRate:80 },
        { id:'NTF002', title:'Lịch kiểm tra giữa kỳ', type:'exam', target:'class',
          targetId:'CLS004', targetName:'IELTS 7.0 Intensive', sender:'Giáo vụ Minh',
          date:'26/02/2026', status:'sent', readRate:100 },
        { id:'NTF003', title:'Nhắc học phí tháng 3', type:'tuition', target:'multi',
          targetId:'', targetName:'Nhiều học viên', sender:'Giáo vụ Hoa',
          date:'25/02/2026', status:'pending', readRate:0 },
    ],

    /* ---------- TEACHERS ---------- */
    teachers: [
        { id:'T01', name:'Nguyễn Văn A', phone:'0900000001', subject:'IELTS' },
        { id:'T02', name:'Trần Thị B',   phone:'0900000002', subject:'TOEIC' },
        { id:'T03', name:'Lê Văn C',     phone:'0900000003', subject:'Giao tiếp' },
        { id:'T04', name:'Phạm Thị D',   phone:'0900000004', subject:'IELTS' },
        { id:'T05', name:'Lê Văn E',     phone:'0900000005', subject:'TOEIC' },
    ],

    /* ---------- WEEK SCHEDULE (sample slots) ---------- */
    weekSlots: [
        { day:1, className:'IELTS 6.5', room:'P101', time:'08:00', classId:'CLS001' },
        { day:3, className:'IELTS 6.5', room:'P101', time:'08:00', classId:'CLS001' },
        { day:5, className:'IELTS 6.5', room:'P101', time:'08:00', classId:'CLS001' },
        { day:2, className:'TOEIC 650+', room:'P202', time:'18:00', classId:'CLS002' },
        { day:4, className:'TOEIC 650+', room:'P202', time:'18:00', classId:'CLS002' },
        { day:6, className:'TOEIC 650+', room:'P202', time:'18:00', classId:'CLS002' },
        { day:1, className:'IELTS Intensive', room:'P301', time:'14:00', classId:'CLS004' },
        { day:2, className:'IELTS Intensive', room:'P301', time:'14:00', classId:'CLS004' },
        { day:3, className:'IELTS Intensive', room:'P301', time:'14:00', classId:'CLS004' },
        { day:4, className:'IELTS Intensive', room:'P301', time:'14:00', classId:'CLS004' },
        { day:5, className:'IELTS Intensive', room:'P301', time:'14:00', classId:'CLS004' },
        { day:0, className:'Giao tiếp CB', room:'P103', time:'09:00', classId:'CLS003' },
        { day:6, className:'Giao tiếp CB', room:'P103', time:'09:00', classId:'CLS003' },
    ]
};
