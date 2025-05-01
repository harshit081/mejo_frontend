import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { handleTokenExpiration } from "../../lib/tokenUtils";

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const AuthComponent = (props: P) => {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

        useEffect(() => {
            // Check token on mount
            if (handleTokenExpiration(router)) {
                return;
            }

            // Check token every minute
            const checkTokenInterval = setInterval(() => {
                handleTokenExpiration(router);
            }, 60000);

            setIsAuthenticated(true);

            return () => clearInterval(checkTokenInterval);
        }, [router]);

        // Show nothing while checking authentication
        if (!isAuthenticated) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;
