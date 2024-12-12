// 3rd party
import styled from 'styled-components';

// Types
import { ThresholdValueProps } from 'types';

const PartStockCell = styled.div<ThresholdValueProps>`
  width: 100%;
  height: 100%;
  color: ${(props) =>
    typeof props.thresholdValue === 'number' &&
    typeof props.value === 'number' &&
    props.thresholdValue >= props.value
      ? props.theme.colors.validations.error.primary.fill
      : 'inherit'};
`;

export default PartStockCell;
