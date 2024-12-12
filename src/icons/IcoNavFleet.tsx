import React from 'react';

export interface IconNavFleetProps {
  color?: string;
}

export const IcoNavFleet = ({ color }: IconNavFleetProps): JSX.Element => {
  color = color || '#303E47';

  return (
    <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5195 4.57386V5.22727H13.957V11.108H12.5195C12.5195 11.2094 12.4952 11.3096 12.4485 11.4002L11.1008 14.0138C10.9863 14.2353 10.7534 14.375 10.498 14.375H3.75977C3.5808 14.375 3.40969 14.3061 3.28337 14.1836L0.588057 11.5699C0.461691 11.4474 0.390625 11.2815 0.390625 11.108V4.57386C0.390625 4.40032 0.461691 4.2344 0.588057 4.1119L1.93571 2.80509C2.06203 2.68255 2.23314 2.61364 2.41211 2.61364H3.08594V1.30682H2.41211C2.03966 1.30682 1.73828 1.01457 1.73828 0.653409C1.73828 0.292248 2.03966 0 2.41211 0H9.15039C9.52284 0 9.82422 0.292248 9.82422 0.653409C9.82422 1.01457 9.52284 1.30682 9.15039 1.30682H8.47656V2.61364H9.15039C9.32936 2.61364 9.50047 2.68255 9.62683 2.80509L10.7771 3.92045H11.8457C12.2182 3.92045 12.5195 4.2127 12.5195 4.57386ZM7.05784 11.4002L8.40549 8.78657C8.6301 8.35236 8.30163 7.84091 7.80273 7.84091H6.19776L7.05784 6.17293C7.22432 5.85006 7.08942 5.45762 6.75646 5.29619C6.4235 5.1354 6.01879 5.26622 5.85231 5.58844L4.50466 8.20207C4.28005 8.63628 4.60852 9.14773 5.10742 9.14773H6.71239L5.85231 10.8157C5.68583 11.1386 5.82073 11.531 6.1537 11.6925C6.49003 11.8544 6.89226 11.7204 7.05784 11.4002Z"
        fill={color}
      />
      <path
        d="M16.6523 3.92188H15.9785C15.6064 3.92188 15.3047 4.21443 15.3047 4.57528V12.4162C15.3047 12.777 15.6064 13.0696 15.9785 13.0696H16.6523C17.3967 13.0696 18 12.4845 18 11.7628V5.22869C18 4.50694 17.3967 3.92188 16.6523 3.92188Z"
        fill={color}
      />
    </svg>
  );
};
