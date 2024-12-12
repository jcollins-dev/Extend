import styled from 'styled-components';

export const SkidChartTooltipContainer = styled.div`
  display: flex;
  gap: 0.4em;
  flex-direction: column;

  .tooltip__date {
    font-weight: 500;
    width: 100%;
    padding-bottom: 0.4em;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.3);
    border-width: 0px 0px 1px 0px;
  }
`;
export const SkidChartTooltipItem = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  gap: 0.4em;

  &:before {
    content: '';
    width: 0.8em;
    height: 0.8em;
    border-radius: 50%;
    background-color: ${({ color }) => color || 'black'};
    flex-grow: 0;
  }
`;
