import { ReactNode } from 'react';
import { WidgetUiProps } from 'components/StyledUi/WidgetUi';

export interface TileWidgetCellValueProps {
  value?: ReactNode;
  title?: ReactNode;
  label?: ReactNode;
}
export interface TileWidgetProps extends WidgetUiProps {
  cellValues?: TileWidgetCellValueProps[];
  subTitle?: ReactNode;
}
