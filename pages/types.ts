export interface NavigationItem {
    label: string;
    href: string;
}

export interface ImageCardProps {
    src: string;
    alt: string;
    className?: string;
}

export interface ButtonProps {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent) => void; // Updated to accept event
    tabIndex?: number;
    className?: string;
}

export interface HeroSectionProps {
    backgroundImage: string;
}
