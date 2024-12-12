// 3rd party libs
import React, { ReactElement } from 'react';
import { VictoryLabelProps } from 'victory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faBolt, faCircleExclamation, faBan } from '@fortawesome/free-solid-svg-icons';

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

const getStatusIcon = (status: string, statusCategory: string) => {
  if (status.includes('emergancy stop')) {
    return faCircleExclamation;
  } else if (statusCategory.includes('machine stopped')) {
    return faBan;
  }
  return faBolt;
};

interface StatusPointDatum {
  label: string;
  statusCategory: string;
}

interface StatusPointProps extends VictoryLabelProps {
  datum?: StatusPointDatum;
}

const StatusIcon = ({ x, y, datum }: StatusPointProps): ReactElement => {
  return (
    <g stroke="white">
      <circle
        fill={getStatusColor(datum?.label || '', datum?.statusCategory || '')}
        cx={x}
        cy={y}
        r={10}
      />
      <FontAwesomeIcon
        icon={getStatusIcon(datum?.label || '', datum?.statusCategory || '')}
        x={Number(x) - 7.5}
        y={Number(y) - 7.5}
        size="lg"
        width={15}
        height={15}
        color="white"
      />
    </g>
  );
};

export default StatusIcon;
