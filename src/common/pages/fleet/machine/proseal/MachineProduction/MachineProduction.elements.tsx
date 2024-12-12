import styled from 'styled-components';
import { StyledUiContainerProps, styledTheme } from 'components';
import { FleetPageViewContainer } from 'common/pages/fleet/FleetPage.elements';

export const baseClass = 'machine-health-view';
export const adminClass = 'machine-info-admin-view';

export const ViewContainer = styled(FleetPageViewContainer)<StyledUiContainerProps>`
  display: grid;
  padding: 2em 3.5em;
  grid-template-columns: 2fr 1fr 1fr;
  grid-auto-rows: auto;
  grid-auto-flow: row;
  grid-template-areas:
    'machine-overview   feed-factor         downtime'
    'live-graph         live-graph          live-graph'
    'daily-rate-metrics daily-rate-metrics  daily-rate-metrics';

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'machine-overview   feed-factor'
      'machine-overview   downtime'
      'live-graph         live-graph'
      'daily-rate-metrics daily-rate-metrics';

    .machine-overview-widget .widget-ui__main {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'machine-overview'
      'feed-factor'
      'downtime'
      'live-graph'
      'daily-rate-metrics';
  }

  &.machine-info-admin-view {
    grid-template-columns: 1fr;

    @media (min-width: 1100px) {
      grid-template-columns: 3fr 1fr;
    }
  }

  gap: ${styledTheme.space.base};

  .machine-overview-widget {
    grid-area: machine-overview;
  }

  .feed-factor-widget {
    grid-area: feed-factor;
    min-width: 300px;
  }

  .downtime-widget {
    grid-area: downtime;
    min-width: 300px;
    min-height: 275px;
  }

  .live-graph-widget {
    grid-area: live-graph;
    width: 100%;
  }

  .daily-rate-metrics-widget {
    grid-area: daily-rate-metrics;
  }

  .pie-chart-container {
    width: 180px;
    height: 180px;
  }
`;
