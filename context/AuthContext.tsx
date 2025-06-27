import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface User {
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => void;
    signup: (email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await axios.post(`${apiUrl}/api/login`, { email, password });
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            router.push("/dashboard");
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    const signup = async (email: string, password: string) => {
        try {
            const res = await axios.post("http://localhost:5000/api/signup", { email, password });
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            router.push("/dashboard");
        } catch (err) {
            console.error("Signup failed:", err);
        }
    };


    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
