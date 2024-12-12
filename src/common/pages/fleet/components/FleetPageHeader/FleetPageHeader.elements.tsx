import styled from 'styled-components';
import { styledTheme } from 'components';

export const FleetPageHeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1em;
  font-size: clamp(14px, 1.4vw, 17px);

  color: ${styledTheme.color.main};

  .fleet-page-header__bread-crumbs {
    min-height: 1em;
    display: flex;
    gap: 0.7em;
  }

  .bread-crumbs {
    flex-grow: 0;
  }
`;
