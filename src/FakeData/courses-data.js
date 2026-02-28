const courses = [
    {
        id: "ielts-foundation-5-0",
        slug: "ielts-foundation-5-0",
        title: "IELTS Foundation 3.5 → 5.0",

        category: "ielts",            // ielts | toeic | giaotiep
        level: "beginner",            // beginner | intermediate | advanced
        ageGroup: "student",          // kid | student | working

        description:
            "Khóa học dành cho học viên mất gốc hoặc band 3.5, xây dựng nền tảng toàn diện 4 kỹ năng IELTS.",

        goal: "Đạt IELTS 5.0",
        roadmap: [
            "Pronunciation cơ bản",
            "Ngữ pháp nền tảng",
            "Listening Part 1–2",
            "Writing Task 1 cơ bản"
        ],

        durationWeeks: 10,
        totalLessons: 30,

        fee: 4500000,
        currency: "VND",

        startDate: "2026-07-10",
        seatsAvailable: 25,

        teacher: {
            name: "Nguyễn Minh Anh",
            certificate: "IELTS 8.0",
            experienceYears: 5
        },

        rating: 4.7,
        enrollmentCount: 120,

        status: "open",               // open | closed | upcoming
        isPopular: true,

        createdAt: "2026-05-01T10:00:00Z",
        updatedAt: "2026-06-01T10:00:00Z"
    },

    {
        id: "ielts-intensive-6-5",
        slug: "ielts-intensive-6-5",
        title: "IELTS Intensive 5.5 → 6.5+",

        category: "ielts",
        level: "intermediate",
        ageGroup: "student",

        description:
            "Khóa học luyện đề chuyên sâu, tập trung nâng cao Writing & Speaking đạt 6.5+.",

        goal: "Đạt IELTS 6.5+",
        roadmap: [
            "Luyện đề Cambridge 10–18",
            "Writing Task 2 nâng cao",
            "Speaking mock test hàng tuần",
            "Chiến thuật làm bài Listening & Reading"
        ],

        durationWeeks: 12,
        totalLessons: 36,

        fee: 6000000,
        currency: "VND",

        startDate: "2026-07-15",
        seatsAvailable: 20,

        teacher: {
            name: "Trần Hoàng Nam",
            certificate: "IELTS 8.5",
            experienceYears: 6
        },

        rating: 4.9,
        enrollmentCount: 210,

        status: "open",
        isPopular: true,

        createdAt: "2026-04-20T09:00:00Z",
        updatedAt: "2026-06-05T08:00:00Z"
    },

    {
        id: "toeic-target-750",
        slug: "toeic-target-750",
        title: "TOEIC 450 → 750",

        category: "toeic",
        level: "intermediate",
        ageGroup: "working",

        description:
            "Khóa luyện thi TOEIC dành cho sinh viên năm cuối và người đi làm cần 750+.",

        goal: "Đạt TOEIC 750+",
        roadmap: [
            "Ngữ pháp TOEIC chuyên sâu",
            "Listening Part 3–4",
            "Reading Part 5–7",
            "Luyện đề ETS"
        ],

        durationWeeks: 10,
        totalLessons: 30,

        fee: 4000000,
        currency: "VND",

        startDate: "2026-07-20",
        seatsAvailable: 30,

        teacher: {
            name: "Lê Thu Hà",
            certificate: "TOEIC 990",
            experienceYears: 5
        },

        rating: 4.6,
        enrollmentCount: 150,

        status: "open",
        isPopular: false,

        createdAt: "2026-05-10T09:00:00Z",
        updatedAt: "2026-06-02T09:00:00Z"
    },

    {
        id: "business-english-pro",
        slug: "business-english-pro",
        title: "Business English Pro",

        category: "giaotiep",
        level: "advanced",
        ageGroup: "working",

        description:
            "Khóa giao tiếp tiếng Anh nâng cao dành cho môi trường doanh nghiệp quốc tế.",

        goal: "Giao tiếp lưu loát trong môi trường doanh nghiệp",
        roadmap: [
            "Email chuyên nghiệp",
            "Thuyết trình bằng tiếng Anh",
            "Meeting & Negotiation",
            "Case study thực tế"
        ],

        durationWeeks: 8,
        totalLessons: 24,

        fee: 3800000,
        currency: "VND",

        startDate: "2026-08-05",
        seatsAvailable: 18,

        teacher: {
            name: "Phạm Quốc Bảo",
            certificate: "IELTS 8.0",
            experienceYears: 7
        },

        rating: 4.8,
        enrollmentCount: 95,

        status: "upcoming",
        isPopular: false,

        createdAt: "2026-05-15T08:00:00Z",
        updatedAt: "2026-06-10T10:00:00Z"
    }
];