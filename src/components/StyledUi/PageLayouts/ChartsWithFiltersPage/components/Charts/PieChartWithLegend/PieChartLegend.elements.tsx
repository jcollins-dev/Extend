import styled from 'styled-components';
import { styledTheme } from 'components/StyledUi/theme';

export const baseClass = `pie-chart-legend`;

export const PieChartLegendContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  max-height: 100%;
  overflow-x: auto;
  margin: 0;
  padding: 0;
`;

interface PieChartLegendItemContainerProps {
  color?: string;
}

export const PieChartLegendItemContainer = styled.li<PieChartLegendItemContainerProps>`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5em;
  font-size: 1.1em;

  &[data-muted='true'] {
    &:before {
      opacity: 0.3;
    }
  }

  &:before {
    content: '';
    width: 1.2em;
    height: 1.2em;
    display: block;
    background-color: ${({ color }) => color};
    border-radius: ${styledTheme.radius.xs};
    transition: all 300ms;
  }

  button {
    display: flex;
    gap: 0.5em;
    border: none;
    background-color: transparent;
    font-family: inherit;
    cursor: pointer;
    text-align: left;
  }

  .item-count {
    opacity: 0.8;
    font-size: 0.9em;
    display: flex;

    &:before {
      content: '(';
    }

    &:after {
      content: ')';
    }
  }
`;
