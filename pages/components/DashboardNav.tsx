import { useRouter } from 'next/router';
import Image from 'next/image';
import { ProfileMenu } from './ProfileMenu';

export const DashboardNav: React.FC = () => {
  const router = useRouter();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <div className="flex items-center">
        <div className="w-[104px] h-[56px] relative cursor-pointer">
          <Image
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/afde0c8e534c73a3b3de25519a738956e2de66092dacd940229384d6d666eec0?placeholderIfAbsent=true&apiKey=4c3f70633dcc438f977ddb9596975766"
            alt="Company logo"
            fill
            className="object-contain"
            priority
            onClick={() => router.push("/")}
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <ProfileMenu />
      </div>
    </nav>
  );
};