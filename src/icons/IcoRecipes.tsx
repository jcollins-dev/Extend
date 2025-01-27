import React from 'react';

export interface IconRecipesProps {
  color?: string;
}
export const IcoRecipes = ({ color }: IconRecipesProps): JSX.Element => {
  color = color || 'inherit';
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.45466 0.5C11.3727 0.5 12.9747 1.85 13.3647 3.651C14.3888 3.37385 15.4811 3.51488 16.4012 4.04308C17.3214 4.57128 17.994 5.44337 18.2712 6.4675C18.5483 7.49163 18.4073 8.58392 17.8791 9.50407C17.3509 10.4242 16.4788 11.0968 15.4547 11.374V18.5H3.45466V11.374C2.94756 11.2366 2.47248 11.0007 2.05655 10.6798C1.64062 10.3588 1.29198 9.95906 1.03054 9.50336C0.769093 9.04766 0.599967 8.54492 0.532815 8.02385C0.465663 7.50279 0.5018 6.9736 0.639162 6.4665C0.776525 5.9594 1.01242 5.48432 1.33339 5.06839C1.65435 4.65246 2.0541 4.30382 2.5098 4.04237C2.96551 3.78093 3.46824 3.6118 3.98931 3.54465C4.51037 3.4775 5.03956 3.51364 5.54666 3.651C5.7405 2.75857 6.23388 1.95933 6.94481 1.38611C7.65574 0.812887 8.54142 0.500197 9.45466 0.5Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.61523 14.509L15.4542 14.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
