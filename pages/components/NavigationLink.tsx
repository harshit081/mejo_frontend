import Link from 'next/link';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const NavigationLink: React.FC<NavigationLinkProps> = ({ 
  href, 
  children,
  className = ''
}) => (
  <Link 
    href={href} 
    className={`text-zinc-800 hover:text-zinc-600 transition-colors ${className}`}
  >
    {children}
  </Link>
)