import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LogoProps {
  linkTo?: string;
  className?: string;
  forceLightMode?: boolean;
  animated?: boolean; // New prop to control animation
}

const Logo: React.FC<LogoProps> = ({ 
  linkTo = '/', 
  className = "w-[104px] h-[56px] relative",
  forceLightMode = false,
  animated = true // Default to true for animation
}) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Determine which logo to show based on theme
  const logoSrc = forceLightMode ? "/images/Mejo_light.png" : (
    mounted && (theme === 'dark' || resolvedTheme === 'dark')
      ? "/images/Mejo_dark.png"  // Path to your dark mode logo
      : "/images/Mejo_light.png" // Path to your light mode logo
  );
  
  // Add zoom animation classes
  const animationClasses = animated 
    ? "transition-transform duration-300 hover:scale-110 transform-gpu" 
    : "";
  
  const LogoImage = (
    <div className={`${className} ${animationClasses}`}>
      <Image
        src={logoSrc}
        alt="Mejo logo"
        fill
        sizes="(max-width: 768px) 100vw, 104px" // Added sizes prop
        className="object-contain"
        priority
      />
    </div>
  );
  
  // Return as link if linkTo is provided, otherwise just the image
  return linkTo ? (
    <Link href={linkTo} className={animationClasses}>
      {LogoImage}
    </Link>
  ) : LogoImage;
};

export default Logo;