import { ButtonProps } from '../types';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
  tabIndex,
  className = '',
}) => {
  const baseStyles = "text-lg leading-none";
  const variantStyles = {
    primary: "px-4 py-2.5 rounded-[100px] text-neutral-100 bg-zinc-800 hover:bg-zinc-700",
    secondary: "text-zinc-800 hover:text-zinc-600"
  };

  return (
    <button
      onClick={onClick}
      tabIndex={tabIndex}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};