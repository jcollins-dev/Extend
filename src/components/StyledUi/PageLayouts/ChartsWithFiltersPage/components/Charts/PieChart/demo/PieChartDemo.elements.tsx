import styled from 'styled-components';

export const PieChartDemoContainer = styled.div`
  width: 100%;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;

  .dimensions-container {
    max-width: 300px;
    max-height: 300px;
  }

  .pie-chart-wrapper div svg text:before {
    background: red;
    border-radius: 2px;
    content: '';
    display: block;
    height: calc(100% - 2px);
    position: absolute;
    transition: all 0.2s ease-in-out;
    width: calc(100% - 2px);
  }
`;
