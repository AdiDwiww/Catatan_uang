import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Card({ 
  children, 
  className = '', 
  onClick,
  ...props 
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
} 