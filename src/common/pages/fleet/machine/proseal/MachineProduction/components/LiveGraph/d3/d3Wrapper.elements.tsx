import { styledTheme } from 'common/theme';
import styled from 'styled-components';

export const D3WrapperContainer = styled.div`
  .tooltip-container {
    position: relative;

    .tooltip--inner {
      position: relative;
      display: block;
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

      .key {
        display: inline-block;
        padding-left: 15px;
        font-size: 0.75rem;
        line-height: 1.4;

        span {
          padding: 0 3px;
        }

        .indicator {
          display: block;
          position: relative;
          width: 10px;
          height: 0px;
          margin-right: 5px;

          &::before {
            content: '';
            position: absolute;
            left: -13px;
            top: 4px;
            height: 8px;
            width: 8px;
            background-color: inherit;
            border-radius: 50%;
            display: inline-block;
          }
        }
      }

      .value {
        font-weight: bold;
      }
    }
  }

  .label-container {
    cursor: pointer;
    transition: all 3s linear;

    & > div {
      padding: 3px 3px 0 3px;
      background-color: #ffffff;
      border-width: 1px;
      border-style: solid;
      border-radius: 30px;
    }

    .label--inner {
      transition: all 3s linear;

      .label--description {
        transition: all 3s linear;
        display: none;
      }
    }

    &.visible {
      display: block;
      width: 130px;

      .label--inner {
        display: flex;
      }

      .label--description {
        font-size: 0.75rem;
        display: block;
      }
    }
  }

  .chart-area {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 100%; /* aspect ratio */
    vertical-align: top;
    overflow: hidden;
  }

  .svg-content-responsive {
    display: inline-block;
    position: absolute;
    top: 10px;
    left: 0;
  }

  .linechart--label {
    background: ${styledTheme.colors.secondaryLight};
    border: 0;
    border-radius: 12px;
    padding: 3px 5px;

    .label--inner {
      display: flex;
      flex-direction: row;
      align-items: center;

      .label--description {
        display: none;
      }
    }

    p {
      margin: 0;
    }
  }
`;
