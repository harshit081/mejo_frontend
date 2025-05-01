import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const NavigationLink: React.FC<NavigationLinkProps> = ({ 
  href, 
  children,
  className = ''
}) => {
  const router = useRouter();
  
  const handleClick = (e: React.MouseEvent) => {
    // Check if it's a hash link on the current page
    if (href.startsWith('/#') && router.pathname === '/') {
      e.preventDefault();
      
      // Extract the element id from the hash
      const id = href.substring(2);
      const element = document.getElementById(id);
      
      if (element) {
        // Scroll to element with smooth behavior
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  };

  return (
    <Link 
      href={href} 
      className={`text-zinc-800 hover:text-zinc-600 transition-colors ${className}`}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};