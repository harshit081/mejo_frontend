"use client"
import { useRouter } from "next/router";
import { useEffect } from "react";

const index: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        router.push("/home")
    },[router]);

    return(<>

    </>)
}

export default index;