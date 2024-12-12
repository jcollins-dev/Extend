import React from 'react';

export interface IconProductionMetricsProps {
  color?: string;
}

export const IcoProductionMetrics = ({ color }: IconProductionMetricsProps): JSX.Element => {
  color = color || '#29A429';

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 21V7" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15L12 12L15 15" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 10L18 7L21 10" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 21H21" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 21V12" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 6L6 3L9 6" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 21V3" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
