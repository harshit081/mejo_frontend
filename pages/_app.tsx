import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext"; // Import AuthProvider
import "@/styles/globals.css"; 

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
