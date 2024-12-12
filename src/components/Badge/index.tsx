// 3rd party
import styled from 'styled-components';

interface Props {
  variant?: 'circle' | 'square';
  position?: 'top-right' | 'top-left';
}

// Styling
const Badge = styled.div<Props>`
  position: absolute;
  top: -0.5rem;
  ${(props) => (props.position && props.position === 'top-left' ? 'left:' : 'right:')} -0.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: ${(props) => (props.variant && props.variant === 'square' ? '0' : '0.5rem')};
  font-size: 0.625rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.negativeRed};
  color: white;
`;

export default Badge;
