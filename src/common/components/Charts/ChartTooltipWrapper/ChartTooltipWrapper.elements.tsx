import styled from 'styled-components';

export const Tooltip = styled.div<{ left?: number; top?: number }>`
  position: absolute;
  display: ${({ left }) => (!left ? 'none' : 'flex')};
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
  width: 0px;
  height: 0px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(-10px);

  .tooltip__content {
    padding: 1em;
    background-color: pink;
    border-radius: 0.5em;
    text-align: center;
    position: absolute;
    bottom: 100%;
    padding-bottom: 20px;

    &:after {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      left: 50%;
      bottom: -5px;
      margin-left: -5px;
      background: pink;
      transform: rotate(45deg);
    }
  }
`;
