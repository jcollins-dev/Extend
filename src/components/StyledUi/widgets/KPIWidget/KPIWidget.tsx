import React, { ReactNode } from 'react';
import { WidgetUi, WidgetUiProps } from 'components';
import { KPIWidgetMain } from './KPIWidget.elements';
import { ProgressBarArea } from 'components/StyledUi/ProgressBar/ProgressBarArea';
import { useTranslation } from 'react-i18next';

export interface KPIWidgetCellProps {
  label?: string;
  value: number | string;
  cellId?: number | string;
  units?: string;
}

export type KPIWidgetValuesProps = KPIWidgetCellProps[];

export interface KPIWidgetProgresProps {
  label?: string;
  value?: number;
}

export interface KPIWidgetProps extends WidgetUiProps {
  translateTitle?: string;
  progress?: KPIWidgetProgresProps;
  values?: KPIWidgetValuesProps;
  Icon?: ReactNode;
}

const KPIWidgetCell = ({ label, value, units }: KPIWidgetCellProps): JSX.Element => {
  //if (!label || !value) return <div>error getting value</div>

  return (
    <div className={`kpi-widget-cell`}>
      <div className="kpi-widget-cell__value">
        {value}
        {units && <span className="kpi-widget-cell__units"> {units}</span>}
      </div>
      <div className="kpi-widget-cell__label">{label}</div>
    </div>
  );
};

export const KPIWidget = ({
  progress,
  values,
  className,
  hasStatus,
  translateTitle,
  title,
  ...rest
}: KPIWidgetProps): JSX.Element => {
  const { t } = useTranslation(['mh']);

  title = translateTitle ? `${t(translateTitle)}` : title;

  className = className
    ? `${className} widget-ui--kpi-widget kpi-res-font`
    : `widget-ui--kpi-widget kpi-res-font`;

  let mainClassName = 'widget-ui-main widget-ui-main--kpi-widget';

  if (values?.length == 3) mainClassName = `${mainClassName} 3-col`;
  if (progress) mainClassName = `${mainClassName} no-pad--top`;

  const widgetUiSettings = {
    ...rest,
    title,
    className: className
      ? `${className} widget-ui--kpi-widget kpi-res-font`
      : `widget-ui--kpi-widget kpi-res-font`,
    SubHeader: !progress ? undefined : (
      <ProgressBarArea
        progress={Number(progress.value)}
        className={hasStatus ? `status--${hasStatus}` : undefined}
      />
    ),
    Main: (
      <KPIWidgetMain className={mainClassName}>
        {values?.map((item, i) => (
          <KPIWidgetCell key={i} {...item} />
        ))}
      </KPIWidgetMain>
    ),
    styleType: 'v2'
  };

  return <WidgetUi {...widgetUiSettings} />;
};
