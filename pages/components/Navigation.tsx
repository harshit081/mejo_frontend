import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NavigationLink } from './NavigationLink';
import { NavigationItem } from '../types';
import { Button } from './Button';
import { ProfileMenu } from './ProfileMenu';
import Image from 'next/image';
import Cookies from 'js-cookie';
import Logo from '../../components/Logo';

const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" }, // Changed to hash link
  { label: "Team", href: "/team" }
];

export const Navigation: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleSignIn = () => {
    router.replace("/login");
  };

  const handleSignUp = () => {
    router.replace("/signup");
  };

  return (
    <nav className="navigation flex absolute flex-col items-center px-16 w-full font-medium text-center bg-white bg-opacity-35 max-md:px-5 max-md:max-w-full z-30">
      <div className="navigation-container flex gap-5 justify-between items-center ml-4 w-full max-w-[1631px] max-md:max-w-full">
        <div className="navigation-items flex gap-10 self-stretch my-auto text-base">
          {navigationItems.map((item) => (
            <NavigationLink key={item.href} href={item.href}>
              {item.label}
            </NavigationLink>
          ))}
        </div>

        <div className="navigation-logo w-[104px] h-[56px] -z-10 relative max-md:hidden -left-16">
          <Logo forceLightMode={true} />
        </div>

        <div className="navigation-buttons flex gap-10 self-stretch my-auto items-center">
          {isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <>
              <Button className="signin-button" variant="secondary" onClick={handleSignIn} tabIndex={0}>
                Sign In
              </Button>
              <Button className="signup-button bg-signup-button-gradient border-2 border-gray-300 animate-zoom-gradient" variant="primary" onClick={handleSignUp} tabIndex={0}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;