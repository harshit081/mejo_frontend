import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface TokenPayload {
    exp: number;
    email: string;
}

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<TokenPayload>(token);
        // Add 5 second buffer to handle network delays
        return (decoded.exp * 1000) - 5000 < Date.now();
    } catch {
        return true;
    }
};

export const handleTokenExpiration = (router: any): boolean => {
    const token = Cookies.get('token');
    
    if (!token || isTokenExpired(token)) {
        // Clear all auth related cookies
        Cookies.remove('token');
        Cookies.remove('user');
        
        // Redirect to login with return URL
        const currentPath = window.location.pathname;
        router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
        return true;
    }
    return false;
};