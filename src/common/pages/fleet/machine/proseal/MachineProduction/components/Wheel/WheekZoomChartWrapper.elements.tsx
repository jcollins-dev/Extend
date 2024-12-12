import { styledTheme } from 'common/theme';
import styled from 'styled-components';

export const WheekZoomChartWrapper = styled.div`
  width: 100%;
  margin-top: 0.5rem;

  .recharts-brush-slide {
    fill: ${styledTheme.colors.secondary};
    fill-opacity: 0.3;
  }

  .smallbrush {
    rect:first-child {
      opacity: 0;
    }

    .reacharts-brush-texts {
      opacity: 1;
    }

    .recharts-brush-slide {
      stroke-width: 1;
      stroke: ${styledTheme.colors.secondary};
    }

    .recharts-brush-traveller {
      opacity: 1;
      z-index: 99999;

      &:first-child {
        transform: translate(-10px, 0);
      }
    }
  }

  .recharts-wrapper {
    border: 0;
  }

  .recharts-responsive-container {
    border: 0;
  }

  .recharts-layer.recharts-brush.smallbrush {
    transform: translate(0, -75px);
  }
`;
