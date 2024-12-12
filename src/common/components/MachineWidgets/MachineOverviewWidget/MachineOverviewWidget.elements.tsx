import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';

interface Props extends StyledUiContainerProps {
  image?: string;
}
export const MachineOverviewWidgetContainer = styled.div<Props>`
  padding: 1em;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  display: grid !important;
  grid-gap: 0.7em;
  align-items: center;
  justify-content: center;

  .machine-overview-widget__image {
    text-align: center;
    img {
      width: 100%;
      height: auto;
      max-width: 200px;
    }
  }

  @media (max-width: 1300px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;

    .machine-overview-widget__image {
      img {
        max-width: 300px;
      }
    }
  }
`;

export const WidgetTilesContainer = styled.div`
  display: grid;
  grid-template-columns: auto 5em 1fr;
  gap: 1em;
  align-items: center;
  justify-content: center;
  max-width: max-content;
  margin: 0 auto;
`;

export const WigetTileCellContainer = styled.div<{ color?: string }>`
  &.widget-tile__cell--icon {
    width: 40px;
    height: 40px;

    span {
      display: flex;
      padding: 0.3em;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      border-radius: 50%;

      background-color: ${({ color }) => color};
    }
  }

  &.widget-tile__cell--title {
    font-weight: 500;
    font-size: 0.9em;
    text-transform: capitalize;
    line-height: 1.4;
    box-sizing: content-box;
  }

  &.widget-tile__cell--value {
    .widget-tile__value {
      font-weight: 500;
      font-size: 1.3em;
      line-height: 1.4;

      color: ${({ color }) => color};

      span {
        color: rgba(0, 0, 0, 0.7);
        font-size: 0.9em;
      }
    }

    .widget-tile__label {
      font-size: 0.8em;
      color: rgba(0, 0, 0, 0.7);
      text-transform: capitalize;
    }
  }
`;
