import styled from 'styled-components';

export const DoctsChartContainer = styled.div`
  .tooltip-container {
    cursor: pointer;
  }

  .vertical-indicator-icon {
    cursor: pointer;
  }

  .vertical-indicator--mark {
    cursor: pointer;
    width: 17px;
    height: 23px;
  }

  .message--inner {
    display: none;
    background: #ffffff;
    padding: 0.45rem;
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.3);
    margin: 0 auto;
    width: 95%;
    border-radius: 5px;

    .tooltip--value {
      p {
        margin: 0;
      }
    }

    .error--line-item {
      padding: 0.45rem 0.25rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      &:last-child {
        border-bottom: 0;
      }
    }
  }

  .message--inner {
    display: none;
    width: 100%;
    height: 100%;

    &.visible {
      display: block;
    }
  }

  .message {
    padding: 5px;
  }

  .color-indicator {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    margin-right: 3px;
  }

  .tooltip--header,
  .error--line-item--header {
    font-weight: 500;
    width: 100%;
    border-bottom: 1px solid grey;
    margin: 5px 0 6px;
    padding-bottom: 3px;
  }

  .error--line-item--header {
    border: 0;
  }

  .tooltip--inner {
    position: relative;
    padding: 0.25rem;
    font-size: 0.75rem;
    padding: 0.35rem 0.25rem 0.35rem 0.35rem;
    background: #ffffff;
    border-width: 1px;
    border-style: solid;
    border-color: #f3f3f3;
    border-radius: 5px;
    box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.3);

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: calc(50% - 3px);
      border-style: solid;
      border-width: 10px 3px 0 3px;
      border-color: #ffffff transparent transparent transparent;
    }

    &::before {
      content: '';
      position: absolute;
      bottom: -11px;
      left: calc(50% - 3px);
      border-style: solid;
      border-width: 10px 3px 0 3px;
      border-color: #d3d3d3 transparent transparent transparent;
    }

    .tooltip--line-item {
      margin: 3px 0;
    }

    .tooltip--value {
      font-weight: 500;
    }

    .color-indicator {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 10px;
      margin-right: 3px;
    }
  }
`;
