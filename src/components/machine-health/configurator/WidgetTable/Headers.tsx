import React from 'react';
import styled from 'styled-components';

// Types
import { HeaderProps } from 'types';

/* Styled components */

const StyledTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledHeaderWrapperNoChildren = styled.thead`
  tr {
    th {
      border-bottom: ${(props) => props.theme.colors.borders.border02.border};
      border-top: none;
      font-size: ${(props) => props.theme.typography.components.tableHeader.size};
      font-weight: bold;
      line-height: ${(props) => props.theme.typography.components.tableHeader.lineHeight};
    }

    /* Re-position last header to appear over expand button */
    th:nth-last-child(2) {
      div {
        justify-content: flex-end;
        border-top-right-radius: 0.5rem;
      }
    }

    th:last-child {
      padding: 0;
      width: 0;
      border-top-right-radius: 0.5rem;
    }

    th:first-child {
      border-top-left-radius: 0.5rem;
    }
  }
`;

export const StyledHeaderWrapper = styled(StyledHeaderWrapperNoChildren)`
  tr {
    /* Re-position last header to appear over expand button */
    th:nth-last-child(2) {
      border-top-right-radius: 0.5rem;
      padding-right: 0;
      transform: translateX(0.75rem);
    }
  }
`;

export const StyledHeaderRow = styled.tr<{ bg?: string }>`
  background-color: ${(props) => props.theme.colors.background.background2};
`;

/* End of styled components */

export const Header = ({ title }: HeaderProps): JSX.Element => {
  return <StyledTitleWrapper>{title}</StyledTitleWrapper>;
};
