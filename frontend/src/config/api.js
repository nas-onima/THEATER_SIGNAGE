// API設定の一元管理
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// APIエンドポイントのヘルパー関数
export const createApiUrl = (path) => {
    // パスが/で始まらない場合は追加
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
};

// Socket.IO接続URL
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL;