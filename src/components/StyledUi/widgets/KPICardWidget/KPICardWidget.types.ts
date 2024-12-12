import { WidgetUiProps } from 'components';
import { ReactNode } from 'react';

export interface KPICardWidgetValueProps {
  units?: string;
  value?: string | number;
  duration?: string;
  label?: string;
  target?: boolean;
  title?: string;
}

export interface KPICardWidgetProps extends WidgetUiProps {
  TitleIcon?: ReactNode;
  kpiValues?: KPICardWidgetValueProps[];
  kpiTarget?: KPICardWidgetValueProps;
  kpiProgress?: number;
}
