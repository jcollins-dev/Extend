import styled from 'styled-components';
import { StyledContainer } from './StyledContainer';

export interface UiProps {
  pageType?: 'dashboard' | 'machineHealth'; // add page layout types here
}

export const PageContainer = styled(StyledContainer).attrs(({ pageType }: UiProps) => ({
  className: pageType === 'dashboard' ? `ui-page ui-page__dashboard` : `ui-page`
})) <UiProps>`
  ${({ pageType }) => {
    switch (pageType) {
      case 'dashboard':
      case 'machineHealth':
        return `
        display: flex;
        flex-direction: column;
        height: 100%;`
      default:
        return `
        display: flex;
        flex-flow: column;
        height: 100%;
      `;
    }
  }}
`;
