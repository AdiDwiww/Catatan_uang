import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Card({ 
  children, 
  className = '', 
  onClick,
  noPadding = false,
  elevation = 'medium',
  border = false,
  hoverEffect = true,
  ...props 
}) {
  // Shadow variants
  const shadowVariants = {
    none: '',
    light: 'shadow-sm',
    medium: 'shadow-md',
    high: 'shadow-lg'
  };

  // Get shadow class
  const shadowClass = shadowVariants[elevation] || shadowVariants.medium;
  
  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'bg-white dark:bg-gray-800 rounded-xl overflow-hidden',
          shadowClass,
          border && 'border border-gray-100 dark:border-gray-700',
          !noPadding && 'p-5 sm:p-6 md:p-7',
          hoverEffect && 'transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-gray-900/30 transform hover:-translate-y-0.5',
          onClick && 'cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
} 