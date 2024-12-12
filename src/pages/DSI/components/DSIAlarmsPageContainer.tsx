import styled from 'styled-components';
import { styledTheme } from 'components';

export const DSIAlarmsPageContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;

  grid-gap: ${styledTheme.space.base};

  .dsi-alarms__header {
    display: flex;
    justify-content: flex-end;
  }
`;
