// 3rd party libraries
import styled from 'styled-components';
import { transparentize } from 'polished';

// Stock indicator
export interface Props {
  readonly color: string;
}
const Indicator = styled.div<Props>`
  margin: 0.625rem 1.25rem;
  color: ${({ color }) => color};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.875rem;

  &::before {
    display: inline-block;
    box-sizing: border-box;
    // Give some size to the pseudo element
    content: ' ';
    // Clip the background such that the border is not additive and then can
    // be more transparent than the background
    background-clip: padding-box;
    margin-right: 0.625rem;
    height: 1.25rem;
    width: 1.25rem;
    vertical-align: middle;

    border: 0.25rem solid ${({ color }) => transparentize(0.55, color)};
    border-radius: 0.625rem;
    background-color: ${({ color }) => color};
  }
`;
export default Indicator;
