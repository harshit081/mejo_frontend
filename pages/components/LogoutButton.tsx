import { useRouter } from "next/router";
import Cookies from "js-cookie";

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove("token");
        router.push("/login");
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
