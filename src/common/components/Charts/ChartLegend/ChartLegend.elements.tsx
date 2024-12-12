import styled from 'styled-components';

export const ChartLegendContainer = styled.ul`
  display: flex;
  gap: 1em;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: .8em;
  justify-content: center;
  padding-top 1em;
  
  &.is-vertical {
    flex-direction: column;
    padding-top: 0;
  }

`;

export const ItemContainer = styled.li<{ color?: string }>`
  min-width: max-content;

  ${({ color }) => {
    if (color)
      return `

      display: grid;
      gap: .35em;
      grid-template-columns: auto 1fr;
      align-items: center;
      justify-content: center;

      &:before {
        content: '';
        width: 1.1em;
        height: 1.1em;
        border-radius: 3px;

        background-color: ${color};
      }
    `;
  }}
`;
