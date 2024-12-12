import { styledTheme } from 'common/theme';
import styled from 'styled-components';

export const Downtime24hChartContainer = styled.div`
  display: block;
  width: 100%;

  .bars {
    margin-left: 2rem;
  }

  .bars-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .bars-header--switch {
      border: 0;
      background: none;
      cursor: pointer;
    }

    h3 {
      color: ${styledTheme.colors.grayMedium};
      margin: 0;
      margin-bottom: 0.5rem;
    }

    p {
      margin-top: 0;
      margin-bottom: 1rem;
    }
  }
`;
