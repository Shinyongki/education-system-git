// 로컬 데이터 저장소
let localData = {
    instructors: [],
    stats: {
        totalInstructors: 0,
        byRegion: {},
        byField: {},
        byRating: {}
    },
    notifications: [],
    history: []
};

document.addEventListener('DOMContentLoaded', function() {
    // 대시보드 초기화
    initializeDashboard();
});

function initializeDashboard() {
    // 로컬 데이터 먼저 로드
    loadLocalData();
    renderPendingTasks();
    renderTodaySchedule();
    // 5분마다 데이터 자동 업데이트
    setInterval(() => {
        loadLocalData();
        renderPendingTasks();
        renderTodaySchedule();
    }, 300000); // 5분 = 300000ms
}

// 로컬 데이터 로드
function loadLocalData() {
    try {
        // 통계 데이터 업데이트
        updateLocalStats();
        
        // 알림 목록 렌더링
        renderNotifications();
        
        // 수정 이력 렌더링
        renderHistory();
    } catch (error) {
        console.error('Error loading local data:', error);
        showError('데이터를 불러오는 중 오류가 발생했습니다.');
    }
}

// 로컬 통계 데이터 업데이트
function updateLocalStats() {
    // 샘플 데이터
    localData.stats = {
        totalInstructors: 25,
        byRegion: {
            '서울': 8,
            '경기': 6,
            '인천': 4,
            '부산': 3,
            '대구': 2,
            '기타': 2
        },
        byField: {
            '사례관리': 8,
            '노인상담': 7,
            '프로그램개발': 5,
            '행정회계': 3,
            '의사소통': 2
        },
        byRating: {
            '5': 5,
            '4': 10,
            '3': 7,
            '2': 2,
            '1': 1
        }
    };
    
    // 통계 업데이트
    updateStats(localData.stats);
    // 차트 업데이트
    updateCharts(localData.stats);
}

// 알림 목록 렌더링
function renderNotifications(notifications) {
    const notificationsList = document.getElementById('notificationsList');
    if (!notificationsList) return;
    
    // 샘플 알림 데이터
    const sampleNotifications = [
        {
            id: 1,
            message: '새로운 강사가 등록되었습니다: 김수학',
            type: '등록',
            createdAt: new Date(),
            read: false
        },
        {
            id: 2,
            message: '이영어 강사의 정보가 수정되었습니다',
            type: '수정',
            createdAt: new Date(Date.now() - 3600000),
            read: true
        }
    ];
    
    notificationsList.innerHTML = sampleNotifications.map(notification => `
        <div class="list-group-item notification-item ${notification.read ? '' : 'unread'}" 
             data-id="${notification.id}">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${notification.message}</h6>
                <small>${formatDate(notification.createdAt)}</small>
            </div>
            <small class="text-muted">${notification.type}</small>
        </div>
    `).join('');

    // 알림 클릭 이벤트 추가
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.remove('unread');
        });
    });
}

// 통계 업데이트
function updateStats(stats = localData.stats) {
    if (!stats) return;
    
    const totalInstructorsElement = document.getElementById('totalInstructors');
    if (totalInstructorsElement) {
        totalInstructorsElement.textContent = stats.totalInstructors;
    }
}

// 차트 업데이트
function updateCharts(stats = localData.stats) {
    if (!stats) return;
    
    const regionChart = document.getElementById('regionChart');
    const fieldChart = document.getElementById('fieldChart');
    const ratingChart = document.getElementById('ratingChart');
    
    // 공통 차트 옵션
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    font: {
                        size: 12,
                        family: "'Noto Sans KR', sans-serif"
                    }
                }
            }
        }
    };

    // 막대 차트 공통 옵션
    const barOptions = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    font: {
                        size: 12,
                        family: "'Noto Sans KR', sans-serif"
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12,
                        family: "'Noto Sans KR', sans-serif"
                    }
                }
            }
        }
    };
    
    if (regionChart) {
        new Chart(regionChart, {
            type: 'bar',
            data: {
                labels: Object.keys(stats.byRegion),
                datasets: [{
                    label: '지역별 강사 수',
                    data: Object.values(stats.byRegion),
                    backgroundColor: [
                        'rgba(26, 127, 90, 0.8)',
                        'rgba(26, 127, 90, 0.7)',
                        'rgba(26, 127, 90, 0.6)',
                        'rgba(26, 127, 90, 0.5)',
                        'rgba(26, 127, 90, 0.4)',
                        'rgba(26, 127, 90, 0.3)'
                    ],
                    borderColor: 'rgba(26, 127, 90, 1)',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                ...barOptions,
                plugins: {
                    ...barOptions.plugins,
                    title: {
                        display: true,
                        text: '지역별 강사 분포',
                        font: {
                            size: 14,
                            weight: 'bold',
                            family: "'Noto Sans KR', sans-serif"
                        },
                        padding: {
                            bottom: 20
                        }
                    }
                }
            }
        });
    }
    
    if (fieldChart) {
        new Chart(fieldChart, {
            type: 'doughnut',
            data: {
                labels: Object.keys(stats.byField),
                datasets: [{
                    data: Object.values(stats.byField),
                    backgroundColor: [
                        'rgba(26, 127, 90, 0.9)',
                        'rgba(26, 127, 90, 0.75)',
                        'rgba(26, 127, 90, 0.6)',
                        'rgba(26, 127, 90, 0.45)',
                        'rgba(26, 127, 90, 0.3)'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                ...commonOptions,
                cutout: '60%',
                plugins: {
                    ...commonOptions.plugins,
                    title: {
                        display: true,
                        text: '분야별 강사 분포',
                        font: {
                            size: 14,
                            weight: 'bold',
                            family: "'Noto Sans KR', sans-serif"
                        },
                        padding: {
                            bottom: 20
                        }
                    }
                }
            }
        });
    }
    
    if (ratingChart) {
        new Chart(ratingChart, {
            type: 'bar',
            data: {
                labels: ['5점', '4점', '3점', '2점', '1점'],
                datasets: [{
                    label: '평점별 강사 수',
                    data: Object.values(stats.byRating),
                    backgroundColor: [
                        'rgba(26, 127, 90, 0.9)',
                        'rgba(26, 127, 90, 0.75)',
                        'rgba(26, 127, 90, 0.6)',
                        'rgba(26, 127, 90, 0.45)',
                        'rgba(26, 127, 90, 0.3)'
                    ],
                    borderColor: 'rgba(26, 127, 90, 1)',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                ...barOptions,
                plugins: {
                    ...barOptions.plugins,
                    title: {
                        display: true,
                        text: '평점별 강사 분포',
                        font: {
                            size: 14,
                            weight: 'bold',
                            family: "'Noto Sans KR', sans-serif"
                        },
                        padding: {
                            bottom: 20
                        }
                    }
                }
            }
        });
    }
}

// 수정 이력 렌더링
function renderHistory(history) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    // 샘플 이력 데이터
    const sampleHistory = [
        {
            modifiedAt: new Date(),
            instructorName: '김수학',
            field: '연락처',
            oldValue: '010-1234-5678',
            newValue: '010-8765-4321',
            modifiedBy: '관리자'
        },
        {
            modifiedAt: new Date(Date.now() - 7200000),
            instructorName: '이영어',
            field: '이메일',
            oldValue: 'old@example.com',
            newValue: 'new@example.com',
            modifiedBy: '관리자'
        }
    ];
    
    historyList.innerHTML = sampleHistory.map(item => `
        <tr>
            <td>${formatDate(item.modifiedAt)}</td>
            <td>${item.instructorName}</td>
            <td>${item.field}</td>
            <td>${item.oldValue}</td>
            <td>${item.newValue}</td>
            <td>${item.modifiedBy}</td>
        </tr>
    `).join('');
}

// 날짜 포맷팅
function formatDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// 에러 메시지 표시
function showError(message) {
    const container = document.querySelector('.container');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    container.insertBefore(errorDiv, container.firstChild);
} 