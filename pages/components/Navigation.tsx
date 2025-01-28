import { useRouter } from 'next/router';

import { NavigationLink } from './NavigationLink';
import { NavigationItem } from '../types';
import { Button } from './Button';
import Image from 'next/image';


const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" }
];

export const Navigation: React.FC = () => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/login");
  }

  const handleSignUp = () => {
    router.push("/register");
  }

  return (
    <nav className="navigation  flex absolute flex-col items-center px-16 w-full font-medium text-center bg-white bg-opacity-35 max-md:px-5 max-md:max-w-full z-30">
      <div className="navigation-container flex gap-5 justify-between items-center ml-4 w-full max-w-[1631px] max-md:max-w-full">
        <div className="navigation-items flex gap-10 self-stretch my-auto text-base">
          {navigationItems.map((item) => (
            <NavigationLink key={item.href} href={item.href}>
              {item.label}
            </NavigationLink>
          ))}
        </div>
        <div className="navigation-logo w-[104px] h-[56px] justify-self-center">
          <Image
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/afde0c8e534c73a3b3de25519a738956e2de66092dacd940229384d6d666eec0?placeholderIfAbsent=true&apiKey=4c3f70633dcc438f977ddb9596975766"
            alt="Company logo"
            fill
            className="object-contain"
            priority
            onClick={() => router.push("/")}
          />
        </div>
        <div className="navigation-buttons flex gap-10 self-stretch my-auto">
          <Button className="signin-button" variant="secondary" onClick={handleSignIn} tabIndex={0}>Sign In</Button>
          <Button className='signup-button bg-signup-button-gradient border-2 border-gray-300 animate-zoom-gradient' variant="primary" onClick={handleSignUp} tabIndex={0}>Sign Up</Button>
        </div>
      </div>
    </nav>)
};