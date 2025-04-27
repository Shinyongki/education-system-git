const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Multer 설정
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('PDF 파일만 업로드 가능합니다.'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB 제한
    }
});

// PDF 파싱 엔드포인트
router.post('/parse-instructor-pdf', upload.single('pdf'), (req, res) => {
    // 샘플 데이터 반환
    const sampleData = {
        basicInfo: {
            name: "김교육",
            email: "education@example.com",
            phone: "010-1234-5678",
            organization: "한국교육연구소",
            position: "수석연구원 / 15년 경력",
            profileImage: null,
            privateInfo: ["phone", "email"]
        },
        career: {
            years: "15",
            company: "한국교육연구소",
            bio: "15년간 IT 교육 분야에서 활동해온 전문 강사입니다. 실무 경험을 바탕으로 한 실용적인 교육을 제공합니다."
        },
        mainFields: {
            // 역량강화교육 - 전담사회복지사 대상
            caseManagement: true,
            seniorCare: false,
            programDev: true,
            administration: false,
            field_sw_etc: true,
            field_sw_etc_text: "노인복지정책",
            
            // 심리지원교육
            counseling: true,
            traumaCare: false,
            selfCare: true,
            stressManagement: false,
            field_psy_etc: true,
            field_psy_etc_text: "집단상담",
            
            // 역량강화교육 - 생활지원사 대상
            seniorCommunication: true,
            crisisCare: false,
            serviceQuality: true,
            ictUsage: false,
            field_ls_etc: true,
            field_ls_etc_text: "응급처치"
        },
        specialTopics: "인공지능, 빅데이터 분석, 클라우드 컴퓨팅",
        teachingScope: "실무 중심의 현장 교육",
        teachingCharacteristics: {
            teachingStyle: "mixed",
            styleMixedRatio: "강의 60% / 실습 40%",
            optimalSize: "15-20명",
            preferredMethods: ["offline", "online", "hybrid"],
            pedagogyMethods: ["discussion", "roleplay", "casestudy", "lecture", "research", "practice", "etc"],
            pedagogyEtcText: "현장 실습 및 멘토링"
        },
        lectureHistory: [
            {
                date: "2024-03-15",
                topic: "파이썬 기초 프로그래밍",
                target: "대학생",
                organization: "서울대학교",
                participants: "30",
                rating: "4.8"
            },
            {
                date: "2024-02-20",
                topic: "AI 딥러닝 기초",
                target: "기업 실무자",
                organization: "삼성전자",
                participants: "25",
                rating: "4.9"
            },
            {
                date: "2024-01-10",
                topic: "데이터베이스 설계",
                target: "개발자",
                organization: "LG CNS",
                participants: "20",
                rating: "4.7"
            }
        ],
        historyNote: "모든 강의에서 높은 만족도를 기록했으며, 특히 실습 위주의 교육에서 좋은 평가를 받았습니다.",
        costAndSchedule: {
            feeBasis: "시간당 25만원, 하루 최대 4시간",
            availableDays: {
                mon: { available: true, startTime: "09:00", endTime: "18:00" },
                tue: { available: true, startTime: "09:00", endTime: "18:00" },
                wed: { available: true, startTime: "09:00", endTime: "18:00" },
                thu: { available: true, startTime: "09:00", endTime: "18:00" },
                fri: { available: true, startTime: "09:00", endTime: "18:00" },
                sat: { available: false },
                sun: { available: false }
            },
            regions: ["gyeongnam", "gyeongbuk", "gwangju", "daegu", "busan", "ulsan", "jeonnam", "jeonbuk", "nationwide"],
            regionEtcText: "제주도",
            regionNote: "숙박 필요, 교통비 지원 필요 등"
        },
        materials: {
            materialsList: "1. 강의 교재 및 실습 자료\n2. 워크북\n3. 실습용 데이터셋",
            sampleLecture: null,
            worksheets: null,
            sharingConsent: "conditional"
        },
        evaluation: {
            overallEvaluation: "실무 경험이 풍부하고 교육 능력이 우수한 강사입니다. 특히 실습 과정에서 학습자의 이해도를 높이는 교수법이 탁월합니다.",
            feedbackSummary: "- 실무 예제를 통한 이해도 향상\n- 체계적인 커리큘럼 구성\n- 학습자 수준별 맞춤 지도",
            recommendationLevel: "5",
            recommendingAgency: "한국소프트웨어산업협회",
            recommender: "박추천",
            otherInfo: "글로벌 기업 교육 경험 다수 보유"
        },
        courses: {
            availableCourses: "자바 프로그래밍, 웹 개발, 데이터베이스",
            certifications: "정보처리기사, AWS 자격증, MCSA"
        },
        privacyConsent: true
    };

    // 1초 후에 응답 (실제 PDF 파싱 시간 시뮬레이션)
    setTimeout(() => {
        res.json(sampleData);
    }, 1000);
});

// 강사 등록 엔드포인트
router.post('/register', (req, res) => {
    // 강사 등록 처리 로직
    res.json({ success: true, message: '강사가 성공적으로 등록되었습니다.' });
});

module.exports = router; 