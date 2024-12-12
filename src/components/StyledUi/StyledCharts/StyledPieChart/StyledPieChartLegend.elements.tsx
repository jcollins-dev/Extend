import styled from 'styled-components';

export const baseClass = `Styled-pie-chart-legend`;

export const StyledPieChartLegendContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  height: 100%;
  overflow: auto;
  margin: 0;
  padding: 0;
`;

interface StyledPieChartLegendItemContainerProps {
  color?: string;
}

export const StyledPieChartLegendItemContainer = styled.li<StyledPieChartLegendItemContainerProps>`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 1.1em;
  transition: opacity 300ms;

  &[data-muted='true'] {
    opacity: 0.3;
  }

  &:hover {
    opacity: 1;
    cursor: pointer;
  }

  ${({ color }) =>
    color &&
    `

    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: .3em;
 

    &:before {
      content: '';
      width: 1.2em;
      height: 1.2em;
      display: block;
      transform: translateY(3px);
      background-color: ${color};
      border-radius: 3px;
    }

  `}

  button {
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
