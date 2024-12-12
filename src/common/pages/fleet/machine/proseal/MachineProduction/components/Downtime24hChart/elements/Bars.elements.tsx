import { styledTheme } from 'common/theme';
import styled, { css } from 'styled-components';

function createCSS() {
  let styles = '';
  for (let i = 0; i < 100; i += 1) {
    styles += `
          &.percentage-${i}:after {
              width: calc(${i} * 1%);
          }
         `;
  }
  return css`
    ${styles}
  `;
}

export const BarBlockContainer = styled.div`
  &.bar-indicator-container {
    display: flex;
    flex-direction: row;
    font-size: 0.8rem;
    margin-bottom: 1rem;
    width: 100%;

    p {
      margin: 0;
    }

    .bar-indicator--status {
      display: flex;
      font-weight: 700;
      align-items: end;
      margin-left: 1rem;
      margin-bottom: 0.25rem;
      width: 39%;
      justify-content: flex-start;
    }

    .bar-indicator--bars {
      width: 93%;
      padding-left: 0.35rem;

      .bar-indicator--name {
        color: ${styledTheme.colors.grayMedium};
        font-weight: 500;
      }

      dl {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 34px;
        margin: 0;
        margin-top: -9px;
      }

      dt {
        display: block;
        align-self: flex-start;
        text-align: center;
        width: 100%;
      }
    }
  }
`;

interface Props {
  color: string;
}

export const DL = styled.dl<Props>`
  .percentage: after {
    background-color: ${({ color }) => color};
  }
`;

export const DD = styled.dd`
  &.percentage {
    height: 12px;
    margin: 0;
    margin-bottom: 0.25rem;

    &:after,
    &:before {
      border-radius: 3px;
    }

    &:after {
      content: '';
      top: -14px;
      display: block;
      width: 100%;
      height: 90%;
      position: relative;
      cursor: pointer;
    }

    &:before {
      content: '';
      top: 12px;
      display: block;
      background-color: #f2f3f4;
      width: 100%;
      height: 90%;
      position: relative;
      cursor: pointer;
    }

    .text {
      position: relative;
      color: ${styledTheme.colors.grayMedium};
      font-weight: 500;
      padding-right: 0.35rem;
      width: 100%;
      display: block;
      text-align: right;
    }
  }

  ${createCSS()};
`;
