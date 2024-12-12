// 3rd party libs
import React, { ReactElement } from 'react';
import { VictoryTooltip, VictoryTooltipProps } from 'victory';

// Theme
import theme from 'themes';

const getStatusColor = (status: string, statusCategory: string) => {
  if (status.includes('Emergancy Stop')) {
    return theme.colors.prosealColors.darkRed;
  } else if (statusCategory.includes('Machine Stopped')) {
    return theme.colors.prosealColors.orange;
  }
  return theme.colors.prosealColors.darkPurple;
};

interface StatusTooltipDatum {
  label: string;
  statusCategory: string;
}

interface StatusTooltipProps extends VictoryTooltipProps {
  datum?: StatusTooltipDatum;
}

const StatusTooltip = (props: StatusTooltipProps): ReactElement => {
  const color = getStatusColor(props.datum?.label || '', props.datum?.statusCategory || '');
  return (
    <VictoryTooltip
      {...props}
      flyoutStyle={{
        stroke: color,
        fill: color
      }}
      style={{ fill: 'white' }}
    />
  );
};

export default StatusTooltip;
