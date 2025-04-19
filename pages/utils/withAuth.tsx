import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const AuthComponent = (props: P) => {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

        useEffect(() => {
            const token = Cookies.get("token");
            if (!token) {
                router.push("/login");
            } else {
                setIsAuthenticated(true);
            }
        }, []);

        if (!isAuthenticated) {
            return null; // Show nothing while redirecting
        }

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;
