import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const extractToken = (data) => {
    if (!data) return null;
    return (
        data.access_token ||
        data.token ||
        data?.data?.access_token ||
        data?.data?.token ||
        null
    );
};

const extractUser = (data) => {
    if (!data) return null;
    return data.user || data?.data?.user || null;
};

const fetchProfile = async () => {
    // Try common endpoints used in Laravel apps
    try {
        const res = await api.get('/auth/profile');
        return res.data;
    } catch (e1) {
        if (e1?.response?.status && e1.response.status !== 404) throw e1;
        const res = await api.get('/user');
        return res.data;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchProfile()
                .then(profile => setUser(profile))
                .catch(() => {
                    localStorage.removeItem('auth_token');
                    delete api.defaults.headers.common['Authorization'];
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const token = extractToken(res.data);
        const userData = extractUser(res.data);

        if (token) {
            localStorage.setItem('auth_token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        if (userData) {
            setUser(userData);
            return userData;
        }

        // If backend doesn't include user in login response, fetch it
        const profile = await fetchProfile();
        setUser(profile);
        return profile;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('auth_token');
            delete api.defaults.headers.common['Authorization'];
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};