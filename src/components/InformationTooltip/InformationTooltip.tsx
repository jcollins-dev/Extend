import React, { ReactElement } from 'react';
import Tooltip from 'rc-tooltip';
// Icons
import { InformationIcon } from 'icons';
// Theme
import { default as theme } from 'themes';
import 'rc-tooltip/assets/bootstrap.css';
import './InformationTooltip.css';

interface InformationTooltipProps {
  placement: string;
  tooltipText: string;
}

const InformationTooltip = ({ placement, tooltipText }: InformationTooltipProps): ReactElement => (
  <Tooltip
    overlayClassName="information-tooltip"
    placement={placement}
    overlay={<span>{tooltipText}</span>}
    arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
    overlayStyle={{
      width: '10.3125rem',
      fontSize: '0.75rem',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '0.875rem',
      letterSpacing: '0em',
      textAlign: 'left'
    }}
  >
    <a href="#!">{(InformationIcon as (color?: string) => JSX.Element)(theme.colors.darkGrey)}</a>
  </Tooltip>
);

export default InformationTooltip;
