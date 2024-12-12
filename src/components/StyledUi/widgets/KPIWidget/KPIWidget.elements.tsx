import styled from 'styled-components';

export const KPIWidgetMain = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: clamp(10px, 0.8vw, 13px);

  &.no-pad--top {
    padding-top: 0;
  }

  .kpi-widget-cell {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 50%;
    min-width: max-content;
    text-align: center;
    justify-content: center;
  }

  &.3-col .kpi-widget-cell:nth-child(3) {
    width: 100%;
  }

  .kpi-widget-cell__value {
    font-size: 2.2em;
    font-weight: 900;
  }

  .kpi-widget-cell__units {
    font-size: 0.8em;
  }

  .kpi-widget-cell__label {
    opacity: 0.6;
    font-size: 1.1em;
    font-weight: 500;
  }
`;
