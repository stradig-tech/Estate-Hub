import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService, cmsService } from '@/api/services';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false); // Kept for compatibility with App.jsx
    const [authError, setAuthError] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [siteSettings, setSiteSettings] = useState(null);

    useEffect(() => {
        checkUserAuth();
        fetchSiteSettings();
    }, []);

    const fetchSiteSettings = async () => {
        try {
            const settings = await cmsService.getSettings();
            setSiteSettings(settings);
            
            // Handle favicon update if present
            if (settings?.favicon) {
                let link = document.querySelector("link[rel~='icon']");
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.head.appendChild(link);
                }
                link.href = settings.favicon;
            }
        } catch (error) {
            console.error('Failed to fetch site settings:', error);
        }
    };

    const checkUserAuth = async () => {
        setIsLoadingAuth(true);
        setAuthError(null);
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setIsLoadingAuth(false);
                setAuthChecked(true);
                return;
            }

            const currentUser = await authService.getMe();
            setUser(currentUser);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('User auth check failed:', error);
            setIsAuthenticated(false);
            setUser(null);
            
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                setAuthError({
                    type: 'auth_required',
                    message: 'Authentication required'
                });
            }
        } finally {
            setIsLoadingAuth(false);
            setAuthChecked(true);
        }
    };

    const login = async (email, password) => {
        setIsLoadingAuth(true);
        try {
            await authService.login(email, password);
            await checkUserAuth();
            return true;
        } catch (error) {
            setAuthError({
                message: error.response?.data?.detail || 'Login failed'
            });
            setIsLoadingAuth(false);
            throw error;
        }
    };

    const register = async (email, password) => {
        setIsLoadingAuth(true);
        try {
            await authService.register(email, password);
            await checkUserAuth();
            return true;
        } catch (error) {
            setAuthError({
                message: error.response?.data?.error || 'Registration failed'
            });
            setIsLoadingAuth(false);
            throw error;
        }
    };

    const logout = (shouldRedirect = true) => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        if (shouldRedirect) {
            window.location.href = '/login';
        }
    };

    const navigateToLogin = () => {
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoadingAuth,
            isLoadingPublicSettings, // Mocked to false for compatibility
            authError,
            authChecked,
            login,
            register,
            logout,
            navigateToLogin,
            checkUserAuth,
            siteSettings
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
