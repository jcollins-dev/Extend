import React, { ReactNode } from 'react';
import {
  KPICardWidgetValueCell,
  KPICardWidgetMain,
  KPICardWidgetProps,
  KPICardWidgetValueProps
} from 'components/StyledUi/widgets';

import { WidgetUi, ProgressBar, StatusIcon } from 'components';

export interface Props extends KPICardWidgetProps {
  children?: ReactNode | ReactNode[];
}

export const KPICardWidget = ({
  ga,
  gridArea,
  TitleIcon,
  title,
  className,
  kpiValues,
  kpiProgress,
  hasStatus,
  ...rest
}: Props): JSX.Element => {
  // making sure kpiValues is an array with [...kpiValues] */
  const titleClass =
    typeof title === 'string' ? title?.replace(/\s+/g, '-').toLowerCase() : 'title';

  const Vals = kpiValues
    ? useKpiValues([...kpiValues] as KPICardWidgetValueProps[])
    : [undefined, undefined];

  // setup widget ui
  const widgetUiSettings = {
    ...rest,
    ga,
    gridArea,
    title,
    hasStatus,
    // add class modifiers for page-grid--[grid-area] and widget-ui--[title]
    className: `widget-ui--kpi-card${titleClass ? ` widget-ui--${titleClass}` : ``}${
      ga ? ` page-grid__${ga}` : ``
    }${className ? ` ${className}` : ``}`,
    IconLeft: {
      Icon: TitleIcon,
      label: `${title}`
    },
    IconRight: {
      Icon: <StatusIcon className={hasStatus ? `status--${hasStatus}` : undefined} />,
      label: 'machine status'
    },

    // render a header for spacing, even if empty, that's why there is a ' ' return
    SubHeader: kpiProgress ? (
      <>
        <ProgressBar
          progress={Number(kpiProgress)}
          className={hasStatus ? `status--${hasStatus} progress-bar` : `progress-bar`}
        />
        <div className="kpi-progress-unit">{kpiProgress}%</div>
      </>
    ) : (
      ' '
    ),
    Main: <KPICardWidgetMain>{Vals}</KPICardWidgetMain>
  };

  return <WidgetUi {...widgetUiSettings} />;
};

const useKpiValues = (kpiValues: KPICardWidgetValueProps[]) =>
  kpiValues.map((props, i) => {
    const hasStatusColor = i === 0;
    return (
      <KPICardWidgetValueCell
        fullCol={i === 2}
        key={`cell${i}`}
        {...{ hasStatusColor, ...props }}
      />
    );
  });
