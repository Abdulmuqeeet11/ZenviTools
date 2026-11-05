import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="28" height="28" rx="8" fill="#7045C6" />
    <path
      d="M16 7.5L24.5 12L16 16.5L7.5 12L16 7.5Z"
      fill="#FFFFFF"
    />
    <path
      d="M7.5 16.2L16 20.7L24.5 16.2"
      stroke="#E4D9FA"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 20.4L16 24.9L24.5 20.4"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
