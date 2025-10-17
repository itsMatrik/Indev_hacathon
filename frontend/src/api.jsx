// api.js
import axios from 'axios'

// Для разработки с proxy используем относительные пути
// Автоматическое определение базового URL
export const API_BASE = 'http://26.1.225.234:8080';

// Уберите MOCK_BACKEND для продакшена
export const MOCK_BACKEND = true;

// token helpers
export function saveToken(token, remember) {
    if (remember) localStorage.setItem('token', token)
    else sessionStorage.setItem('token', token)
}

export function readToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || null
}

export function clearToken() {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
}

const axiosInstance = axios.create({
    baseURL: API_BASE,
    timeout: 10000
})

axiosInstance.interceptors.request.use((cfg) => {
    const token = readToken()
    if (token) cfg.headers.Authorization = `Bearer ${token}`
    return cfg
})

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
    }
)

export async function registerUser(username, password) {
    if (MOCK_BACKEND) {
        // Любые данные считаются валидными
        return { data: { message: 'User created', token: 'fake-token-123' } };
    }
    return axiosInstance.post('/auth/register', { username, password });
}

export async function loginUser(username, password) {
    if (MOCK_BACKEND) {
        // Любой логин/пароль пропускаем
        return { data: { token: 'fake-token-123' } };
    }
    return axiosInstance.post('/auth/login', { username, password });
}

export async function uploadImage(file, onUploadProgress) {
    if (MOCK_BACKEND) {
        // Симуляция прогресса загрузки
        if (onUploadProgress) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                onUploadProgress({ loaded: progress, total: 100 });
                if (progress >= 100) {
                    clearInterval(interval);
                }
            }, 100);
        }

        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Возвращаем точные данные, которые вы предоставили
        const mockResult = {
            "analysis_type": "full_analysis",
            "formatted_report": "=== МЕТРИКИ АНАЛИЗА КОЖИ ===\nacne_spots          : 0.000\ncyanosis            : 0.000\ndark_circles        : 0.211\njaundice            : 1.000\nmild_acne           : 0.215\nmoderate_acne       : 0.065\noiliness            : 0.000\npaleness            : 0.110\npigmentation        : 0.873\npore_size           : 0.455\npuffiness           : 0.747\nredness             : 0.303\nsevere_acne         : 0.018\ntexture_roughness   : 0.828\nvascularity         : 0.166\nwrinkles            : 0.073\n\n=== ОБЩАЯ ОЦЕНКА ===\nОценка состояния кожи: 65.13%\n\n=== РЕКОМЕНДАЦИИ ===\n  - SPF защита ежедневно\n  - Средства с витамином C и ниацинамидом\n  - Лимфодренажный массаж\n  - Контроль потребления соли\n  - Обратиться к врачу для обследования\n  - Мягкие эксфолианты для выравнивания текстуры",
            "metrics": {
                "acne_spots": 0.0,
                "cyanosis": 0.0,
                "dark_circles": 0.21131442487239838,
                "jaundice": 1.0,
                "mild_acne": 0.21496938350870937,
                "moderate_acne": 0.06450270495214315,
                "oiliness": 0.0,
                "paleness": 0.11042847064870652,
                "pigmentation": 0.8731149555119593,
                "pore_size": 0.4550502348255157,
                "puffiness": 0.7467156611940167,
                "redness": 0.3030783534049988,
                "severe_acne": 0.017834849295523453,
                "texture_roughness": 0.8284447740526998,
                "vascularity": 0.1657451994530646,
                "wrinkles": 0.07295247449039896
            },
            "overall_score": 0.6512578355108487,
            "report": {
                "features": [
                    ["fatigue_low", "stress_low", "color_good"],
                    ["skin_moderate", "eyes_bad", "puffiness_high", "dryness_high"]
                ],
                "metrics_summary": {
                    "acne_spots": 0.0,
                    "cyanosis": 0.0,
                    "dark_circles": 0.21131442487239838,
                    "jaundice": 1.0,
                    "mild_acne": 0.21496938350870937,
                    "moderate_acne": 0.06450270495214315,
                    "oiliness": 0.0,
                    "paleness": 0.11042847064870652,
                    "pigmentation": 0.8731149555119593,
                    "pore_size": 0.4550502348255157,
                    "puffiness": 0.7467156611940167,
                    "redness": 0.3030783534049988,
                    "severe_acne": 0.017834849295523453,
                    "texture_roughness": 0.8284447740526998,
                    "vascularity": 0.1657451994530646,
                    "wrinkles": 0.07295247449039896
                },
                "overall_score": 0.6512578355108487,
                "recommendations": [
                    "SPF защита ежедневно",
                    "Средства с витамином C и ниацинамидом",
                    "Лимфодренажный массаж",
                    "Контроль потребления соли",
                    "Обратиться к врачу для обследования",
                    "Мягкие эксфолианты для выравнивания текстуры"
                ]
            },
            "status": "success"
        };

        return {
            data: {
                status: 'success',
                result: JSON.stringify(mockResult),
                timestamp: new Date().toISOString(),
            },
        };
    }

    const form = new FormData()
    form.append('file', file)
    return axiosInstance.post('/api/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
    })
}

export async function getAiStatus() {
    if (MOCK_BACKEND) return { data: { ai_status: 'running' } }
    return axiosInstance.get('/api/status')
}

export async function getHistory() {
    if (MOCK_BACKEND) {
        // Создаем несколько примеров для истории
        const mockHistory = [
            {
                id: '1',
                result: JSON.stringify({
                    "analysis_type": "full_analysis",
                    "formatted_report": "=== МЕТРИКИ АНАЛИЗА КОЖИ ===\n...",
                    "metrics": {
                        "acne_spots": 0.1,
                        "dark_circles": 0.3,
                        "puffiness": 0.5,
                        "redness": 0.2,
                        "wrinkles": 0.1
                    },
                    "overall_score": 0.72,
                    "report": {
                        "recommendations": [
                            "SPF защита ежедневно",
                            "Увлажняющие средства"
                        ]
                    },
                    "status": "success"
                }),
                date: new Date(Date.now() - 86400000).toISOString() // 1 день назад
            },
            {
                id: '2',
                result: JSON.stringify({
                    "analysis_type": "full_analysis",
                    "formatted_report": "=== МЕТРИКИ АНАЛИЗА КОЖИ ===\n...",
                    "metrics": {
                        "acne_spots": 0.2,
                        "dark_circles": 0.4,
                        "puffiness": 0.6,
                        "redness": 0.3,
                        "wrinkles": 0.15
                    },
                    "overall_score": 0.65,
                    "report": {
                        "recommendations": [
                            "SPF защита ежедневно",
                            "Средства с витамином C"
                        ]
                    },
                    "status": "success"
                }),
                date: new Date(Date.now() - 172800000).toISOString() // 2 дня назад
            }
        ];
        return { data: mockHistory };
    }
    return axiosInstance.get('/api/history')
}