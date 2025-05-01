import { handleTokenExpiration } from './tokenUtils';
import { NextRouter } from 'next/router';
import Cookies from 'js-cookie';

export const fetchWithAuth = async (
    url: string,
    options: RequestInit = {},
    router: NextRouter
): Promise<Response> => {
    const token = Cookies.get('token');

    // Check token before making request
    if (handleTokenExpiration(router)) {
        throw new Error('Session expired');
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    // Handle 401 responses
    if (response.status === 401) {
        handleTokenExpiration(router);
        throw new Error('Unauthorized');
    }

    return response;
};