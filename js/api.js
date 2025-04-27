// API 서비스
const API_BASE_URL = 'http://localhost:3000/api'; // 실제 서버 URL로 변경 필요

const api = {
    // 강사 데이터
    getInstructors: async () => {
        const response = await fetch(`${API_BASE_URL}/instructors`);
        return await response.json();
    },

    // 통계 데이터
    getStats: async () => {
        const response = await fetch(`${API_BASE_URL}/stats`);
        return await response.json();
    },

    // 수정 이력
    getHistory: async (page = 1, limit = 10) => {
        const response = await fetch(`${API_BASE_URL}/history?page=${page}&limit=${limit}`);
        return await response.json();
    },

    // 알림
    getNotifications: async () => {
        const response = await fetch(`${API_BASE_URL}/notifications`);
        return await response.json();
    },

    // 알림 읽음 처리
    markNotificationAsRead: async (notificationId) => {
        const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
            method: 'POST'
        });
        return await response.json();
    },

    // 실시간 업데이트를 위한 웹소켓 연결
    connectWebSocket: (onMessage) => {
        const ws = new WebSocket('ws://localhost:3000/ws'); // 실제 웹소켓 서버 URL로 변경 필요
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return ws;
    }
};

window.api = api; 