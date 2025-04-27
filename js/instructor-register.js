// instructor-register.js - 강사 등록 폼 처리

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('instructor-register-form');
    
    if (form) {
        // 기타 입력란 표시/숨김 처리
        initOtherInputs();
        
        // 강의 이력 테이블 초기화
        initLectureHistoryTable();
        
        // 요일별 시간 입력 초기화
        initTimeInputs();
        
        // 강의 스타일 입력란 초기화
        initTeachingStyleInputs();

        // PDF 업로드 및 양식 자동 채우기 기능
        const pdfInput = document.getElementById('instructor-pdf');
        if (pdfInput) {
            pdfInput.addEventListener('change', async function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                // Validate file type
                if (file.type !== 'application/pdf') {
                    alert('PDF 파일만 업로드 가능합니다.');
                    pdfInput.value = '';
                    return;
                }
                
                // Show loading state
                const loadingMessage = document.createElement('div');
                loadingMessage.textContent = '이력서를 분석 중입니다...';
                loadingMessage.className = 'alert alert-info';
                form.insertBefore(loadingMessage, form.firstChild);
                
                try {
                    const formData = new FormData();
                    formData.append('pdf', file);
                    
                    // Send PDF to backend for processing
                    const response = await fetch('/parse-instructor-pdf', {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (!response.ok) {
                        throw new Error('PDF 처리 중 오류가 발생했습니다.');
                    }
                    
                    const data = await response.json();
                    
                    // Auto-fill form fields with extracted data
                    autoFillFormFields(data);
                    
                    // Show success message
                    loadingMessage.className = 'alert alert-success';
                    loadingMessage.textContent = '이력서가 성공적으로 분석되었습니다.';
                    
                    // Remove success message after 3 seconds
                    setTimeout(() => {
                        loadingMessage.remove();
                    }, 3000);
                    
                } catch (error) {
                    console.error('PDF 처리 오류:', error);
                    loadingMessage.className = 'alert alert-danger';
                    loadingMessage.textContent = error.message || 'PDF 처리 중 오류가 발생했습니다.';
                    
                    // Remove error message after 5 seconds
                    setTimeout(() => {
                        loadingMessage.remove();
                    }, 5000);
                }
            });
        }

        const scrollToTopBtn = document.querySelector('.scroll-to-top');
        if (!scrollToTopBtn) return;

        window.addEventListener('scroll', () => {
            console.log('스크롤 위치:', window.scrollY);
            if (window.scrollY > 0) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // 폼 제출 처리 (DB 연동 없이 프론트엔드 배열/로컬스토리지에 저장)
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (!validateForm()) return;
            const data = collectFormData();
            // 등록일/수정일 자동 추가
            const now = new Date();
            data.registerDate = now.toISOString().slice(0, 10);
            data.updateDate = now.toISOString().slice(0, 10);
            // 첨부파일(샘플 강의안, 워크시트)은 파일명만 저장(실제 업로드X)
            const sampleLecture = document.getElementById('sampleLecture');
            if (sampleLecture && sampleLecture.files.length > 0) {
                data.sampleLecture = sampleLecture.files[0].name;
            }
            const worksheets = document.getElementById('worksheets');
            if (worksheets && worksheets.files.length > 0) {
                data.worksheets = worksheets.files[0].name;
            }
            // window.instructors 배열에 추가
            if (!window.instructors) window.instructors = [];
            window.instructors.push(data);
            // localStorage에도 저장
            localStorage.setItem('instructors', JSON.stringify(window.instructors));
            alert('강사 등록이 완료되었습니다. (임시 저장)');
            window.location.href = 'instructor-database.html';
        });
    } else {
        // 폼이 없더라도 강의 이력 카드형 기능은 항상 활성화
        initLectureHistoryTable();
    }
});

// Ensure scroll-to-top button always scrolls to top on click
const scrollToTopBtnGlobal = document.querySelector('.scroll-to-top');
if (scrollToTopBtnGlobal) {
    scrollToTopBtnGlobal.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function validateForm() {
    const requiredFields = [
        { id: 'name', label: '이름' },
        { id: 'phone', label: '연락처' },
        { id: 'email', label: '이메일' },
        { id: 'organization', label: '소속기관' },
        { id: 'position', label: '직위/경력' },
        { id: 'specialTopics', label: '세부 전문 주제' },
        { id: 'optimalSize', label: '최적 교육 인원' },
        { id: 'feeBasis', label: '강사비 기준' },
        { id: 'materialsList', label: '보유 강의자료 목록' },
        { id: 'overallEvaluation', label: '담당자 종합 평가' },
        { id: 'recommendingAgency', label: '추천기관' },
        { id: 'recommender', label: '추천 담당자' }
    ];

    let isValid = true;

    // 필수 필드 검사
    for (const field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            alert(`${field.label}을(를) 입력해주세요.`);
            element.focus();
            isValid = false;
            break;
        }
    }

    // 이메일 형식 검사
    if (isValid) {
        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('올바른 이메일 형식이 아닙니다.');
            document.getElementById('email').focus();
            isValid = false;
        }
    }

    // 전문 분야 선택 검사
    if (isValid) {
        const mainFields = document.querySelectorAll('input[name="mainFields"]:checked');
        if (mainFields.length === 0) {
            alert('전문 분야를 하나 이상 선택해주세요.');
            isValid = false;
        }
    }

    // 강의 스타일 선택 검사
    if (isValid) {
        const teachingStyle = document.querySelector('input[name="teachingStyle"]:checked');
        if (!teachingStyle) {
            alert('선호하는 강의 스타일을 선택해주세요.');
            isValid = false;
        }
    }

    // 강의 방식 선택 검사
    if (isValid) {
        const teachingMethod = document.querySelectorAll('input[name="teachingMethod"]:checked');
        if (teachingMethod.length === 0) {
            alert('선호하는 강의 방식을 하나 이상 선택해주세요.');
            isValid = false;
        }
    }

    // 강의 이력 검사
    if (isValid) {
        const lectureRows = document.querySelectorAll('#lectureHistoryTable tbody tr');
        if (lectureRows.length === 0) {
            alert('최소 1건 이상의 강의 이력이 필요합니다.');
            isValid = false;
        }
    }

    // 개인정보 동의 검사
    if (isValid) {
        const privacyConsent = document.getElementById('privacyConsent');
        if (!privacyConsent.checked) {
            alert('개인정보 수집 및 이용에 동의해주세요.');
            privacyConsent.focus();
            isValid = false;
        }
    }

    return isValid;
}

function collectFormData() {
    const formData = {
        // 기본 정보
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        organization: document.getElementById('organization').value.trim(),
        position: document.getElementById('position').value.trim(),
        
        // 전문 분야
        mainFields: Array.from(document.querySelectorAll('input[name="mainFields"]:checked')).map(cb => cb.value),
        specialTopics: document.getElementById('specialTopics').value.trim(),
        
        // 강의 특성
        teachingStyle: document.querySelector('input[name="teachingStyle"]:checked')?.value,
        styleMixedRatio: document.getElementById('style_mixed_ratio')?.value.trim(),
        optimalSize: document.getElementById('optimalSize').value.trim(),
        teachingMethod: Array.from(document.querySelectorAll('input[name="teachingMethod"]:checked')).map(cb => cb.value),
        
        // 강의 이력
        lectureHistory: collectLectureHistory(),
        historyNote: document.getElementById('historyNote').value.trim(),
        
        // 비용 및 일정
        feeBasis: document.getElementById('feeBasis').value.trim(),
        availableDays: collectAvailableDays(),
        regions: Array.from(document.querySelectorAll('input[name="regions[]"]:checked')).map(cb => cb.value),
        regionNote: document.getElementById('regionNote').value.trim(),
        
        // 강의 자료
        materialsList: document.getElementById('materialsList').value.trim(),
        sharingConsent: document.querySelector('input[name="sharingConsent"]:checked')?.value,
        
        // 종합 평가
        overallEvaluation: document.getElementById('overallEvaluation').value.trim(),
        feedbackSummary: document.getElementById('feedbackSummary').value.trim(),
        recommendationLevel: document.querySelector('input[name="recommendationLevel"]:checked')?.value,
        recommendingAgency: document.getElementById('recommendingAgency').value.trim(),
        recommender: document.getElementById('recommender').value.trim(),
        
        // 기타 정보
        otherInfo: document.getElementById('otherInfo').value.trim(),
        privacyConsent: document.getElementById('privacyConsent').checked
    };

    // 기타 입력값 처리
    if (document.getElementById('field_sw_etc').checked) {
        formData.field_sw_etc_text = document.getElementById('field_sw_etc_text').value.trim();
    }
    if (document.getElementById('field_psy_etc').checked) {
        formData.field_psy_etc_text = document.getElementById('field_psy_etc_text').value.trim();
    }
    if (document.getElementById('field_ls_etc').checked) {
        formData.field_ls_etc_text = document.getElementById('field_ls_etc_text').value.trim();
    }
    if (document.getElementById('method_etc').checked) {
        formData.method_etc_text = document.getElementById('method_etc_text').value.trim();
    }
    if (document.getElementById('region_etc').checked) {
        formData.region_etc_text = document.getElementById('region_etc_text').value.trim();
    }

    return formData;
}

function collectLectureHistory() {
    const rows = document.querySelectorAll('#lectureHistoryTable tbody tr');
    return Array.from(rows).map(row => ({
        date: row.querySelector('input[name="lecture_date[]"]').value,
        topic: row.querySelector('input[name="lecture_topic[]"]').value,
        target: row.querySelector('input[name="lecture_target[]"]').value,
        organization: row.querySelector('input[name="lecture_org[]"]').value,
        participants: row.querySelector('input[name="lecture_participants[]"]').value,
        rating: row.querySelector('input[name="lecture_rating[]"]').value
    }));
}

function collectAvailableDays() {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const availableDays = {};
    
    days.forEach(day => {
        const checkbox = document.getElementById(`day_${day}`);
        if (checkbox && checkbox.checked) {
            availableDays[day] = {
                start: document.querySelector(`input[name="time_${day}_start"]`).value,
                end: document.querySelector(`input[name="time_${day}_end"]`).value
            };
        }
    });
    
    return availableDays;
}

function initOtherInputs() {
    // 기타 입력란 표시/숨김 처리
    const otherFields = [
        { checkbox: 'field_sw_etc', input: 'field_sw_etc_input' },
        { checkbox: 'field_psy_etc', input: 'field_psy_etc_input' },
        { checkbox: 'field_ls_etc', input: 'field_ls_etc_input' },
        { checkbox: 'method_etc', input: 'method_etc_input' },
        { checkbox: 'region_etc', input: 'region_etc_input' },
        { checkbox: 'pedagogy_etc', input: 'pedagogy_etc_input' } // 선호하는 교수법 기타
    ];

    otherFields.forEach(field => {
        const checkbox = document.getElementById(field.checkbox);
        const input = document.getElementById(field.input);
        
        if (checkbox && input) {
            checkbox.addEventListener('change', function() {
                input.style.display = this.checked ? 'block' : 'none';
                if (!this.checked) {
                    input.querySelector('input').value = '';
                }
            });
        }
    });
}

function initLectureHistoryTable() {
    const addButton = document.getElementById('addLectureRow');
    const inputIds = [
        'input_lecture_date', 'input_lecture_topic', 'input_lecture_target', 'input_lecture_org',
        'input_lecture_participants', 'input_lecture_method', 'input_lecture_time',
        'input_lecture_summary', 'input_lecture_note'
    ];
    const tableBody = document.getElementById('lectureHistoryTableBody');
    let editingRow = null;
    if (addButton && tableBody) {
        addButton.disabled = false;
        addButton.textContent = '+ 강의 추가';
        addButton.onclick = function() {
            if (editingRow) {
                // 수정 완료: 입력값으로 해당 행 업데이트
                const values = inputIds.map(id => document.getElementById(id)?.value || '');
                if (!values[0] || !values[1] || !values[2] || !values[3] || !values[5] || !values[6] || !values[7]) {
                    alert('필수 항목을 모두 입력해 주세요.');
                    return;
                }
                for (let i = 0; i < 9; i++) {
                    editingRow.children[i].textContent = values[i];
                }
                editingRow = null;
                addButton.textContent = '+ 강의 추가';
                inputIds.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
            } else {
                // 새 행 추가
                const values = inputIds.map(id => document.getElementById(id)?.value || '');
                if (!values[0] || !values[1] || !values[2] || !values[3] || !values[5] || !values[6] || !values[7]) {
                    alert('필수 항목을 모두 입력해 주세요.');
                    return;
                }
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${values[0]}</td>
                    <td>${values[1]}</td>
                    <td>${values[2]}</td>
                    <td>${values[3]}</td>
                    <td>${values[4]}</td>
                    <td>${values[5]}</td>
                    <td>${values[6]}</td>
                    <td>${values[7]}</td>
                    <td>${values[8]}</td>
                    <td>
                        <button type="button" class="btn btn-sm btn-secondary edit-row">수정</button>
                        <button type="button" class="btn btn-sm btn-danger remove-row">삭제</button>
                    </td>
                `;
                tableBody.appendChild(tr);
                inputIds.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
            }
        };
        tableBody.onclick = function(e) {
            if (e.target.classList.contains('remove-row')) {
                e.target.closest('tr').remove();
                if (editingRow && editingRow === e.target.closest('tr')) {
                    // 삭제된 행이 수정 중이던 행이면 폼 리셋
                    editingRow = null;
                    addButton.textContent = '+ 강의 추가';
                    inputIds.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
                }
            } else if (e.target.classList.contains('edit-row')) {
                // 수정 버튼 클릭: 값 입력폼에 채우고, 버튼 텍스트 변경
                editingRow = e.target.closest('tr');
                for (let i = 0; i < 9; i++) {
                    const el = document.getElementById(inputIds[i]);
                    if (el) el.value = editingRow.children[i].textContent;
                }
                addButton.textContent = '수정 완료';
            }
        };
    }
}

function initTimeInputs() {
    document.querySelectorAll('.day-available').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const day = this.id.split('_')[1];
            const startInput = document.querySelector(`input[name="time_${day}_start"]`);
            const endInput = document.querySelector(`input[name="time_${day}_end"]`);
            
            startInput.disabled = !this.checked;
            endInput.disabled = !this.checked;
            
            if (!this.checked) {
                startInput.value = '';
                endInput.value = '';
            }
        });
    });
}

function initTeachingStyleInputs() {
    const mixedContainer = document.getElementById('style_mixed_input_container');
    
    document.querySelectorAll('input[name="teachingStyle"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (mixedContainer) {
                mixedContainer.style.display = this.value === 'mixed' ? 'block' : 'none';
                if (this.value !== 'mixed') {
                    document.getElementById('style_mixed_ratio').value = '';
                }
            }
        });
    });
}

// Function to auto-fill form fields
function autoFillFormFields(data) {
    // Map backend sampleData to actual form field IDs
    if (data.basicInfo) {
        if (data.basicInfo.name) document.getElementById('name').value = data.basicInfo.name;
        if (data.basicInfo.email) document.getElementById('email').value = data.basicInfo.email;
        if (data.basicInfo.phone) document.getElementById('phone').value = data.basicInfo.phone;
        if (data.basicInfo.organization) document.getElementById('organization').value = data.basicInfo.organization;
        if (data.basicInfo.position) document.getElementById('position').value = data.basicInfo.position;
        if (data.basicInfo.bio) document.getElementById('instructorBio').value = data.basicInfo.bio;
    }
    if (data.specialTopics) document.getElementById('specialTopics').value = data.specialTopics;
    if (data.teachingScope) document.getElementById('teachingScope').value = data.teachingScope;
    if (data.materials && data.materials.materialsList) document.getElementById('materialsList').value = data.materials.materialsList;
    if (data.evaluation && data.evaluation.overallEvaluation) document.getElementById('overallEvaluation').value = data.evaluation.overallEvaluation;
    if (data.evaluation && data.evaluation.feedbackSummary) document.getElementById('feedbackSummary').value = data.evaluation.feedbackSummary;
    if (data.evaluation && data.evaluation.recommendingAgency) document.getElementById('recommendingAgency').value = data.evaluation.recommendingAgency;
    if (data.evaluation && data.evaluation.recommender) document.getElementById('recommender').value = data.evaluation.recommender;
} 