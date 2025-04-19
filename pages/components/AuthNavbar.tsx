import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

export const AuthNavbar = () => {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-[104px] h-[56px] relative">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/afde0c8e534c73a3b3de25519a738956e2de66092dacd940229384d6d666eec0?placeholderIfAbsent=true&apiKey=4c3f70633dcc438f977ddb9596975766"
                alt="Company logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/login"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                router.pathname === '/login' 
                  ? 'bg-healing-100 text-healing-500' 
                  : 'text-gray-500 hover:text-healing-500'
              }`}
            >
              Sign In
            </Link>
            <Link 
              href="/signup"
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                router.pathname === '/signup' 
                  ? 'bg-mindful-100 text-mindful-500' 
                  : 'text-gray-500 hover:text-mindful-500'
              }`}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};