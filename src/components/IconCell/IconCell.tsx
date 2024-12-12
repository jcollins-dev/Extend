import React from 'react';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { Typography } from 'components';

const ICONS = {
  file: (
    <>
      <path
        d="M8.666 1.333H3.999a1.333 1.333 0 0 0-1.333 1.333v10.667a1.333 1.333 0 0 0 1.333 1.333h8a1.333 1.333 0 0 0 1.334-1.333V6L8.666 1.333Z"
        stroke="#303E47"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.666 1.333V6h4.667"
        stroke="#303E47"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  cart: (
    <path
      d="M6 14.666a.667.667 0 1 0 0-1.333.667.667 0 0 0 0 1.333ZM13.333 14.666a.667.667 0 1 0 0-1.333.667.667 0 0 0 0 1.333ZM.666.667h2.667l1.786 8.927a1.333 1.333 0 0 0 1.334 1.073h6.48a1.333 1.333 0 0 0 1.333-1.073L15.333 4H3.999"
      stroke="#303E47"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  assigned: (
    <path
      d="M10.666 14v-1.333A2.667 2.667 0 0 0 7.999 10H3.333a2.667 2.667 0 0 0-2.667 2.667V14M5.667 7.333a2.667 2.667 0 1 0 0-5.333 2.667 2.667 0 0 0 0 5.333ZM11.334 7.333l1.333 1.334L15.334 6"
      stroke="#303E47"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  unassigned: (
    <path
      d="M13.333 14v-1.333A2.667 2.667 0 0 0 10.666 10H5.333a2.667 2.667 0 0 0-2.667 2.667V14M8 7.333A2.667 2.667 0 1 0 8 2a2.667 2.667 0 0 0 0 5.333Z"
      stroke="#303E47"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  service: (
    <path
      d="M9.8 4.2a.667.667 0 0 0 0 .933L10.868 6.2a.667.667 0 0 0 .934 0l2.513-2.513A4 4 0 0 1 9.021 8.98l-4.607 4.607a1.414 1.414 0 0 1-2-2L7.021 6.98a4 4 0 0 1 5.293-5.293L9.808 4.193 9.8 4.2Z"
      stroke="#303E47"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  person: (
    <>
      <path
        d="M13.3333 14V12.6667C13.3333 11.9594 13.0524 11.2811 12.5523 10.781C12.0522 10.281 11.3739 10 10.6667 10H5.33333C4.62609 10 3.94781 10.281 3.44772 10.781C2.94762 11.2811 2.66667 11.9594 2.66667 12.6667V14"
        stroke="#303E47"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 7.33333C9.47276 7.33333 10.6667 6.13943 10.6667 4.66667C10.6667 3.19391 9.47276 2 8 2C6.52724 2 5.33333 3.19391 5.33333 4.66667C5.33333 6.13943 6.52724 7.33333 8 7.33333Z"
        stroke="#303E47"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  wrench: (
    <path
      d="M8.8 4.2C8.67785 4.32462 8.60943 4.49216 8.60943 4.66666C8.60943 4.84117 8.67785 5.00871 8.8 5.13333L9.86666 6.2C9.99128 6.32215 10.1588 6.39057 10.3333 6.39057C10.5078 6.39057 10.6754 6.32215 10.8 6.2L13.3133 3.68666C13.6486 4.42746 13.7501 5.25282 13.6043 6.05276C13.4586 6.8527 13.0725 7.58923 12.4975 8.16418C11.9226 8.73914 11.186 9.12522 10.3861 9.27097C9.58615 9.41672 8.76079 9.31522 8.02 8.98L3.41333 13.5867C3.14812 13.8519 2.7884 14.0009 2.41333 14.0009C2.03826 14.0009 1.67855 13.8519 1.41333 13.5867C1.14812 13.3214 0.999119 12.9617 0.999119 12.5867C0.999119 12.2116 1.14812 11.8519 1.41333 11.5867L6.02 6.98C5.68478 6.2392 5.58328 5.41384 5.72903 4.6139C5.87478 3.81396 6.26086 3.07743 6.83581 2.50248C7.41077 1.92752 8.14729 1.54144 8.94723 1.39569C9.74718 1.24994 10.5725 1.35144 11.3133 1.68666L8.80667 4.19333L8.8 4.2Z"
      stroke="#303E47"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  plus: (
    <path
      d="M11.6667 1H2.33333C1.59695 1 1 1.59695 1 2.33333V11.6667C1 12.403 1.59695 13 2.33333 13H11.6667C12.403 13 13 12.403 13 11.6667V2.33333C13 1.59695 12.403 1 11.6667 1Z"
      stroke="#303E47"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  alert: (
    <path
      d="M6.86 2.573 1.215 12a1.333 1.333 0 0 0 1.14 2h11.293a1.332 1.332 0 0 0 1.14-2L9.14 2.573a1.333 1.333 0 0 0-2.28 0v0ZM8 6v2.667M8 11.333h.007"
      stroke="#303E47"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  create: (
    <path
      d="M12.667 2H3.333C2.597 2 2 2.597 2 3.333v9.334C2 13.403 2.597 14 3.333 14h9.334c.736 0 1.333-.597 1.333-1.333V3.333C14 2.597 13.403 2 12.667 2ZM8 5.333v5.333M5.334 8h5.333"
      stroke="#303E47"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
};

export type IconType = keyof typeof ICONS;

interface Props {
  icon: IconType;
  text?: string;
  subText?: React.ReactNode;
  showArrow?: boolean;
  onClick?: () => void;
}

const Root = styled.div<{ onClick?: () => void }>`
  display: flex;
  ${({ onClick }) => onClick && 'cursor: pointer;'}
`;

const IconContainer = styled.div`
  width: 16px;
  margin-right: 0.5rem;
  padding-top: 0.1rem;
`;

const ContentContainer = styled.div`
  flex: 1;
`;

const ArrowContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
`;

/**
 * Dumb component for displaying a cell with icon, some text, and optional chevron
 */
const IconCell = ({ icon, text, subText, showArrow, onClick }: Props): JSX.Element => {
  const theme = useTheme();
  return (
    <Root onClick={onClick}>
      <IconContainer>
        <svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg">
          {ICONS[icon]}
        </svg>
      </IconContainer>
      <ContentContainer>
        {text && (
          <Typography mb={0} weight="medium">
            {text}
          </Typography>
        )}
        {subText && subText}
      </ContentContainer>
      {showArrow && (
        <ArrowContainer>
          <FontAwesomeIcon icon={faChevronRight} color={theme.colors.darkGrey} />
        </ArrowContainer>
      )}
    </Root>
  );
};

export default IconCell;
