import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE = `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5001'}/api/auth`;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email, avatar: data.avatar }));
        setToken(data.token);
        setUser({ _id: data._id, name: data.name, email: data.email, avatar: data.avatar });
        return data;
    };

    const register = async (name, email, password) => {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email, avatar: data.avatar }));
        setToken(data.token);
        setUser({ _id: data._id, name: data.name, email: data.email, avatar: data.avatar });
        return data;
    };

    const googleLogin = async (access_token) => {
        const res = await fetch(`${API_BASE}/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Google login failed');

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email, avatar: data.avatar }));
        setToken(data.token);
        setUser({ _id: data._id, name: data.name, email: data.email, avatar: data.avatar });
        return data;
    };

    const updateProfile = async (updates) => {
        const res = await fetch(`${API_BASE}/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(updates)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Update failed');

        const updatedUser = { _id: data._id, name: data.name, email: data.email, avatar: data.avatar };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return data;
    };

    const changePassword = async (currentPassword, newPassword) => {
        const res = await fetch(`${API_BASE}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Password change failed');
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, updateProfile, changePassword, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

