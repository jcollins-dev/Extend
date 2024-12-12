import styled from 'styled-components';

export const PieChartLegendContainer = styled.ul`
  li {
    list-style: none;
    padding: 0.3em 0;
    margin: 0;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.7em;
    font-size: 1.1em;

    &[data-muted='true'] {
      opacity: 0.5;
    }

    button {
      display: flex;
      gap: 0.5em;
      border: none;
      background-color: transparent;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
      align-items: center;

      &:before {
        content: '';
        width: 1em;
        height: 1em;
        display: block;
        border-radius: 4px;
      }
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
  }
`;
interface ColorProps {
  color?: string;
}
export const PieChartLegendItemContainer = styled.li<ColorProps>`
  button:before {
    background-color: ${({ color }) => color};
  }
`;
