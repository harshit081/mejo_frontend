import { handleTokenExpiration } from './tokenUtils';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const router = useRouter();
    const token = Cookies.get('token');

    if (handleTokenExpiration(router)) {
        throw new Error('Token expired');
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 401) {
        Cookies.remove('token');
        router.push('/login');
        throw new Error('Unauthorized');
    }

    return response;
};