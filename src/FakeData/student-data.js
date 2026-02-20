

const student = {
    id: "ST001",
    name: "Nguyễn Văn A",

    tuition: {
        total: 10000000,
        paid: 7000000,
        dueDate: "30/03/2026",

        payments: [
            {
                id: "P1",
                date: "01/01/2026",
                amount: 5000000,
                method: "Chuyển khoản",
                note: "Đợt 1"
            },
            {
                id: "P2",
                date: "01/02/2026",
                amount: 2000000,
                method: "Chuyển khoản",
                note: "Đợt 2"
            }
        ]
    },

    classes: [
        {
            id: "class-1",
            code: "CT01",
            name: "IELTS 5.0 → 6.5",
            teacher: "GV Trần Hoàng Nam",
            totalLessons: 24,
            completedLessons: 12,
            nextSession: "16:00 24/02",

            sessions: [
                {
                    id: "S1",
                    date: "13/01/2026",
                    time: "18:00 - 20:00",
                    room: "Phòng 203",
                    mode: "Offline",
                    attendance: "Chưa điểm danh"
                },
                {
                    id: "S2",
                    date: "20/01/2026",
                    time: "18:00 - 20:00",
                    room: "Phòng 203",
                    mode: "Offline",
                    attendance: "Có mặt"
                }
            ],
            // ===== KẾT QUẢ =====
            results: {
                tests: [
                    {
                        id: "T1",
                        name: "Mini Test 1",
                        date: "10/01/2026",
                        score: 6.0,
                        maxScore: 9,
                        teacherComment: "Cần cải thiện phần Writing Task 2."
                    },
                    {
                        id: "T2",
                        name: "Mid-term Test",
                        date: "15/02/2026",
                        score: 6.5,
                        maxScore: 9,
                        teacherComment: "Tiến bộ rõ rệt, đặc biệt là Listening."
                    }
                ],

                progressReports: [
                    {
                        stage: "Giai đoạn 1",
                        description: "Hoàn thành kỹ năng cơ bản",
                        evaluation: "Đạt yêu cầu"
                    },
                    {
                        stage: "Giai đoạn 2",
                        description: "Luyện đề nâng cao",
                        evaluation: "Đang tiến triển tốt"
                    }
                ]
            }

        },

        {
            id: "class-2",
            code: "CT02",
            name: "TOEIC 450 → 750",
            teacher: "GV Lê Minh Anh",
            totalLessons: 20,
            completedLessons: 5,
            nextSession: "18:00 25/02",

            sessions: [
                {
                    id: "S1",
                    date: "15/01/2026",
                    time: "18:00 - 20:00",
                    room: "Phòng 105",
                    mode: "Offline",
                    attendance: "Có mặt"
                }
            ]
        }
    ],
    profile: {
        email: "nguyenvana@gmail.com",
        phone: "0901234567",
        birthday: "01/01/2005",
        address: "Hà Nội",
        role: "Học viên"
    }
};