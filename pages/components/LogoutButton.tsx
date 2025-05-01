import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useTheme } from 'next-themes';

const LogoutButton = () => {
    const router = useRouter();
    const { setTheme } = useTheme();

    const handleLogout = () => {
        // Clear all cookies
        Object.keys(Cookies.get()).forEach(cookie => {
            Cookies.remove(cookie);
        });
        // Clear localStorage
        localStorage.clear();
        // Reset theme to system
        setTheme('system');
        // Redirect to login
        router.push("/login");
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
