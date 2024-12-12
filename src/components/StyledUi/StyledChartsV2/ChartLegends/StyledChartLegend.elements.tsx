import styled from 'styled-components';
import { styledTheme } from 'components/StyledUi/theme';

export const baseClass = `styled-chart-legend`;

export const StyledChartLegendContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  max-height: 100%;
  overflow-x: auto;
  margin: 0;
  padding: 0;
`;

interface StyledChartLegendItemContainerProps {
  color?: string;
}

export const StyledChartLegendItemContainer = styled.li<StyledChartLegendItemContainerProps>`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5em;
  font-size: 1.1em;

  transition: all 200ms;

  &[data-muted='true'] {
    opacity: 0.5;
  }

  &:before {
    content: '';
    width: 1.2em;
    height: 1.2em;
    display: block;
    background-color: ${({ color }) => color};
    border-radius: ${styledTheme.radius.xs};
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
